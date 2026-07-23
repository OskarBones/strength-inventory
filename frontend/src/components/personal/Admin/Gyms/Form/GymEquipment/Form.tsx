/* This form opens when a piece is clicked in AvailableList.
If the clicked piece has already been added before,
the form finds editedPiece and subsequent conditionals checking it will
trigger. These conditionals essentially differentiate between editing
and adding a piece. */

import { useActionState, useState } from 'react';

import {
  IoAddCircle,
  IoAddCircleOutline,
  IoRemoveCircle,
  IoRemoveCircleOutline
} from 'react-icons/io5';
import { type UseMutationResult } from '@tanstack/react-query';

import handleSubmitError from '../../../../../../utils/handleSubmitError';

import { FORM_RETURN_BUTTON_CLASSES } from '../../../../../../constants/theme';

import type { Equipment, GymGetEquipment } from '@strength-inventory/schemas';

interface FormProps {
  piece: Equipment
  gymId: string
  currentEquipment: GymGetEquipment[]
  addEquipmentMutation: UseMutationResult<{
    gymId: string
    equipmentId: string
  }, Error, {
    gymId: string
    equipmentId: string
    count: number
  }>
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
  setEquipmentToAdd: React.Dispatch<React.SetStateAction<Equipment | null>>
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string
  }>>
}

export default function Form ({
  piece,
  gymId,
  currentEquipment,
  addEquipmentMutation,
  setEquipmentCountMutation,
  removeEquipmentMutation,
  setEquipmentToAdd,
  setParentNotification
}: FormProps) {
  const editedPiece = currentEquipment.find((current) =>
    current.id === piece.id);

  const [number, setNumber] = useState(() => {
    if (editedPiece) {
      return editedPiece.gymequipment.count;
    } else {
      return 1;
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_state, dispatchAction, isPending] = useActionState(submit, {
    success: true,
    error: ''
  });

  async function submit () {
    try {
      if (editedPiece) {
        await setEquipmentCountMutation
          .mutateAsync({
            relationshipId: editedPiece.gymequipment.id,
            count: number
          });
      } else {
        await addEquipmentMutation
          .mutateAsync({ gymId, equipmentId: piece.id, count: number });
      }
      setEquipmentToAdd(null);
    } catch (err: unknown) {
      return handleSubmitError({ err, setNotification: setParentNotification });
    }
  }

  function handleRemove () {
    removeEquipmentMutation.mutateAsync({
      gymId: gymId,
      equipmentId: piece.id
    }).then(
      () => {
        setEquipmentToAdd(null);
      },
      (err: unknown) => {
        handleSubmitError({ err, setNotification: setParentNotification });
      }
    );
  }

  return (
    <form
      action={dispatchAction}
      className='
        flex flex-col items-center rounded-sm mb-3
        bg-background dark:bg-background-dark p-1'
    >
      <p className='flex gap-1 text-center'>
        <span className='font-bold'>{piece.subcategory}:</span>
        {piece.url
          ? (
            <a href={piece.url} target='_blank' className='underline'>
              {piece.name}
            </a>
          )
          : piece.name}
      </p>

      <div
        className='flex justify-center items-center my-2'
      >
        <button
          type='button'
          disabled={isPending || !editedPiece}
          className={`
            flex justify-center mr-5 border rounded-md
            bg-red dark:bg-red-dark px-1 w-24 cursor-pointer
            hover:inset-ring active:inset-ring active:font-bold
            ${!editedPiece
      ? 'invisible'
      : ''
    }`}
          onClick={() => {
            handleRemove();
          }}
        >
          {!removeEquipmentMutation.isPending
            ? 'remove'
            : 'removing...'}
        </button>

        <button
          type='button'
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
          type='button'
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
          disabled={isPending || removeEquipmentMutation.isPending}
          className='
            flex justify-center ml-5 border rounded-md
            bg-green dark:bg-green-dark px-1 w-24
            disabled:cursor-progress cursor-pointer
            enabled:hover:inset-ring active:inset-ring active:font-bold'
        >
          {editedPiece
            ? !isPending
              ? 'save'
              : 'saving...'
            : !isPending
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
        disabled={isPending}
        className={`
          ${FORM_RETURN_BUTTON_CLASSES}
          disabled:border-dotted py-px w-12 disabled:cursor-progress`}
        onClick={() => {
          setEquipmentToAdd(null);
        }}
      >
        cancel
      </button>
    </form>
  );
}
