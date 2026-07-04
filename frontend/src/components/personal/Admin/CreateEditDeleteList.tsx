// used by Gyms and Equipment

import { type RefObject, use, useEffect, useRef, useState } from 'react';

import { TbEdit, TbPlus, TbTrashX } from 'react-icons/tb';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { FaRegClone } from 'react-icons/fa6';

import { IconContext } from '../../../utils/contexts';

import SimpleList from './SimpleList';

import { PLUS_EDIT_MINUS_BUTTON_CLASSES } from '../../../constants/theme';

interface CreateEditDeleteListProps {
  scrollTopRef: RefObject<number>
  data: { id: string, name: string }[] | undefined
  selectedItemId: string
  setSelectedItemId: React.Dispatch<React.SetStateAction<string>>
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  deleteMutationOptions: Omit<
    UseMutationOptions<void, Error, string>, 'mutationKey'>
}

export default function CreateEditDeleteList ({
  scrollTopRef,
  data,
  selectedItemId,
  setSelectedItemId,
  setFormMode,
  deleteMutationOptions
}: CreateEditDeleteListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // reference [2]
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = scrollTopRef.current;
    }
  });

  const iconMode = use(IconContext);

  const deleteMutation = useMutation(deleteMutationOptions);

  const [search, setSearch] = useState('');

  let filteredItems: { id: string, name: string }[] | undefined = data;
  if (search !== '' && data) {
    filteredItems = data.filter((item) => {
      return (
        item.name.toLowerCase().includes(search.toLowerCase())
        || item.id === selectedItemId);
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
            setSelectedItemId('');
            setFormMode('create');
          }}
        >
          {iconMode
            ? <TbPlus className='text-xl md:text-2xl' />
            : 'create'}
        </button>
        <button
          disabled={!selectedItemId}
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
          disabled={!selectedItemId}
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
          disabled={!selectedItemId}
          className={PLUS_EDIT_MINUS_BUTTON_CLASSES}
          onClick={() => {
            deleteMutation.mutate(selectedItemId);
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
          overflow-y-scroll overflow-x-scroll'
        onScroll={(event) => {
          scrollTopRef.current = event.currentTarget.scrollTop;
        }}
      >
        <SimpleList
          data={filteredItems}
          selectedItemId={selectedItemId}
          setSelectedItemId={setSelectedItemId}
          setFormMode={setFormMode}
        />
      </div>
    </div>
  );
}
