import { use, useState } from 'react';

import { TbClockExclamation, TbEdit, TbPlus, TbTrashX } from 'react-icons/tb';

import { IconContext } from '../../../../../../utils/contexts';

import Exception from './Exception';
import Form from './Form';

import { PLUS_EDIT_MINUS_BUTTON_CLASSES }
  from '../../../../../../constants/theme';

import { type OpeningHoursException } from '@strength-inventory/schemas';

interface OpeningHoursExceptionsProps {
  exceptions: OpeningHoursException[]
  setExceptions:
  React.Dispatch<React.SetStateAction<OpeningHoursException[]>>
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string;
    message: string;
  }>>
}

export default function OpeningHoursExceptions ({
  exceptions, setExceptions, setParentNotification
}: OpeningHoursExceptionsProps) {
  const iconMode = use(IconContext);

  const [selectedExceptionId, setSelectedExceptionId] = useState('');
  const [addException, setAddException] = useState(false);
  const [editedExceptionId, setEditedExceptionId] = useState('');

  return (
    <div className='flex flex-col gap-1'>
      <h4 className='text-sm font-bold'>
        {iconMode
          ? <TbClockExclamation className='text-xl' />
          : <span>exceptional opening hours</span>}
      </h4>
      <div className='flex justify-around gap-1'>
        <button
          disabled={addException}
          className={`${PLUS_EDIT_MINUS_BUTTON_CLASSES} text-xs md:text-xs`}
          onClick={() => {
            setAddException(true);
          }}
        >
          {iconMode
            ? <TbPlus className='text-base' />
            : 'add'}
        </button>
        <button
          disabled={!selectedExceptionId || editedExceptionId !== ''}
          className={`${PLUS_EDIT_MINUS_BUTTON_CLASSES} text-xs md:text-xs`}
          onClick={() => {
            setEditedExceptionId(selectedExceptionId);
            setSelectedExceptionId('');
          }}
        >
          {iconMode
            ? <TbEdit className='text-base' />
            : 'edit'}
        </button>
        <button
          disabled={!selectedExceptionId}
          className={`${PLUS_EDIT_MINUS_BUTTON_CLASSES} text-xs md:text-xs`}
          onClick={() => {
            const newExceptions = exceptions.filter((obj) => {
              if (obj.id !== selectedExceptionId) {
                return obj;
              }
            });

            setExceptions(newExceptions);
            setSelectedExceptionId('');
          }}
        >
          {iconMode
            ? <TbTrashX className='text-base' />
            : 'remove'}
        </button>
      </div>
      {addException
        ? (
          <Form
            exception={undefined}
            setEditedExceptionId={setEditedExceptionId}
            exceptions={exceptions}
            setExceptions={setExceptions}
            setAddException={setAddException}
            setParentNotification={setParentNotification}
          />
        )
        : ''}
      <ul
        className='flex flex-col p-1 bg-background dark:bg-background-dark'
      >
        <hr />
        {exceptions.map((exception) => (
          exception.id !== editedExceptionId
            ? (
              <li key={exception.id}>
                <Exception
                  exception={exception}
                  selectedExceptionId={selectedExceptionId}
                  setSelectedExceptionId={setSelectedExceptionId}
                  setEditedExceptionId={setEditedExceptionId}
                />
                <hr />
              </li>
            )
            : (
              <li key={exception.id}>
                <Form
                  exception={exception}
                  setEditedExceptionId={setEditedExceptionId}
                  exceptions={exceptions}
                  setExceptions={setExceptions}
                  setAddException={setAddException}
                  setParentNotification={setParentNotification}
                />
                <hr />
              </li>
            )
        ))}
      </ul>
    </div>
  );
}
