import { type RefObject, use, useEffect, useRef, useState } from 'react';

import { TbEdit, TbPlus, TbTrashX } from 'react-icons/tb';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaRegClone } from 'react-icons/fa6';

import { AuthContext, IconContext } from '../../../../utils/contexts';
import { deleteCity } from '../../../../utils/api';

import { PLUS_EDIT_MINUS_BUTTON_CLASSES } from '../../../../constants/theme';

import { type CityGet } from '@strength-inventory/schemas';

interface ListProps {
  scrollTopRef: RefObject<number>
  cities: CityGet[]
  selectedCityId: string
  setSelectedCityId: React.Dispatch<React.SetStateAction<string>>
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string;
  }>>;
}

export default function List ({
  scrollTopRef,
  cities,
  selectedCityId,
  setSelectedCityId,
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
      deleteCity({ id: id, refresh: auth.refresh, logout: auth.logout }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cities'] });
      setSelectedCityId('');
      setParentNotification({ type: 'success', message: 'city deleted' });
    }
  });

  const [search, setSearch] = useState('');
  // used to manage the enablement of the delete button
  const [selectedCityDistricts, setSelectedCityDistricts] = useState(
    cities.find((city) => city.id === selectedCityId)?.districts
  );

  let filteredCities: CityGet[] = cities;
  if (search) {
    filteredCities = cities.filter((city) => {
      return (
        city.name.toLowerCase().includes(search.toLowerCase())
        || city.id === selectedCityId);
    });
  }

  return (
    <div className='flex flex-1 flex-col gap-1 overflow-y-scroll'>
      <input
        type='text'
        value={search}
        placeholder='search'
        autoComplete='off'
        className='bg-background dark:bg-background-dark pl-1'
        onChange={(event) => {
          setSearch(event.target.value);
        }}
      />
      <div className='flex gap-1 justify-around'>
        <button
          className={PLUS_EDIT_MINUS_BUTTON_CLASSES}
          onClick={() => {
            setSelectedCityId('');
            setFormMode('create');
          }}
        >
          {iconMode
            ? <TbPlus className='text-xl md:text-2xl' />
            : 'create'}
        </button>
        <button
          disabled={!selectedCityId}
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
          disabled={!selectedCityId}
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
          disabled={!selectedCityId
            || !selectedCityDistricts || selectedCityDistricts.length > 0}
          className={PLUS_EDIT_MINUS_BUTTON_CLASSES}
          onClick={() => {
            deleteMutation.mutate(selectedCityId);
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
        {filteredCities.length > 0
          ? (
            <ul className='flex flex-col w-full text-sm'>
              {filteredCities.map((city) => (
                <li key={city.id}>
                  <button
                    aria-pressed={city.id === selectedCityId}
                    className='
                      flex justify-between px-1 w-full
                      aria-pressed:bg-gray-300 dark:aria-pressed:bg-gray-600'
                    onClick={() => {
                      setSelectedCityId(city.id);
                      setSelectedCityDistricts(city.districts);
                    }}
                    onDoubleClick={() => {
                      setSelectedCityId(city.id);
                      setFormMode('edit');
                    }}
                  >
                    <p className='flex-1 min-w-0 truncate text-left'>
                      {city.name}
                    </p>
                    <p className='w-25 text-end'>
                      ({city.districts.length} districts)
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )
          : <ul><li>no data</li></ul>}
      </div>
    </div>
  );
}
