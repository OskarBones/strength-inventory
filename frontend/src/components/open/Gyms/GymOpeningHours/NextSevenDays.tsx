import { useState } from 'react';

import Day from './Day';

import type { GymGet } from '@strength-inventory/schemas';

interface NextSevenDaysProps {
  gym: GymGet
  membersOnly: boolean
  setExceptionReason: React.Dispatch<React.SetStateAction<string>>
}

export default function NextSevenDays ({
  gym, membersOnly, setExceptionReason
}: NextSevenDaysProps) {
  const [present] = useState(() => new Date());
  const nextSeven: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(present);
    nextSeven.push(new Date(nextDate.setDate(nextDate.getDate() + i)));
  }

  const presentCopy = new Date(present);
  const midnightInSevenDays = new Date(
    new Date(presentCopy.setDate(presentCopy.getDate() + 7)).setHours(0, 0, 0)
  );
  const exceptions = gym.openingHoursExceptions.data.filter((exception) => {
    if (membersOnly) {
      return exception.date < midnightInSevenDays
        && exception.concerns !== 'non-members';
    } else {
      return exception.date < midnightInSevenDays
        && exception.concerns !== 'members';
    }
  });

  const currentDay = present.getDay();
  type day = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';
  let days: day[];
  if (currentDay === 1) {
    days = [
      'MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'
    ];
  } else if (currentDay === 2) {
    days = [
      'TU', 'WE', 'TH', 'FR', 'SA', 'SU', 'MO'
    ];
  } else if (currentDay === 3) {
    days = [
      'WE', 'TH', 'FR', 'SA', 'SU', 'MO', 'TU'
    ];
  } else if (currentDay === 4) {
    days = [
      'TH', 'FR', 'SA', 'SU', 'MO', 'TU', 'WE'
    ];
  } else if (currentDay === 5) {
    days = [
      'FR', 'SA', 'SU', 'MO', 'TU', 'WE', 'TH'
    ];
  } else if (currentDay === 6) {
    days = [
      'SA', 'SU', 'MO', 'TU', 'WE', 'TH', 'FR'
    ];
  } else {
    days = [
      'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'
    ];
  }

  const openingHours = {
    MO: '',
    TU: '',
    WE: '',
    TH: '',
    FR: '',
    SA: '',
    SU: ''
  };
  const exceptionReasons: (string | undefined)[] = [];

  for (let i = 0; i < 7; i++) {
    const exception = exceptions.find((exception) =>
      exception.date.getDate() === nextSeven[i].getDate());

    if (exception) {
      if (typeof exception.hours[0] === 'number'
        || typeof exception.hours[1] === 'number') {
        openingHours[days[i]] = exception.hours.join('-');
      }
      exceptionReasons.push(exception.reason);
    } else {
      let hours;
      if (membersOnly) {
        hours = gym.openingHoursMembers[days[i]];
      } else {
        hours = gym.openingHoursEveryone[days[i]];
      }
      openingHours[days[i]] = hours.join('-');
      exceptionReasons.push(undefined);
    }
  }

  return (
    <div className='flex w-full divide-x'>
      <div
        className='flex flex-col justify-center items-center gap-1 w-1/3'
      >
        <Day
          day={days[0]}
          hours={openingHours[days[0]]}
          highlighted={true}
          exception={exceptionReasons[0]}
          setExceptionReason={setExceptionReason}
        />
      </div>
      <div
        className='flex flex-col justify-center items-center gap-1 w-1/3'
      >
        <Day
          day={days[1]}
          hours={openingHours[days[1]]}
          highlighted={false}
          exception={exceptionReasons[1]}
          setExceptionReason={setExceptionReason}
        />
        <Day
          day={days[2]}
          hours={openingHours[days[2]]}
          highlighted={false}
          exception={exceptionReasons[2]}
          setExceptionReason={setExceptionReason}
        />
        <Day
          day={days[3]}
          hours={openingHours[days[3]]}
          highlighted={false}
          exception={exceptionReasons[3]}
          setExceptionReason={setExceptionReason}
        />
      </div>
      <div
        className='flex flex-col justify-center items-center gap-1 w-1/3'
      >
        <Day
          day={days[4]}
          hours={openingHours[days[4]]}
          highlighted={false}
          exception={exceptionReasons[4]}
          setExceptionReason={setExceptionReason}
        />
        <Day
          day={days[5]}
          hours={openingHours[days[5]]}
          highlighted={false}
          exception={exceptionReasons[5]}
          setExceptionReason={setExceptionReason}
        />
        <Day
          day={days[6]}
          hours={openingHours[days[6]]}
          highlighted={false}
          exception={exceptionReasons[6]}
          setExceptionReason={setExceptionReason}
        />
      </div>
    </div>
  );
}
