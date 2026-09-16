import { FaStoreSlash } from 'react-icons/fa';
import { TbWorldWww } from 'react-icons/tb';

import { type GymGetEquipment } from '@strength-inventory/schemas';

interface PieceProps {
  equipment: GymGetEquipment
  setClickedEquipment:
  React.Dispatch<React.SetStateAction<GymGetEquipment | null>>
}

export default function Piece ({ equipment, setClickedEquipment }: PieceProps) {
  const {
    name,
    subcategory,
    manufacturer,
    code,
    weightUnit,
    weight,
    startingWeight,
    availableWeights,
    maximumWeight,
    maximumWeightType,
    outOfProduction,
    url,
    notes,
    gymequipment
  } = equipment;

  let notNullUrl: string | undefined;
  if (url) {
    notNullUrl = url;
  }

  let weights;
  if (availableWeights.length > 0) {
    weights = availableWeights.join(' / ');
  }

  return (
    <div className='absolute flex flex-col justify-center h-full w-full'>
      <div className='flex-1' />
      <div
        className='
          flex flex-col gap-3 border-y
          bg-tertiary dark:bg-tertiary-dark p-3 w-full'
      >
        <button
          onClick={() => {
            setClickedEquipment(null);
          }}
          className='
          flex justify-center border rounded-sm
          bg-secondary dark:bg-secondary-dark cursor-pointer hover:inset-ring
          active:inset-ring active:font-semibold'
        >
          close
        </button>

        <h3>
          {notNullUrl
            ? (
              <p className='flex items-center gap-1'>
                {outOfProduction
                  ? (
                    <span>
                      <FaStoreSlash aria-hidden='true' />
                      <span className='sr-only'>out of production</span>
                    </span>
                  )
                  : null}
                {subcategory.includes('plate')
                  ? <span>{gymequipment.count}x</span>
                  : null}
                <a
                  href={notNullUrl}
                  target='_blank'
                  className='
                    flex items-center gap-1 font-bold
                    hover:text-blue-600 dark:hover:text-blue-400'
                >
                  {name} <TbWorldWww className='text-xl' />
                </a>
              </p>
            )
            : (
              <p className='flex items-center gap-1'>
                {outOfProduction
                  ? (
                    <span>
                      <FaStoreSlash aria-hidden='true' />
                      <span className='sr-only'>out of production</span>
                    </span>
                  )
                  : null}
                {subcategory.includes('plate')
                  ? <span>{gymequipment.count}x</span>
                  : null}
                <span className='font-bold'>{name}</span>
              </p>
            )}
        </h3>

        <div className='flex gap-3 divide-x'>
          <div
            className='
              flex flex-col gap-1 w-1/2 wrap-break-word'
          >
            <div className='flex'>
              <h4 className='w-30 italic'>in production:</h4>
              <div className='flex-1'>
                {outOfProduction
                  ? (
                    <p className='flex gap-1 items-center'>
                      <span>no</span>
                      <FaStoreSlash aria-hidden='true' />
                    </p>
                  )
                  : 'yes'}
              </div>
            </div>
            <div className='flex'>
              <h4 className='w-30 italic'>manufacturer:</h4>
              <p className='flex-1'>{manufacturer}</p>
            </div>
            <div className='flex'>
              <h4 className='w-30 italic'>code:</h4>
              <p className='flex-1'>{code}</p>
            </div>
          </div>

          {weightUnit
            ? (
              <div className='flex flex-col gap-1 w-1/2'>
                {weight
                  ? (
                    <div className='flex'>
                      <h4 className='w-35 italic'>weight:</h4>
                      {weight} {weightUnit}
                    </div>
                  )
                  : null}
                {startingWeight
                  ? (
                    <div className='flex'>
                      <h4 className='w-35 italic'>starting weight:</h4>
                      <p>{startingWeight} {weightUnit}</p>
                    </div>
                  )
                  : null}
                {maximumWeight
                  ? (
                    <div className='flex'>
                      {maximumWeightType === 'load'
                        ? <h4 className='w-35 italic'>maximum load:</h4>
                        : <h4 className='w-35 italic'>maximum weight:</h4>}
                      <p>{maximumWeight} {weightUnit}</p>
                    </div>
                  )
                  : null}
                {weights
                  ? (
                    <div className='flex'>
                      <h4 className='w-35 italic'>available weights:</h4>
                      <p className='flex-1'>{weights}</p>
                    </div>
                  )
                  : null}
              </div>
            )
            : null}
        </div>
        <p className='text-xs'>{notes}</p>
      </div>
      <div className='flex-1' />
    </div>
  );
}
