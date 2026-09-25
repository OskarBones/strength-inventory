import { type RefObject, useEffect, useRef } from 'react';

import { FaCaretLeft, FaStoreSlash } from 'react-icons/fa';
import { LuEqualApproximately } from 'react-icons/lu';

import type { GymFrontendGetEquipment }
  from '@strength-inventory/schemas/frontend';

import {
  ACCESSORIES_AND_TOOLS,
  BARS_AND_PLATES,
  CARDIO,
  FREE_WEIGHTS,
  HANDLE_ATTACHMENTS,
  STRENGTH_MACHINES,
  SYSTEMS
} from '@strength-inventory/schemas';

interface ModelListProps {
  subcategory: string | undefined
  equipment: GymFrontendGetEquipment[]
  setClickedEquipment:
  React.Dispatch<React.SetStateAction<GymFrontendGetEquipment | null>>
}

function ModelList ({ subcategory, equipment, setClickedEquipment }:
ModelListProps) {
  const filteredEquipment = subcategory
    ? equipment.filter((piece) => piece.subcategory === subcategory)
    : equipment;

  return (
    filteredEquipment.map((piece) => (
      <li key={piece.id}>
        <button
          disabled={piece.generic}
          className='
            rounded-sm px-1 w-full text-left enabled:cursor-pointer
            enabled:hover:bg-primary enabled:dark:hover:bg-background-dark
            enabled:active:font-semibold'
          onClick={() => {
            setClickedEquipment(piece);
          }}
        >
          <div className='flex items-center'>
            {!piece.subcategory.includes('plate')
              ? piece.gymequipment.count < 5
                ? (
                  <span className='font-light min-w-8'>
                    {piece.gymequipment.count}
                  </span>
                )
                : (
                  <span className='font-light min-w-8'>
                    {/* display counts higher than five as 5+, 10+, 15+ ...*/}
                    {Math.round(piece.gymequipment.count / 5) * 5}+
                  </span>
                )
              : <span className='font-light min-w-8'>:</span>}
            <div className='flex items-center space-x-1'>
              {piece.generic
                ? (
                  <span>
                    <LuEqualApproximately aria-hidden='true' />
                    <span className='sr-only'>generic</span>
                  </span>
                )
                : null}
              {piece.outOfProduction
                ? (
                  <span>
                    <FaStoreSlash aria-hidden='true' />
                    <span className='sr-only'>out of production</span>
                  </span>
                )
                : null}
              <span>{piece.name}</span>
            </div>
          </div>
        </button>
      </li>
    ))
  );
}

interface CategoryProps {
  scrollTopRef: RefObject<number>
  modelView: boolean
  name: string
  equipment: GymFrontendGetEquipment[]
  selectedSubcategory: string
  setSelectedSubcategory: React.Dispatch<React.SetStateAction<string>>
  setClickedEquipment:
  React.Dispatch<React.SetStateAction<GymFrontendGetEquipment | null>>
}

export default function Category ({
  scrollTopRef,
  modelView,
  name,
  equipment,
  selectedSubcategory,
  setSelectedSubcategory,
  setClickedEquipment
}: CategoryProps) {
  const listRef = useRef<HTMLUListElement>(null);

  // reference [2]
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = scrollTopRef.current;
    }
  });

  let equipmentCount = 0;
  equipment.forEach((piece) => {
    // unlike other equipment, plates are only counted as unique types
    if (!piece.subcategory.includes('plate')) {
      equipmentCount += piece.gymequipment.count;
    } else {
      equipmentCount += 1;
    }
  });

  let subcategories: string[];
  if (name === 'systems') {
    subcategories = SYSTEMS;
  } else if (name === 'bars and plate types') {
    subcategories = BARS_AND_PLATES;
  } else if (name === 'free weights') {
    subcategories = FREE_WEIGHTS;
  } else if (name === 'handle attachments') {
    subcategories = HANDLE_ATTACHMENTS;
  } else if (name === 'strength machines') {
    subcategories = STRENGTH_MACHINES;
  } else if (name === 'accessories and tools') {
    subcategories = ACCESSORIES_AND_TOOLS;
  } else {
    subcategories = CARDIO;
  }

  const subcategoryList = subcategories.map((subcategory) => {
    let subcategoryCount = 0;
    equipment.filter((piece) => piece.subcategory === subcategory)
      .forEach((piece) => {
        // unlike other equipment, plates are only counted as unique types
        if (!subcategory.includes('plate')) {
          subcategoryCount += piece.gymequipment.count;
        } else {
          subcategoryCount += 1;
        }
      });

    if (subcategoryCount > 0) {
      return (
        <li key={subcategory}>
          <button
            className='
              rounded-sm px-1 w-full text-left cursor-pointer hover:bg-primary
              dark:hover:bg-background-dark active:font-semibold'
            onClick={() => {
              setSelectedSubcategory(subcategory);
            }}
          >
            <p className='flex items-center'>
              {subcategoryCount < 5
                ? (
                  <span className='font-light min-w-8'>
                    {subcategoryCount}
                  </span>
                )
                : (
                  <span className='font-light min-w-8'>
                    {/* display counts higher than five as 5+, 10+, 15+...*/}
                    {Math.round(subcategoryCount / 5) * 5}+
                  </span>
                )}
              <span>{subcategory}</span>
            </p>
          </button>
        </li>
      );
    }
  });

  return (
    <div>
      <h5 className='mb-1 text-sm font-bold'>{name} ({equipmentCount})</h5>
      {equipment.length > 0
        ? (
          <div className='flex items-center gap-1'>
            {selectedSubcategory && !modelView
              ? (
                <button
                  className='
                    border rounded-sm cursor-pointer
                    hover:bg-primary dark:hover:bg-background-dark h-20'
                  onClick={() => {
                    setSelectedSubcategory('');
                  }}
                >
                  <FaCaretLeft aria-hidden='true' />
                  <span className='sr-only'>close subcategory list</span>
                </button>
              )
              : null}

            <div className='flex flex-1 flex-col gap-1 h-20 text-xs'>
              {selectedSubcategory && !modelView
                ? <h5 className='font-semibold'>{selectedSubcategory}</h5>
                : null}

              <ul
                ref={listRef}
                className='
                  flex flex-1 flex-col gap-1 overflow-y-scroll'
                onScroll={(event) => {
                  if (!selectedSubcategory) {
                    scrollTopRef.current = event.currentTarget.scrollTop;
                  }
                }}
              >
                {modelView
                  ? (
                    <ModelList
                      subcategory={undefined}
                      equipment={equipment}
                      setClickedEquipment={setClickedEquipment}
                    />
                  )
                  : selectedSubcategory
                    ? (
                      <ModelList
                        subcategory={selectedSubcategory}
                        equipment={equipment}
                        setClickedEquipment={setClickedEquipment}
                      />
                    )
                    : subcategoryList}
              </ul>
            </div>
          </div>
        )
        : <p className='h-20 text-xs'>-</p>}
    </div>
  );
}
