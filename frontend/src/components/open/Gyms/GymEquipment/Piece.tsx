import { MdOutlineStarRate } from 'react-icons/md';
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
    <div className='flex flex-col gap-3 w-full'>
      <button
        onClick={() => {
          setClickedEquipment(null);
        }}
        className='
        flex justify-center border bg-secondary dark:bg-secondary-dark
        cursor-pointer hover:inset-ring active:inset-ring active:font-semibold'
      >
        close
      </button>

      <h3>
        {notNullUrl
          ? (
            <p className='flex items-center gap-1'>
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
              {outOfProduction
                ? <MdOutlineStarRate />
                : null}
            </p>
          )
          : (
            <p className='flex items-center gap-1'>
              {subcategory.includes('plate')
                ? <span>{gymequipment.count}x</span>
                : null}
              <span className='font-bold'>{name}</span>
              {outOfProduction
                ? <MdOutlineStarRate />
                : null}
            </p>
          )}
      </h3>

      <div className='flex gap-3 divide-x'>
        <div
          className='
            flex flex-col gap-1 w-1/2 wrap-break-word'
        >
          <div className='flex'>
            <p className='w-30 italic'>in production:</p>
            <div className='flex-1'>
              {outOfProduction
                ? (
                  <p className='flex gap-1 items-center'>
                    <span>no</span>
                    <MdOutlineStarRate />
                  </p>
                )
                : 'yes'}
            </div>
          </div>
          <p className='flex'>
            <span className='w-30 italic'>manufacturer:</span>
            <span className='flex-1'>{manufacturer}</span>
          </p>
          <p className='flex'>
            <span className='w-30 italic'>code:</span>
            <span className='flex-1'>{code}</span>
          </p>
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
                    {startingWeight} {weightUnit}
                  </div>
                )
                : null}
              {maximumWeight
                ? (
                  <div className='flex'>
                    {maximumWeightType === 'load'
                      ? <h4 className='w-35 italic'>maximum load:</h4>
                      : <h4 className='w-35 italic'>maximum weight:</h4>}
                    {maximumWeight} {weightUnit}
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
  );
}
