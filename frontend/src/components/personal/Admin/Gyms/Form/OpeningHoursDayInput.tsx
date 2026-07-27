import { useState } from 'react';

import type { Hours } from '@strength-inventory/schemas';

interface OpeningHoursDayInputProps {
  group: 'everyone' | 'members'
  day: 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU'
  editedHours: Hours | undefined
  setHoursChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OpeningHoursDayInput (
  { group, day, editedHours, setHoursChanged }: OpeningHoursDayInputProps
) {
  const [openTime, setOpenTime] = useState(editedHours?.[day]
    ? editedHours[day][0]
      ? editedHours[day][0]
      : ''
    : '');
  const [closeTime, setCloseTime] = useState(editedHours?.[day]
    ? editedHours[day][1]
      ? editedHours[day][1]
      : ''
    : '');

  return (
    <div className='flex gap-0.5'>
      <span className='px-1 w-7'>{day}</span>
      <input
        id={`${group}${day}Open`}
        name={`${group}${day}Open`}
        type='time'
        value={openTime}
        max={closeTime}
        className='
          flex bg-background dark:bg-background-dark w-11
          invalid:text-red-dark dark:invalid:text-red text-center'
        onChange={(event) => {
          setOpenTime(event.target.value);
          setHoursChanged(true);
        }}
      />
      <span className='self-center'>-</span>
      <input
        id={`${group}${day}Close`}
        name={`${group}${day}Close`}
        type='time'
        value={closeTime}
        min={openTime}
        className='
          flex bg-background dark:bg-background-dark w-11
          invalid:text-red-dark dark:invalid:text-red text-center'
        onChange={(event) => {
          setCloseTime(event.target.value);
          setHoursChanged(true);
        }}
      />
      <button
        type='button'
        className='
          border px-0.5 cursor-pointer
          hover:bg-red dark:hover:bg-red-dark'
        onClick={() => {
          setOpenTime('');
          setCloseTime('');
        }}
      >
        X
      </button>
    </div>
  );
}
