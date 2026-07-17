import { useRef, useState } from 'react';

import { MAX_WEIGHT } from '@strength-inventory/schemas';

interface AvailableWeightsProps {
  availableWeights: number[]
  setAvailableWeights: React.Dispatch<React.SetStateAction<number[]>>
  startingWeight: string
  maximumWeight: string
}

export default function AvailableWeights ({
  availableWeights, setAvailableWeights, startingWeight, maximumWeight
}: AvailableWeightsProps) {
  const [newWeight, setNewWeight] = useState('');
  const [isInvalidStep, setIsInvalidStep] = useState(false);

  const newWeightInputRef = useRef<HTMLInputElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  function isNewWeightInvalid () {
    const weight = Number(newWeight);

    return (
      availableWeights.includes(weight) || weight <= 0
    );
  }

  function compareNumbers (a: number, b: number) {
    return a - b;
  }

  function handleAddWeight () {
    const updatedWeights = [...availableWeights, Number(newWeight)];
    updatedWeights.sort(compareNumbers);
    setAvailableWeights(updatedWeights);
    setNewWeight('');
  }

  let lowestRequirement: number | null = null;
  if (startingWeight) {
    lowestRequirement = Number(startingWeight);
  }

  let highestRequirement: number | null = null;
  if (maximumWeight) {
    highestRequirement = Number(maximumWeight);
  }

  return (
    <div className='flex flex-col'>
      <label>available weights</label>
      <div
        className={`
          flex flex-col gap-2 bg-tertiary dark:bg-tertiary-dark p-1
          ${lowestRequirement
          && lowestRequirement !== Math.min(...availableWeights)
          && availableWeights.length > 0
      ? 'outline outline-red dark:outline-red-dark'
      : ''}
          ${highestRequirement
          && highestRequirement !== Math.max(...availableWeights)
          && availableWeights.length > 0
      ? 'outline outline-red dark:outline-red-dark'
      : ''}`}
      >
        <div className='flex flex-wrap gap-3'>
          {availableWeights.map((weight) => (
            <button
              type='button'
              key={weight}
              className='
                border px-1 cursor-pointer
                hover:bg-red hover:dark:bg-red-dark'
              onClick={() => {
                const newWeights
                  = availableWeights
                    .filter((availableWeight) => availableWeight !== weight);
                setAvailableWeights(newWeights);
              }}
            >
              {weight}
            </button>
          ))}
        </div>

        <div className='flex gap-2'>
          <label htmlFor='new-weight'>add weight:</label>
          <input
            id='new-weight'
            ref={newWeightInputRef}
            type='number'
            value={newWeight}
            min={0}
            max={MAX_WEIGHT}
            step={0.01}
            className='bg-secondary dark:bg-secondary-dark w-20'
            onChange={(event) => {
              setNewWeight(event.target.value);
              const isMismatch
                = newWeightInputRef.current?.validity.stepMismatch;
              setIsInvalidStep(!!isMismatch);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addButtonRef.current?.click();
              }
            }}
          />

          <button
            type='button'
            ref={addButtonRef}
            disabled={
              !newWeight || isNewWeightInvalid() || isInvalidStep
            }
            className='
              border border-dotted border-black dark:border-neutral-400 w-10
              py-0.5 cursor-not-allowed enabled:border-solid
              enabled:bg-green-dark enabled:dark:bg-green
              enabled:text-primary-text-dark enabled:dark:text-primary-text
              enabled:cursor-pointer
              enabled:hover:inset-ring dark:inset-ring-black
              enabled:active:inset-ring enabled:active:font-bold'
            onClick={() => {
              handleAddWeight();
            }}
          >
            add
          </button>

          <button
            type='button'
            className='
              ml-auto border py-0.5 px-1 cursor-pointer
              hover:bg-red hover:dark:bg-red-dark'
            onClick={() => {
              setAvailableWeights([]);
            }}
          >
            clear all
          </button>
        </div>
      </div>
    </div>
  );
}
