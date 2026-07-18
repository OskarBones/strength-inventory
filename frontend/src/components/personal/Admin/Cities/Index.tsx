import { use, useRef, useState } from 'react';

import { PiCity } from 'react-icons/pi';
import { useQuery } from '@tanstack/react-query';

import { getCities } from '../../../../utils/api';

import { IconContext } from '../../../../utils/contexts';

import Error from '../../../Error';
import Form from './Form';
import List from './List';
import Loading from '../../../Loading';
import Notification from '../../../Notification';

export default function AdminCities () {
  const iconMode = use(IconContext);

  const scrollTopRef = useRef(0);

  const [search, setSearch] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [formMode, setFormMode] = useState('hidden');

  const [notification, setNotification] = useState({
    type: '',
    message: ''
  });

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['cities'],
    queryFn: () => getCities()
  });

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={error.message} />;
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
            ? <PiCity className='text-2xl' />
            : 'cities'}
        </h2>

        {formMode === 'hidden'
          ? (
            <List
              scrollTopRef={scrollTopRef}
              search={search}
              setSearch={setSearch}
              cities={data}
              selectedCityId={selectedCityId}
              setSelectedCityId={setSelectedCityId}
              setFormMode={setFormMode}
              setParentNotification={setNotification}
            />
          )
          : (
            <Form
              formMode={formMode}
              setFormMode={setFormMode}
              selectedCityId={selectedCityId}
              setSelectedCityId={setSelectedCityId}
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
