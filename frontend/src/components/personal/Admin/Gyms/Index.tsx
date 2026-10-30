import { use, useRef, useState } from 'react';

import { mutationOptions, useQuery, useQueryClient }
  from '@tanstack/react-query';
import { MdOutlineLocationOn } from 'react-icons/md';

import { AuthContext, IconContext, NotificationDispatchContext }
  from '@/utils/contexts';
import { deleteGym, getGymsIdAndName } from '@/utils/api';

import ErrorMessage from '@/components/ErrorMessage.tsx';
import Form from './Form/Index.tsx';
import List from './List.tsx';
import Loading from '@/components/Loading.tsx';

export default function AdminGyms () {
  const auth = use(AuthContext);
  const iconMode = use(IconContext);
  const dispatch = use(NotificationDispatchContext);

  const queryClient = useQueryClient();

  const scrollTopRef = useRef(0);

  const [search, setSearch] = useState('');
  const [formMode, setFormMode] = useState('hidden');
  const [selectedGymId, setSelectedGymId] = useState('');

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['gymsIdAndName'],
    queryFn: () => getGymsIdAndName()
  });

  const deleteMutationOptions = mutationOptions({
    mutationFn: (id: string) =>
      deleteGym({ id: id, refresh: auth.refresh, logout: auth.logout }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['gyms'] });
      void queryClient.invalidateQueries({ queryKey: ['gymsIdAndName'] });
      setSelectedGymId('');
      dispatch({ type: 'success', message: 'gym deleted' });
    }
  });

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <div
      className='
        flex flex-1 flex-col gap-1 border rounded-sm max-w-full
        bg-secondary dark:bg-secondary-dark p-3 overflow-y-hidden'
    >
      <h2 className='self-center font-bold'>
        {iconMode
          ? <MdOutlineLocationOn className='text-2xl' />
          : 'gyms'}
      </h2>

      {formMode === 'hidden'
        ? (
          <List
            scrollTopRef={scrollTopRef}
            search={search}
            setSearch={setSearch}
            data={data}
            selectedItemId={selectedGymId}
            setSelectedItemId={setSelectedGymId}
            setFormMode={setFormMode}
            deleteMutationOptions={deleteMutationOptions}
          />
        )
        : (
          <Form
            formMode={formMode}
            setFormMode={setFormMode}
            selectedGymId={selectedGymId}
            setSelectedGymId={setSelectedGymId}
          />
        )}
    </div>
  );
}
