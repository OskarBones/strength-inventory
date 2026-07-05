import { use, useRef, useState } from 'react';

import { mutationOptions, useQuery, useQueryClient }
  from '@tanstack/react-query';
import { MdOutlineLocationOn } from 'react-icons/md';

import { deleteGym, getGymsIdAndName } from '../../../../utils/api';

import { AuthContext, IconContext } from '../../../../utils/contexts';

import CreateEditDeleteList from '../CreateEditDeleteList.tsx';
import Form from './Form/Index.tsx';
import Notification from '../../../Notification.tsx';

export default function AdminGyms () {
  const auth = use(AuthContext);
  const iconMode = use(IconContext);

  const queryClient = useQueryClient();

  const scrollTopRef = useRef(0);

  const [formMode, setFormMode] = useState('hidden');
  const [selectedGymId, setSelectedGymId] = useState('');

  const [notification, setNotification] = useState({
    type: '',
    message: ''
  });

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
      setNotification({ type: 'success', message: 'gym deleted' });
    }
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    // give Notification a place to hide
    <div className='relative flex flex-1 overflow-y-hidden'>
      <div
        className='
          flex flex-1 flex-col gap-1 border rounded-sm max-w-full
          bg-secondary dark:bg-secondary-dark p-3'
      >
        <h2 className='self-center font-bold'>
          {iconMode
            ? <MdOutlineLocationOn className='text-2xl' />
            : 'gyms'}
        </h2>

        {formMode === 'hidden'
          ? (
            <CreateEditDeleteList
              scrollTopRef={scrollTopRef}
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
              setParentNotification={setNotification}
            />
          )}
      </div>

      <Notification
        type={notification.type}
        message={notification.message}
        setNotification={setNotification}
      />
    </div>
  );
}
