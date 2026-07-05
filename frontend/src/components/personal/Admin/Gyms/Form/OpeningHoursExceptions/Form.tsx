/* This component functions both as an edit and add form.
If 'exception' is defined, the form is used for editing an exception.
If not, the form is used for creating an exception. */

import { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import {
  type OpeningHoursException, OpeningHoursExceptionSchema
} from '@strength-inventory/schemas';

interface FormProps {
  exception: OpeningHoursException | undefined
  setEditedExceptionId: React.Dispatch<React.SetStateAction<string>>
  exceptions: OpeningHoursException[]
  setExceptions:
  React.Dispatch<React.SetStateAction<OpeningHoursException[]>>
  setAddException: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Form ({
  exception, setEditedExceptionId, exceptions, setExceptions, setAddException
}: FormProps) {
  const [date, setDate] = useState(exception
    ? exception.date.toISOString().split('T')[0]
    : '');
  const [from, setFrom] = useState(exception
    ? exception.hours[0]
      ? exception.hours[0]
      : ''
    : '');
  const [to, setTo] = useState(exception
    ? exception.hours[1]
      ? exception.hours[1]
      : ''
    : '');
  const [concerns, setConcerns] = useState<string>(exception
    ? exception.concerns
    : '');
  const [reason, setReason] = useState(exception
    ? exception.reason
    : '');
  const [error, setError] = useState('');

  function handleSubmit (event: React.SubmitEvent) {
    function compareDates (a: OpeningHoursException, b: OpeningHoursException) {
      return a.date.getTime() - b.date.getTime();
    }

    event.preventDefault();
    const hours: (string | null)[] = [null, null];
    if (from) {
      hours[0] = from;
    }
    if (to) {
      hours[1] = to;
    }

    try {
      const submittedException = {
        id: exception
          ? exception.id
          : uuidv4(),
        date: new Date(date),
        hours: hours,
        concerns: concerns,
        reason: reason
      };

      const validatedSubmittedException
        = OpeningHoursExceptionSchema.parse(submittedException);

      let otherExceptions;
      if (exception) {
        otherExceptions = exceptions.filter((exception) =>
          exception.id !== submittedException.id);
      } else {
        otherExceptions = exceptions;
      }

      const overlap = otherExceptions.find((exception) =>
        exception.date.getDate() === submittedException.date.getDate()
        && ((exception.concerns === (submittedException.concerns || 'everyone'))
          || submittedException.concerns === 'everyone'));
      if (overlap) {
        throw Error(
          'there already exists an overlapping exception for the date'
        );
      }

      let newExceptions;
      if (exceptions.length > 0) {
        if (exception) {
          newExceptions = exceptions.map((obj) => {
            if (obj.id === exception.id) {
              return validatedSubmittedException;
            }

            return obj;
          });
        } else {
          newExceptions = [
            ...exceptions,
            validatedSubmittedException
          ];
        }
        newExceptions.sort(compareDates);
      } else {
        newExceptions = [validatedSubmittedException];
      }

      setExceptions(newExceptions);
      if (exception) {
        setEditedExceptionId('');
      } else {
        setAddException(false);
      }
      setError('');
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const messages = err.issues.map((issue) => issue.message);
        console.error(messages);
        setError(err.issues[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('ERROR');
      }
    }
  }

  return (
    <form
      autoComplete='off'
      className='flex flex-col gap-1 border p-1'
      onSubmit={handleSubmit}
    >
      <h5 className='font-bold'>
        {exception
          ? 'edit exception'
          : 'add new exception'}
      </h5>

      <div className='flex gap-1'>
        <input
          id='date'
          name='date'
          type='date'
          value={date}
          required
          className={`p-1 w-30 invalid:text-red-dark dark:invalid:text-red
            ${exception
      ? 'bg-secondary dark:bg-tertiary-dark'
      : 'bg-tertiary dark:bg-background-dark'
    }`}
          onChange={(event) => {
            setDate(event.target.value);
          }}
        />
        <div className='flex gap-1'>
          <input
            id='from'
            name='from'
            type='time'
            value={from}
            placeholder='from'
            max={to}
            className={`
              w-12 invalid:text-red-dark dark:invalid:text-red
              ${exception
      ? 'bg-secondary dark:bg-tertiary-dark'
      : 'bg-tertiary dark:bg-background-dark'
    }`}
            onChange={(event) => {
              setFrom(event.target.value);
            }}
          />
          <span className='self-center'>-</span>
          <input
            id='to'
            name='to'
            type='time'
            value={to}
            placeholder='to'
            min={from}
            className={`
              w-12 invalid:text-red-dark dark:invalid:text-red
              ${exception
      ? 'bg-secondary dark:bg-tertiary-dark'
      : 'bg-tertiary dark:bg-background-dark'
    }`}
            onChange={(event) => {
              setTo(event.target.value);
            }}
          />
        </div>
      </div>

      <div className='flex gap-1'>
        <label htmlFor='members'>concerns:</label>
        <select
          id='concerns'
          name='concerns'
          value={concerns}
          required
          className={`pl-1 invalid:text-red-dark dark:invalid:text-red
            ${exception
      ? 'bg-secondary dark:bg-tertiary-dark'
      : 'bg-tertiary dark:bg-background-dark'
    }`}
          onChange={(event) => {
            setConcerns(event.target.value);
          }}
        >
          <option value=''>-- please select a group --</option>
          <option value='everyone'>everyone</option>
          <option value='non-members'>non-members</option>
          <option value='members'>members</option>
        </select>
      </div>

      <div className='flex flex-col'>
        <label htmlFor='reason'>reason</label>
        <textarea
          id='reason'
          name='reason'
          value={reason}
          required
          className={`
            border pl-1
            invalid:border-red dark:invalid:border-red-dark
            ${exception
      ? 'bg-secondary dark:bg-tertiary-dark'
      : 'bg-tertiary dark:bg-tertiary-dark'
    }`}
          onChange={(event) => {
            setReason(event.target.value);
          }}
        />
      </div>

      <div className='flex justify-around mt-2'>
        <button
          type='submit'
          className='
            mr-0.5 border
            bg-green dark:bg-green-dark w-1/2 cursor-pointer
            hover:border-white hover:dark:border-black
            active:border-white active:dark:border-black active:font-bold'
        >
          {exception
            ? 'apply'
            : 'add'}
        </button>
        <button
          type='submit'
          className='
            ml-0.5 border
            bg-red dark:bg-red-dark w-1/2 cursor-pointer
            hover:border-white hover:dark:border-black
            active:border-white active:dark:border-black active:font-bold'
          onClick={() => {
            if (exception) {
              setEditedExceptionId('');
            } else {
              setAddException(false);
            }
          }}
        >
          cancel
        </button>
      </div>

      {error
        ? <p className='text-red-dark dark:text-red'>{error}</p>
        : null}
    </form>
  );
}
