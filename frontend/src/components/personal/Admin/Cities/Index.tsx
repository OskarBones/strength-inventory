import { use, useRef, useState } from 'react';

import { GiModernCity } from 'react-icons/gi';
import { useQuery } from '@tanstack/react-query';

import { getCities } from '@/utils/api';

import { IconContext } from '@/utils/contexts';

import ErrorMessage from '@/components/ErrorMessage';
import Form from './Form';
import List from './List';
import Loading from '@/components/Loading';

export default function AdminCities () {
  const iconMode = use(IconContext);

  const scrollTopRef = useRef(0);

  const [search, setSearch] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [formMode, setFormMode] = useState('hidden');

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['cities'],
    queryFn: () => getCities()
  });

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorMessage message={error.message} />;
  }

  data.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()
    ? 1
    : -1));

  return (
    <div
      className='
        flex flex-1 flex-col gap-1 border rounded-sm max-w-full
        bg-secondary dark:bg-secondary-dark p-3 overflow-y-hidden'
    >
      <h2 className='self-center font-bold'>
        {iconMode
          ? <GiModernCity className='text-2xl' />
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
          />
        )
        : (
          <Form
            formMode={formMode}
            setFormMode={setFormMode}
            selectedCityId={selectedCityId}
            setSelectedCityId={setSelectedCityId}
          />
        )}
    </div>
  );
}
