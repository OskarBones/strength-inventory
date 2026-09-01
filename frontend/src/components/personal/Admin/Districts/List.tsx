import { type RefObject, use, useEffect, useRef } from 'react';

import { TbEdit, TbPlus, TbTrashX } from 'react-icons/tb';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaRegClone } from 'react-icons/fa6';

import { AuthContext, IconContext } from '@/utils/contexts';
import { deleteDistrict } from '@/utils/api';

import { PLUS_EDIT_MINUS_BUTTON_CLASSES } from '@/constants/theme';

import { type DistrictGet } from '@strength-inventory/schemas';

interface ListProps {
  scrollTopRef: RefObject<number>
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  districts: DistrictGet[]
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
  const iconMode = use(IconContext);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      deleteDistrict({ id: id, refresh: auth.refresh, logout: auth.logout }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['districts'] });
      setSelectedDistrictId('');
      setParentNotification({ type: 'success', message: 'district deleted' });
    }
  });

  let filteredDistricts: DistrictGet[] = districts;
  if (search) {
    filteredDistricts = districts.filter((district) => {
      return (
        district.name.toLowerCase().includes(search.toLowerCase())
        || district.id === selectedDistrictId);
    });
  }

  return (
    <div className='flex flex-1 flex-col gap-1 rounded-sm overflow-y-scroll'>
      <input
        type='text'
        value={search}
        placeholder='search by name'
        autoFocus
        autoComplete='off'
        className='rounded-sm bg-background dark:bg-background-dark pl-1'
        onChange={(event) => {
          setSearch(event.target.value);
        }}
      />
      <div className='flex gap-1 justify-around'>
        <button
          className={PLUS_EDIT_MINUS_BUTTON_CLASSES}
          onClick={() => {
            setSelectedDistrictId('');
            setFormMode('create');
          }}
        >
          {iconMode
            ? <TbPlus className='text-xl md:text-2xl' />
            : 'create'}
        </button>
        <button
          disabled={!selectedDistrictId}
          className={PLUS_EDIT_MINUS_BUTTON_CLASSES}
          onClick={() => {
            setFormMode('create');
          }}
        >
          {iconMode
            ? <FaRegClone className='my-0.5 text-base md:text-xl' />
            : 'clone'}
        </button>
        <button
          disabled={!selectedDistrictId}
          className={PLUS_EDIT_MINUS_BUTTON_CLASSES}
          onClick={() => {
            setFormMode('edit');
          }}
        >
          {iconMode
            ? <TbEdit className='text-xl md:text-2xl' />
            : 'edit'}
        </button>
        <button
          disabled={!selectedDistrictId}
          className={PLUS_EDIT_MINUS_BUTTON_CLASSES}
          onClick={() => {
            deleteMutation.mutate(selectedDistrictId);
          }}
        >
          {iconMode
            ? <TbTrashX className='text-xl md:text-2xl' />
            : 'delete'}
        </button>
      </div>

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
