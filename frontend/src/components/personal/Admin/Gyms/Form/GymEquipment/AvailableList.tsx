import { type RefObject, useEffect, useRef } from 'react';

import { FaStoreSlash } from 'react-icons/fa';
import { LuEqualApproximately } from 'react-icons/lu';
import { MdOutlinePlaylistAddCheckCircle } from 'react-icons/md';
import { TbWorldWww } from 'react-icons/tb';

import { type GymFrontendGetEquipment }
  from '@strength-inventory/schemas/frontend';

import { type Equipment } from '@strength-inventory/schemas';

interface AvailableListProps {
  scrollTopRef: RefObject<number>
  currentEquipment: GymFrontendGetEquipment[]
  filteredEquipment: Equipment[]
  setEquipmentToAdd: React.Dispatch<React.SetStateAction<Equipment | null>>
}

export default function AvailableList (
  {
    scrollTopRef, currentEquipment, filteredEquipment, setEquipmentToAdd
  }: AvailableListProps
) {
  const listRef = useRef<HTMLDivElement>(null);

  // reference [2]
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = scrollTopRef.current;
    }
  });

  const currentEquipmentIds = currentEquipment.map((piece) => {
    return piece.id;
  });

  return (
    <div
      ref={listRef}
      className='
        flex bg-background dark:bg-background-dark
        max-h-6/10 overflow-y-scroll overflow-x-scroll'
      onScroll={(event) => {
        scrollTopRef.current = event.currentTarget.scrollTop;
      }}
    >
      <ul className='min-w-full text-sm'>
        {filteredEquipment.map((piece) => (
          <li
            key={piece.id}
            className='flex items-center gap-1 pl-1'
          >
            {piece.url
              ? (
                <a
                  href={piece.url}
                  target='_blank'
                  className='w-5'
                >
                  <TbWorldWww className='text-base' />
                </a>
              )
              : <span className='w-5' />}

            <button
              className='
                flex flex-1 items-center space-x-1 whitespace-nowrap
                enabled:cursor-pointer'
              onClick={() => {
                setEquipmentToAdd(piece);
              }}
            >
              <span className='flex w-5'>
                {currentEquipmentIds.includes(piece.id)
                  ? (
                    <MdOutlinePlaylistAddCheckCircle
                      className='text-green-dark dark:text-green text-xl'
                    />
                  )
                  : null}
              </span>
              {piece.generic
                ? <LuEqualApproximately className='text-base' />
                : null}
              {piece.outOfProduction
                ? <FaStoreSlash className='text-base' />
                : null}
              <p>{piece.name}</p>
            </button>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}
