import Day from './Day';

import type { GymFrontendGet } from '@strength-inventory/schemas/frontend';

interface RegularHoursProps {
  gym: GymFrontendGet
  membersOnly: boolean
  setExceptionReason: React.Dispatch<React.SetStateAction<string>>
}

export default function RegularHours ({
  gym, membersOnly, setExceptionReason
}: RegularHoursProps) {
  let openingHours;
  if (membersOnly) {
    openingHours = Object.fromEntries(
      Object.entries(gym.openingHoursMembers).map(([day, range]) => [
        day,
        range.join('-')
      ])
    );
  } else {
    openingHours = Object.fromEntries(
      Object.entries(gym.openingHoursEveryone).map(([day, range]) => [
        day,
        range.join('-')
      ])
    );
  }

  return (
    <div className='flex w-full divide-x'>
      <div
        className='flex flex-col justify-center items-center gap-1 w-1/3'
      >
        <Day
          day='MO'
          hours={openingHours.MO}
          highlighted={false}
          exception={undefined}
          setExceptionReason={setExceptionReason}
        />
        <Day
          day='TU'
          hours={openingHours.TU}
          highlighted={false}
          exception={undefined}
          setExceptionReason={setExceptionReason}
        />
        <Day
          day='WE'
          hours={openingHours.WE}
          highlighted={false}
          exception={undefined}
          setExceptionReason={setExceptionReason}
        />
      </div>
      <div
        className='flex flex-col justify-center items-center gap-1 w-1/3'
      >
        <Day
          day='TH'
          hours={openingHours.TH}
          highlighted={false}
          exception={undefined}
          setExceptionReason={setExceptionReason}
        />
        <Day
          day='FR'
          hours={openingHours.FR}
          highlighted={false}
          exception={undefined}
          setExceptionReason={setExceptionReason}
        />
      </div>
      <div
        className='flex flex-col justify-center items-center gap-1 w-1/3'
      >
        <Day
          day='SA'
          hours={openingHours.SA}
          highlighted={false}
          exception={undefined}
          setExceptionReason={setExceptionReason}
        />
        <Day
          day='SU'
          hours={openingHours.SU}
          highlighted={false}
          exception={undefined}
          setExceptionReason={setExceptionReason}
        />
      </div>
    </div>
  );
}
