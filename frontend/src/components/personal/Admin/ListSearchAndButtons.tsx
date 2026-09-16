// imported by
// - Districts/List
// - Equipment/List
// - Gyms/List

/* Cities/List contains a visual clone that needs to be kept updated! */

import { use } from 'react';

import { TbEdit, TbPlus, TbTrashX } from 'react-icons/tb';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { FaRegClone } from 'react-icons/fa6';

import { IconContext } from '@/utils/contexts';

import { PLUS_EDIT_MINUS_BUTTON_CLASSES } from '@/constants/theme';

interface ListSearchAndButtonsProps {
  searchPlaceholder: string
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  selectedItemId: string
  setSelectedItemId: React.Dispatch<React.SetStateAction<string>>
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  deleteMutationOptions: Omit<
    UseMutationOptions<void, Error, string>, 'mutationKey'>
}

export default function ListSearchAndButtons ({
  searchPlaceholder,
  search,
  setSearch,
  selectedItemId,
  setSelectedItemId,
  setFormMode,
  deleteMutationOptions
}: ListSearchAndButtonsProps) {
  const iconMode = use(IconContext);

  const deleteMutation = useMutation(deleteMutationOptions);

  return (
    <div className='flex flex-col gap-1'>
      <input
        type='text'
        value={search}
        placeholder={searchPlaceholder}
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
    </div>
  );
}
