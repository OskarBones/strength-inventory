import { type RefObject, useEffect, useRef } from 'react';

import { FaStoreSlash } from 'react-icons/fa6';
import { LuEqualApproximately } from 'react-icons/lu';
import { type UseMutationOptions } from '@tanstack/react-query';

import ListSearchAndButtons from '../ListSearchAndButtons';

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

  let filteredEquipment: {
    id: string,
    name: string,
    generic: boolean,
    outOfProduction: boolean
  }[] | undefined = equipment;
  if (search !== '' && equipment) {
    filteredEquipment = equipment.filter((piece) => {
      return (
        piece.name.toLowerCase().includes(search.toLowerCase())
        || piece.subcategory.toLowerCase().includes(search.toLowerCase())
        || piece.manufacturer.toLowerCase().includes(search.toLowerCase()));
    }).map(({ id, name, generic, outOfProduction }) => {
      return {
        id: id,
        name: name,
        generic: generic,
        outOfProduction: outOfProduction
      };
    })
      .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()
        ? 1
        : -1));
  }

  return (
    <div className='flex flex-1 flex-col gap-1 rounded-sm overflow-y-scroll'>
      <ListSearchAndButtons
        searchPlaceholder='name, subcategory or manufacturer'
        search={search}
        setSearch={setSearch}
        selectedItemId={selectedPieceId}
        setSelectedItemId={setSelectedPieceId}
        setFormMode={setFormMode}
        deleteMutationOptions={deleteMutationOptions}
      />

      <div
        ref={listRef}
        className='
          flex flex-1 bg-background dark:bg-background-dark
          overflow-y-scroll overflow-x-scroll'
        onScroll={(event) => {
          scrollTopRef.current = event.currentTarget.scrollTop;
        }}
      >
        {filteredEquipment && filteredEquipment.length > 0
          ? (
            <ul className='min-w-full text-sm'>
              {filteredEquipment.map((piece) => (
                <li key={piece.id}>
                  <button
                    aria-pressed={piece.id === selectedPieceId}
                    className='
                      flex items-center space-x-1
                      px-1 min-w-full whitespace-nowrap
                      aria-pressed:bg-gray-300 dark:aria-pressed:bg-gray-600'
                    onClick={() => {
                      setSelectedPieceId(piece.id);
                    }}
                    onDoubleClick={() => {
                      setSelectedPieceId(piece.id);
                      setFormMode('edit');
                    }}
                  >
                    {piece.generic
                      ? <LuEqualApproximately />
                      : null}
                    {piece.outOfProduction
                      ? <FaStoreSlash />
                      : null}
                    <p>{piece.name}</p>
                  </button>
                </li>
              ))}
            </ul>
          )
          : (
            <ul className='text-sm'>
              <li className='px-1'>no search results</li>
            </ul>
          )}
      </div>
    </div>
  );
}
