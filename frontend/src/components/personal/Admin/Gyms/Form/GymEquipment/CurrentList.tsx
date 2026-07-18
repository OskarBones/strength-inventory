import {
  IoAddCircle,
  IoAddCircleOutline,
  IoRemoveCircle,
  IoRemoveCircleOutline
} from 'react-icons/io5';
import { TiDelete, TiDeleteOutline } from 'react-icons/ti';
import { MdOutlineStarRate } from 'react-icons/md';
import { type UseMutationResult } from '@tanstack/react-query';

import {
  ACCESSORIES_AND_TOOLS,
  BARS_AND_PLATES,
  CARDIO,
  FREE_WEIGHTS,
  type GymGetEquipment,
  HANDLE_ATTACHMENTS,
  STRENGTH_MACHINES,
  SYSTEMS
} from '@strength-inventory/schemas';

interface CategoryProps {
  name: string
  gymId: string
  equipment: GymGetEquipment[]
  setEquipmentCountMutation: UseMutationResult<{
    id: string;
    gymId: string;
    equipmentId: string;
    count: number;
    createdAt: Date;
    updatedAt: Date;
  }, Error, {
    relationshipId: string;
    count: number;
  }>
  removeEquipmentMutation: UseMutationResult<{
    gymId: string,
    equipmentId: string
  }, Error, {
    gymId: string;
    equipmentId: string;
  }>
}

function Category ({
  name, gymId, equipment, setEquipmentCountMutation, removeEquipmentMutation
}: CategoryProps) {
  const equipmentList = equipment.map((piece) => (
    <div key={piece.id}>
      <li
        key={piece.id}
        className='
          flex items-center px-1 min-w-full
          hover:bg-primary dark:hover:bg-background-dark'
      >
        <div
          className='
            flex flex-1 items-center gap-1
            overflow-hidden text-clip whitespace-nowrap'
        >
          {piece.url
            ? (
              <a
                href={piece.url}
                target='_blank'
                className='underline'
              >
                {piece.name}
              </a>
            )
            : <p>{piece.name}</p>}
          {piece.outOfProduction
            ? <MdOutlineStarRate className='text-base' />
            : null}
        </div>

        <div
          className='flex justify-center items-center gap-1 w-20'
        >
          <button
            className='group relative flex cursor-pointer'
            onClick={() => {
              if (piece.gymequipment.count > 1) {
                setEquipmentCountMutation.mutate({
                  relationshipId: piece.gymequipment.id,
                  count: piece.gymequipment.count - 1
                });
              }
            }}
          >
            <IoRemoveCircleOutline
              className='
                text-xl group-hover:opacity-0 group-active:opacity-0'
            />
            <IoRemoveCircle
              className='
                absolute opacity-0 text-xl
                group-hover:opacity-100 group-active:opacity-100'
            />
          </button>
          <span className='w-4 text-center'>
            {piece.gymequipment.count}
          </span>
          <button
            className='group relative flex cursor-pointer'
            onClick={() => {
              setEquipmentCountMutation.mutate({
                relationshipId: piece.gymequipment.id,
                count: piece.gymequipment.count + 1
              });
            }}
          >
            <IoAddCircleOutline
              className='
                text-xl group-hover:opacity-0 group-active:opacity-0'
            />
            <IoAddCircle
              className='
                absolute opacity-0 text-xl
                group-hover:opacity-100 group-active:opacity-100'
            />
          </button>
        </div>

        <div className='flex w-5'>
          <button
            className='group relative flex cursor-pointer'
            onClick={() => {
              removeEquipmentMutation.mutate({
                gymId, equipmentId: piece.id
              });
            }}
          >
            <TiDeleteOutline
              className='
                text-red-500 text-xl
                group-hover:opacity-0 group-active:opacity-0'
            />
            <TiDelete
              className='
                absolute opacity-0 text-red-500 text-xl
                group-hover:opacity-100 group-active:opacity-100'
            />
          </button>
        </div>
      </li>
      <hr />
    </div>
  ));

  return (
    <div className='flex flex-col'>
      <h3 className='mb-1 text-sm font-bold'>{name}</h3>
      {equipment.length > 0
        ? (
          <ul
            className='flex flex-col text-xs'
          >
            {equipmentList}
          </ul>
        )
        : <p className='text-xs'>-</p>}
    </div>
  );
}

interface CurrentListProps {
  gymId: string,
  gymEquipment: GymGetEquipment[]
  setEquipmentCountMutation: UseMutationResult<{
    id: string;
    gymId: string;
    equipmentId: string;
    count: number;
    createdAt: Date;
    updatedAt: Date;
  }, Error, {
    relationshipId: string;
    count: number;
  }>,
  removeEquipmentMutation: UseMutationResult<{
    gymId: string,
    equipmentId: string
  }, Error, {
    gymId: string;
    equipmentId: string;
  }>
}

export default function CurrentList ({
  gymId, gymEquipment, setEquipmentCountMutation, removeEquipmentMutation
}: CurrentListProps) {
  const systems = gymEquipment.filter((piece) => piece.category === 'system');
  systems.sort((a, b) => {
    const primaryDiff
      = SYSTEMS.indexOf(a.subcategory) - SYSTEMS.indexOf(b.subcategory);

    if (primaryDiff !== 0) {
      return primaryDiff;
    } else {
      return a.subcategory.localeCompare(b.subcategory);
    }
  });

  const barsAndPlates = gymEquipment
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

  const freeWeights = gymEquipment.filter(
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

  const handleAttachments = gymEquipment.filter(
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

  const strengthMachines = gymEquipment.filter(
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

  const accessoriesAndTools = gymEquipment.filter(
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

  const cardio = gymEquipment.filter((piece) => piece.category === 'cardio');
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
    <div className='flex flex-1 flex-col gap-2 min-h-15 overflow-y-scroll'>
      <Category
        name='systems'
        gymId={gymId}
        equipment={systems}
        setEquipmentCountMutation={setEquipmentCountMutation}
        removeEquipmentMutation={removeEquipmentMutation}
      />
      <Category
        name='bars and plates'
        gymId={gymId}
        equipment={barsAndPlates}
        setEquipmentCountMutation={setEquipmentCountMutation}
        removeEquipmentMutation={removeEquipmentMutation}
      />
      <Category
        name='free weights'
        gymId={gymId}
        equipment={freeWeights}
        setEquipmentCountMutation={setEquipmentCountMutation}
        removeEquipmentMutation={removeEquipmentMutation}
      />
      <Category
        name='handle attachments'
        gymId={gymId}
        equipment={handleAttachments}
        setEquipmentCountMutation={setEquipmentCountMutation}
        removeEquipmentMutation={removeEquipmentMutation}
      />
      <Category
        name='strength machines'
        gymId={gymId}
        equipment={strengthMachines}
        setEquipmentCountMutation={setEquipmentCountMutation}
        removeEquipmentMutation={removeEquipmentMutation}
      />
      <Category
        name='accessories and tools'
        gymId={gymId}
        equipment={accessoriesAndTools}
        setEquipmentCountMutation={setEquipmentCountMutation}
        removeEquipmentMutation={removeEquipmentMutation}
      />
      <Category
        name='cardio'
        gymId={gymId}
        equipment={cardio}
        setEquipmentCountMutation={setEquipmentCountMutation}
        removeEquipmentMutation={removeEquipmentMutation}
      />
    </div>
  );
}
