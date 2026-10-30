import { use, useRef, useState } from 'react';

import { TbLassoPolygon } from 'react-icons/tb';
import { useQuery } from '@tanstack/react-query';

import { getDistricts } from '@/utils/api';

import { IconContext } from '@/utils/contexts';

import ErrorMessage from '@/components/ErrorMessage';
import Form from './Form';
import List from './List';
import Loading from '@/components/Loading';

export default function AdminDistricts () {
  const iconMode = use(IconContext);

  const scrollTopRef = useRef(0);

  const [search, setSearch] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [formMode, setFormMode] = useState('hidden');

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['districts'],
    queryFn: () => getDistricts()
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
          ? <TbLassoPolygon className='text-2xl' />
          : 'districts'}
      </h2>

      {formMode === 'hidden'
        ? (
          <List
            scrollTopRef={scrollTopRef}
            search={search}
            setSearch={setSearch}
            districts={data}
            selectedDistrictId={selectedDistrictId}
            setSelectedDistrictId={setSelectedDistrictId}
            setFormMode={setFormMode}
          />
        )
        : (
          <Form
            formMode={formMode}
            setFormMode={setFormMode}
            selectedDistrictId={selectedDistrictId}
            setSelectedDistrictId={setSelectedDistrictId}
          />
        )}
    </div>
  );
}
