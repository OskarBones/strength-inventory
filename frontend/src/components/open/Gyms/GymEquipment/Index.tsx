import { useRef, useState } from 'react';

import { FaStoreSlash } from 'react-icons/fa';
import { LuEqualApproximately } from 'react-icons/lu';

import Category from './Category';
import Piece from './Piece';

import type { GymFrontendGet, GymFrontendGetEquipment }
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

export default function GymEquipment ({ gym }: { gym: GymFrontendGet }) {
  const systemsScrollTopRef = useRef(0);
  const barsAndPlatesScrollTopRef = useRef(0);
  const freeWeightsScrollTopRef = useRef(0);
  const attachmentsScrollTopRef = useRef(0);
  const strMachinesScrollTopRef = useRef(0);
  const accAndToolsScrollTopRef = useRef(0);
  const cardioScrollTopRef = useRef(0);

  const [modelView, setModelView] = useState(false);
  const [clickedEquipment, setClickedEquipment]
    = useState<GymFrontendGetEquipment | null>(null);
  const [systemsSubcategory, setSystemsSubcategory] = useState('');
  const [barsAndPlatesSubcategory, setBarsAndPlatesSubcategory] = useState('');
  const [freeWeightsSubcategory, setFreeWeightsSubcategory] = useState('');
  const [attachmentsSubcategory, setAttachmentsSubcategory] = useState('');
  const [strMachinesSubcategory, setStrMachinesSubcategory] = useState('');
  const [accAndToolsSubcategory, setAccAndToolsSubcategory] = useState('');
  const [cardioSubcategory, setCardioSubcategory] = useState('');

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
    <div
      id={`${gym.id}-equipment`}
      className='relative flex flex-col flex-1 gap-3 border-x border-b'
    >
      <h4 className='sr-only'>equipment at {gym.name}</h4>

      <div
        className={`
          flex flex-col flex-1 gap-3 p-3
          ${clickedEquipment
      ? 'blur'
      : ''
    }`}
      >
        <div className='flex gap-4 items-center text-sm'>
          <div className='flex gap-2'>
            <input
              id='modelView'
              name='modelView'
              type='checkbox'
              value='showModels'
              checked={modelView}
              onChange={() => {
                setModelView(!modelView);
              }}
            />
            <label htmlFor='modelView'>show models</label>
          </div>

          <p className='flex gap-1 items-center italic text-xs'>
            <LuEqualApproximately />generic
          </p>
          <p className='flex gap-1 items-center italic text-xs'>
            <FaStoreSlash />out of production
          </p>
        </div>

        <div className='flex flex-1'>
          <div className='flex flex-col gap-2 pr-1 w-1/2'>
            <Category
              scrollTopRef={systemsScrollTopRef}
              modelView={modelView}
              name='systems'
              equipment={systems}
              selectedSubcategory={systemsSubcategory}
              setSelectedSubcategory={setSystemsSubcategory}
              setClickedEquipment={setClickedEquipment}
            />
            <Category
              scrollTopRef={barsAndPlatesScrollTopRef}
              modelView={modelView}
              name='bars and plate types'
              equipment={barsAndPlates}
              selectedSubcategory={barsAndPlatesSubcategory}
              setSelectedSubcategory={setBarsAndPlatesSubcategory}
              setClickedEquipment={setClickedEquipment}
            />
            <Category
              scrollTopRef={freeWeightsScrollTopRef}
              modelView={modelView}
              name='free weights'
              equipment={freeWeights}
              selectedSubcategory={freeWeightsSubcategory}
              setSelectedSubcategory={setFreeWeightsSubcategory}
              setClickedEquipment={setClickedEquipment}
            />
            <Category
              scrollTopRef={attachmentsScrollTopRef}
              modelView={modelView}
              name='handle attachments'
              equipment={handleAttachments}
              selectedSubcategory={attachmentsSubcategory}
              setSelectedSubcategory={setAttachmentsSubcategory}
              setClickedEquipment={setClickedEquipment}
            />
          </div>
          <div className='flex flex-col gap-2 pl-1 w-1/2'>
            <Category
              scrollTopRef={strMachinesScrollTopRef}
              modelView={modelView}
              name='strength machines'
              equipment={strengthMachines}
              selectedSubcategory={strMachinesSubcategory}
              setSelectedSubcategory={setStrMachinesSubcategory}
              setClickedEquipment={setClickedEquipment}
            />
            <Category
              scrollTopRef={accAndToolsScrollTopRef}
              modelView={modelView}
              name='accessories and tools'
              equipment={accessoriesAndTools}
              selectedSubcategory={accAndToolsSubcategory}
              setSelectedSubcategory={setAccAndToolsSubcategory}
              setClickedEquipment={setClickedEquipment}
            />
            <Category
              scrollTopRef={cardioScrollTopRef}
              modelView={modelView}
              name='cardio'
              equipment={cardio}
              selectedSubcategory={cardioSubcategory}
              setSelectedSubcategory={setCardioSubcategory}
              setClickedEquipment={setClickedEquipment}
            />
          </div>
        </div>
      </div>

      {clickedEquipment
        ? (
          <Piece
            equipment={clickedEquipment}
            setClickedEquipment={setClickedEquipment}
          />
        )
        : null}
    </div>
  );
}
