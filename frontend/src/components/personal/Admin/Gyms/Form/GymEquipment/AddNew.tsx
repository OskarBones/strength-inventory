import { useActionState, useState } from 'react';

import {
  IoAddCircle,
  IoAddCircleOutline,
  IoRemoveCircle,
  IoRemoveCircleOutline
} from 'react-icons/io5';
import { type UseMutationResult } from '@tanstack/react-query';

import handleSubmitError from '../../../../../../utils/handleSubmitError';

import { type Equipment } from '@strength-inventory/schemas';

interface AddNewProps {
  piece: Equipment
  gymId: string
  addEquipmentMutation: UseMutationResult<{
    gymId: string
    equipmentId: string
  }, Error, {
    gymId: string
    equipmentId: string
    count: number
  }>
  setEquipmentToAdd: React.Dispatch<React.SetStateAction<Equipment | null>>
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string
  }>>
}

export default function AddNew ({
  piece,
  gymId,
  addEquipmentMutation,
  setEquipmentToAdd,
  setParentNotification
}: AddNewProps) {
  const [number, setNumber] = useState(1);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_state, dispatchAction, isPending] = useActionState(submit, {
    success: true,
    error: ''
  });

  async function submit () {
    try {
      await addEquipmentMutation
        .mutateAsync({ gymId, equipmentId: piece.id, count: number });
      setEquipmentToAdd(null);
    } catch (err: unknown) {
      return handleSubmitError({ err, setNotification: setParentNotification });
    }
  }

  return (
    <form
      action={dispatchAction}
      className='
        flex flex-col items-center
        bg-background dark:bg-background-dark p-1'
    >
      <p className='text-center'>
        <span className='font-bold'>{piece.subcategory}</span>: {piece.name}
      </p>

      <div
        className='flex justify-center items-center mt-1 mb-2'
      >
        <button
          className='group relative flex cursor-pointer'
          onClick={() => {
            if (number > 1) {
              setNumber(number - 1);
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
        <span className='w-6 text-center'>
          {number}
        </span>
        <button
          className='group relative flex cursor-pointer'
          onClick={() => {
            setNumber(number + 1);
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

        <button
          type='submit'
          disabled={isPending}
          className='
            flex justify-center ml-5 border rounded-md
            bg-green dark:bg-green-dark px-1 w-20 cursor-pointer
            hover:inset-ring active:inset-ring active:font-bold'
        >
          {!isPending
            ? 'add'
            : 'adding...'}
        </button>
      </div>

      {piece.subcategory.includes('plate')
        ? (
          <p className='mb-2 italic text-sm text-center'>
            Counts for loadable plates are not displayed for users.
            You are free and welcomed to enter a precise count,
            but for the foreseeable future it remains unutilized.
          </p>
        )
        : null}

      <button
        type='button'
        className='
          border rounded-md bg-red dark:bg-red-dark px-1 w-12 text-xs
          cursor-pointer hover:inset-ring active:inset-ring active:font-bold'
        onClick={() => {
          setEquipmentToAdd(null);
        }}
      >
        cancel
      </button>
    </form>
  );
}
