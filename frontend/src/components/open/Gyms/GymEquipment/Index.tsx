import { useState } from 'react';

import { MdOutlineStarRate } from 'react-icons/md';

import Piece from './Piece';

import {
  ACCESSORIES_AND_TOOLS,
  BARS_AND_PLATES,
  CARDIO,
  FREE_WEIGHTS,
  type GymGet,
  type GymGetEquipment,
  HANDLE_ATTACHMENTS,
  STRENGTH_MACHINES,
  SYSTEMS
} from '@strength-inventory/schemas';

interface CategoryProps {
  name: string
  equipment: GymGetEquipment[]
  setClickedEquipment:
  React.Dispatch<React.SetStateAction<GymGetEquipment | null>>
}

function Category ({ name, equipment, setClickedEquipment }: CategoryProps) {
  let equipmentCount = 0;
  equipment.forEach((piece) => {
    // unlike other types, plates are only counted as unique types
    if (!piece.subcategory.includes('plate')) {
      equipmentCount += piece.gymequipment.count;
    } else {
      equipmentCount += 1;
    }
  });

  const equipmentList = equipment.map((piece) => (
    <li key={piece.id}>
      <button
        className='
          rounded-sm px-1 w-full text-left cursor-pointer
          hover:bg-primary dark:hover:bg-background-dark active:font-semibold'
        onClick={() => {
          setClickedEquipment(piece);
        }}
      >
        <p className='flex items-center'>
          {!piece.subcategory.includes('plate')
            ? piece.gymequipment.count < 5
              ? (
                <span className='font-light w-6'>
                  {piece.gymequipment.count}
                </span>
              )
              : (
                <span className='font-light w-6'>
                  {/* display counts higher than five as 5+, 10+, 15+...*/}
                  {Math.round(piece.gymequipment.count / 5) * 5}+
                </span>
              )
            : <span className='font-light w-6'>:</span>}
          <span>{piece.name}</span>
          {piece.outOfProduction
            ? <MdOutlineStarRate className='ml-1' />
            : null}
        </p>
      </button>
    </li>
  ));

  return (
    <div>
      <h3 className='mb-1 text-sm font-bold'>{name} ({equipmentCount})</h3>
      {equipment.length > 0
        ? (
          <ul
            className='flex flex-col gap-1 max-h-20 overflow-y-scroll text-xs'
          >
            {equipmentList}
          </ul>
        )
        : <p className='text-xs'>-</p>}
    </div>
  );
}

export default function GymEquipment ({ gym }: { gym: GymGet }) {
  const [clickedEquipment, setClickedEquipment]
    = useState<GymGetEquipment | null>(null);

  const equipment = gym.equipment;

  const systems = equipment.filter((piece) => piece.category === 'system');
  systems.sort((a, b) => {
    const primaryDiff
      = SYSTEMS.indexOf(a.subcategory) - SYSTEMS.indexOf(b.subcategory);

    if (primaryDiff !== 0) {
      return primaryDiff;
    } else {
      return a.subcategory.localeCompare(b.subcategory);
    }
  });

  const barsAndPlates = equipment
    .filter((piece) => piece.category === 'barOrPlate');
  barsAndPlates.sort((a, b) => {
    const primaryDiff
      = BARS_AND_PLATES.indexOf(a.subcategory)
        - BARS_AND_PLATES.indexOf(b.subcategory);

    if (primaryDiff !== 0) {
      return primaryDiff;
    } else {
      return a.subcategory.localeCompare(b.subcategory);
    }
  });

  const freeWeights = equipment.filter(
    (piece) => piece.category === 'freeWeight'
  );
  freeWeights.sort((a, b) => {
    const primaryDiff
      = FREE_WEIGHTS.indexOf(a.subcategory)
        - FREE_WEIGHTS.indexOf(b.subcategory);

    if (primaryDiff !== 0) {
      return primaryDiff;
    } else {
      return a.subcategory.localeCompare(b.subcategory);
    }
  });

  const handleAttachments = equipment.filter(
    (piece) => piece.category === 'handleAttachment'
  );
  handleAttachments.sort((a, b) => {
    const primaryDiff
      = HANDLE_ATTACHMENTS.indexOf(a.subcategory)
        - HANDLE_ATTACHMENTS.indexOf(b.subcategory);

    if (primaryDiff !== 0) {
      return primaryDiff;
    } else {
      return a.subcategory.localeCompare(b.subcategory);
    }
  });

  const strengthMachines = equipment.filter(
    (piece) => piece.category === 'strengthMachine'
  );
  strengthMachines.sort((a, b) => {
    const primaryDiff
      = STRENGTH_MACHINES.indexOf(a.subcategory)
        - STRENGTH_MACHINES.indexOf(b.subcategory);

    if (primaryDiff !== 0) {
      return primaryDiff;
    } else {
      return a.subcategory.localeCompare(b.subcategory);
    }
  });

  const accessoriesAndTools = equipment.filter(
    (piece) => piece.category === 'accessoryOrTool'
  );
  accessoriesAndTools.sort((a, b) => {
    const primaryDiff
      = ACCESSORIES_AND_TOOLS.indexOf(a.subcategory)
        - ACCESSORIES_AND_TOOLS.indexOf(b.subcategory);

    if (primaryDiff !== 0) {
      return primaryDiff;
    } else {
      return a.subcategory.localeCompare(b.subcategory);
    }
  });

  const cardio = equipment.filter((piece) => piece.category === 'cardio');
  cardio.sort((a, b) => {
    const primaryDiff
      = CARDIO.indexOf(a.subcategory) - CARDIO.indexOf(b.subcategory);

    if (primaryDiff !== 0) {
      return primaryDiff;
    } else {
      return a.subcategory.localeCompare(b.subcategory);
    }
  });

  return (
    <div className='flex flex-1 border-x border-b p-3'>
      {clickedEquipment
        ? (
          <Piece
            equipment={clickedEquipment}
            setClickedEquipment={setClickedEquipment}
          />
        )
        : (
          <div className='flex flex-1 min-w-0'>
            <div className='flex flex-col gap-2 pr-1 w-1/2'>
              <Category
                name='systems'
                equipment={systems}
                setClickedEquipment={setClickedEquipment}
              />
              <Category
                name='bars and plate types'
                equipment={barsAndPlates}
                setClickedEquipment={setClickedEquipment}
              />
              <Category
                name='free weights'
                equipment={freeWeights}
                setClickedEquipment={setClickedEquipment}
              />
              <Category
                name='handle attachments'
                equipment={handleAttachments}
                setClickedEquipment={setClickedEquipment}
              />
            </div>
            <div className='flex flex-col gap-2 pl-1 w-1/2'>
              <Category
                name='strength machines'
                equipment={strengthMachines}
                setClickedEquipment={setClickedEquipment}
              />
              <Category
                name='accessories and tools'
                equipment={accessoriesAndTools}
                setClickedEquipment={setClickedEquipment}
              />
              <Category
                name='cardio'
                equipment={cardio}
                setClickedEquipment={setClickedEquipment}
              />
            </div>
          </div>
        )}
    </div>
  );
}
