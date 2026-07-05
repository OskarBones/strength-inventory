import { use, useRef, useState } from 'react';

import { LiaDrawPolygonSolid } from 'react-icons/lia';
import { useQuery } from '@tanstack/react-query';

import { getDistricts } from '../../../../utils/api';

import { IconContext } from '../../../../utils/contexts';

import Form from './Form';
import List from './List';
import Notification from '../../../Notification';

export default function AdminDistricts () {
  const iconMode = use(IconContext);

  const scrollTopRef = useRef(0);

  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [formMode, setFormMode] = useState('hidden');

  const [notification, setNotification] = useState({
    type: '',
    message: ''
  });

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['districts'],
    queryFn: () => getDistricts()
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  data.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()
    ? 1
    : -1));

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
            ? <LiaDrawPolygonSolid className='text-2xl' />
            : 'districts'}
        </h2>

        {formMode === 'hidden'
          ? (
            <List
              scrollTopRef={scrollTopRef}
              districts={data}
              selectedDistrictId={selectedDistrictId}
              setSelectedDistrictId={setSelectedDistrictId}
              setFormMode={setFormMode}
              setParentNotification={setNotification}
            />
          )
          : (
            <Form
              formMode={formMode}
              setFormMode={setFormMode}
              selectedDistrictId={selectedDistrictId}
              setSelectedDistrictId={setSelectedDistrictId}
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
