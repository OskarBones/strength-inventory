import { type RefObject, use, useEffect, useRef } from 'react';

import { mutationOptions, useQueryClient } from '@tanstack/react-query';

import ListSearchAndButtons from '../ListSearchAndButtons';

import { AuthContext } from '@/utils/contexts';
import { deleteDistrict } from '@/utils/api';

import { type DistrictFrontendGet } from '@strength-inventory/schemas/frontend';

interface ListProps {
  scrollTopRef: RefObject<number>
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  districts: DistrictFrontendGet[]
  selectedDistrictId: string
  setSelectedDistrictId: React.Dispatch<React.SetStateAction<string>>
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string;
  }>>;
}

export default function List ({
  scrollTopRef,
  search,
  setSearch,
  districts,
  selectedDistrictId,
  setSelectedDistrictId,
  setFormMode,
  setParentNotification
}: ListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // reference [2]
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = scrollTopRef.current;
    }
  });

  const auth = use(AuthContext);

  const queryClient = useQueryClient();

  const deleteMutationOptions = mutationOptions({
    mutationFn: (id: string) =>
      deleteDistrict({ id: id, refresh: auth.refresh, logout: auth.logout }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['districts'] });
      setSelectedDistrictId('');
      setParentNotification({ type: 'success', message: 'district deleted' });
    }
  });

  let filteredDistricts: DistrictFrontendGet[] = districts;
  if (search) {
    filteredDistricts = districts.filter((district) => {
      return (
        district.name.toLowerCase().includes(search.toLowerCase())
        || district.id === selectedDistrictId);
    });
  }

  return (
    <div className='flex flex-1 flex-col gap-1 rounded-sm overflow-y-scroll'>
      <ListSearchAndButtons
        searchPlaceholder='name'
        search={search}
        setSearch={setSearch}
        selectedItemId={selectedDistrictId}
        setSelectedItemId={setSelectedDistrictId}
        setFormMode={setFormMode}
        deleteMutationOptions={deleteMutationOptions}
      />

      <div
        ref={listRef}
        className='
          flex flex-1 bg-background dark:bg-background-dark
          overflow-y-scroll'
        onScroll={(event) => {
          scrollTopRef.current = event.currentTarget.scrollTop;
        }}
      >
        <ul className='flex flex-col w-full text-sm'>
          {filteredDistricts.map((district) => (
            <li key={district.id}>
              <button
                aria-pressed={district.id === selectedDistrictId}
                className='
                  flex justify-between px-1 w-full
                  aria-pressed:bg-gray-300 dark:aria-pressed:bg-gray-600'
                onClick={() => {
                  setSelectedDistrictId(district.id);
                }}
                onDoubleClick={() => {
                  setSelectedDistrictId(district.id);
                  setFormMode('edit');
                }}
              >
                <p className='flex-1 min-w-0 truncate text-left'>
                  {district.name}
                </p>
                <p className='w-1/3 text-end truncate'>
                  ({district.city.name})
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
