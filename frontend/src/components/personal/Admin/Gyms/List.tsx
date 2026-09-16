import { type RefObject, useEffect, useRef } from 'react';

import { type UseMutationOptions } from '@tanstack/react-query';

import ListSearchAndButtons from '../ListSearchAndButtons';

interface ListProps {
  scrollTopRef: RefObject<number>
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  data: { id: string, name: string }[] | undefined
  selectedItemId: string
  setSelectedItemId: React.Dispatch<React.SetStateAction<string>>
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  deleteMutationOptions: Omit<
    UseMutationOptions<void, Error, string>, 'mutationKey'>
}

export default function List ({
  scrollTopRef,
  search,
  setSearch,
  data,
  selectedItemId,
  setSelectedItemId,
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

  let filteredItems: { id: string, name: string }[] | undefined = data;
  if (search !== '' && data) {
    filteredItems = data.filter((item) => {
      return (
        item.name.toLowerCase().includes(search.toLowerCase())
        || item.id === selectedItemId);
    })
      .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()
        ? 1
        : -1));
  }

  return (
    <div className='flex flex-1 flex-col gap-1 rounded-sm overflow-y-scroll'>
      <ListSearchAndButtons
        searchPlaceholder='name'
        search={search}
        setSearch={setSearch}
        selectedItemId={selectedItemId}
        setSelectedItemId={setSelectedItemId}
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
        {filteredItems && filteredItems.length > 0
          ? (
            <ul className='min-w-full text-sm'>
              {filteredItems.map((item) => (
                <li key={item.id}>
                  <button
                    aria-pressed={item.id === selectedItemId}
                    className='
                      flex px-1 min-w-full whitespace-nowrap
                      aria-pressed:bg-gray-300 dark:aria-pressed:bg-gray-600'
                    onClick={() => {
                      setSelectedItemId(item.id);
                    }}
                    onDoubleClick={() => {
                      setSelectedItemId(item.id);
                      setFormMode('edit');
                    }}
                  >
                    <p>{item.name}</p>
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
