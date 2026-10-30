import { use, useRef, useState } from 'react';

import { mutationOptions, useQuery, useQueryClient }
  from '@tanstack/react-query';
import { CgGym } from 'react-icons/cg';

import { deleteEquipment, getEquipment } from '@/utils/api';

import { AuthContext, IconContext, NotificationDispatchContext }
  from '@/utils/contexts';

import ErrorMessage from '@/components/ErrorMessage';
import Form from './Form/Index';
import List from './List';
import Loading from '@/components/Loading';

export default function AdminEquipment () {
  const auth = use(AuthContext);
  const iconMode = use(IconContext);
  const dispatch = use(NotificationDispatchContext);

  const queryClient = useQueryClient();

  const scrollTopRef = useRef(0);

  const [search, setSearch] = useState('');
  const [selectedPieceId, setSelectedPieceId] = useState('');
  const [formMode, setFormMode] = useState('hidden');

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => getEquipment()
  });

  const deleteMutationOptions = mutationOptions({
    mutationFn: (id: string) =>
      deleteEquipment({ id: id, refresh: auth.refresh, logout: auth.logout }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['equipment'] });
      void queryClient
        .invalidateQueries({ queryKey: ['equipment'] });
      setSelectedPieceId('');
      dispatch({ type: 'success', message: 'piece deleted' });
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
          ? <CgGym className='text-2xl' />
          : 'equipment'}
      </h2>

      {formMode === 'hidden'
        ? (
          <List
            scrollTopRef={scrollTopRef}
            search={search}
            setSearch={setSearch}
            equipment={data}
            selectedPieceId={selectedPieceId}
            setSelectedPieceId={setSelectedPieceId}
            setFormMode={setFormMode}
            deleteMutationOptions={deleteMutationOptions}
          />
        )
        : (
          <Form
            formMode={formMode}
            setFormMode={setFormMode}
            selectedPieceId={selectedPieceId}
            setSelectedPieceId={setSelectedPieceId}
          />
        )}
    </div>
  );
}
