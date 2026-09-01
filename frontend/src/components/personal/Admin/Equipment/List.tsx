import { type RefObject, use, useEffect, useRef } from 'react';

import { TbEdit, TbPlus, TbTrashX } from 'react-icons/tb';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { FaRegClone } from 'react-icons/fa6';

import { IconContext } from '@/utils/contexts';

import SimpleList from '../SimpleList';

import { PLUS_EDIT_MINUS_BUTTON_CLASSES } from '@/constants/theme';

import { type Equipment } from '@strength-inventory/schemas';

interface ListProps {
  scrollTopRef: RefObject<number>
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  equipment: Equipment[] | undefined
  selectedPieceId: string
  setSelectedPieceId: React.Dispatch<React.SetStateAction<string>>
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  deleteMutationOptions: Omit<
    UseMutationOptions<void, Error, string>, 'mutationKey'>
}

export default function List ({
  scrollTopRef,
  search,
  setSearch,
  equipment,
  selectedPieceId,
  setSelectedPieceId,
  setFormMode,
  deleteMutationOptions
}: ListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // reference [2]
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = scrollTopRef.current;
    }
  });

  const iconMode = use(IconContext);

  const deleteMutation = useMutation(deleteMutationOptions);

  let filteredEquipment: { id: string, name: string }[] | undefined = equipment;
  if (search !== '' && equipment) {
    filteredEquipment = equipment.filter((piece) => {
      return (
        piece.name.toLowerCase().includes(search.toLowerCase())
        || piece.subcategory.toLowerCase().includes(search.toLowerCase())
        || piece.manufacturer.toLowerCase().includes(search.toLowerCase()));
    }).map(({ id, name }) => {
      return {
        id: id,
        name: name
      };
    });
  }

  return (
    <div className='flex flex-1 flex-col gap-1 rounded-sm overflow-y-scroll'>
      <input
        type='text'
        value={search}
        placeholder='name, subcategory or manufacturer'
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
            setSelectedPieceId('');
            setFormMode('create');
          }}
        >
          {iconMode
            ? <TbPlus className='text-xl md:text-2xl' />
            : 'create'}
        </button>
        <button
          disabled={!selectedPieceId}
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
          disabled={!selectedPieceId}
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
          disabled={!selectedPieceId}
          className={PLUS_EDIT_MINUS_BUTTON_CLASSES}
          onClick={() => {
            deleteMutation.mutate(selectedPieceId);
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
          data={filteredEquipment}
          selectedItemId={selectedPieceId}
          setSelectedItemId={setSelectedPieceId}
          setFormMode={setFormMode}
        />
      </div>
    </div>
  );
}
