import { use } from 'react';

import { BiCalendarWeek } from 'react-icons/bi';
import { BsCalendar4Week } from 'react-icons/bs';
import { MdKeyboardArrowRight } from 'react-icons/md';

import { IconContext } from '@/utils/contexts';

function ModeButtonIcon ({ title }: { title: string }) {
  if (title === 'next seven days') {
    return (
      <p className='flex gap-1 ml-2 text-xl'>
        <BsCalendar4Week /> <MdKeyboardArrowRight />
      </p>
    );
  }

  if (title === 'regular') {
    return (
      <BiCalendarWeek className='text-xl' />
    );
  }
}

interface ModeButtonProps {
  hoursMode: string
  handleHoursModeToggle: (title: string) => void
  title: string
}

export default function ModeButton (
  {
    hoursMode,
    handleHoursModeToggle,
    title
  }: ModeButtonProps
) {
  const iconMode = use(IconContext);

  return (
    <button
      aria-pressed={hoursMode === title}
      className='
        group flex justify-center items-center py-1 basis-1/2
        cursor-pointer hover:inset-ring active:font-semibold
        aria-pressed:bg-secondary-dark dark:aria-pressed:bg-secondary
        aria-pressed:font-semibold'
      onClick={() => {
        handleHoursModeToggle(title);
      }}
    >
      <div
        className='
          group-aria-pressed:text-primary-text-dark
          dark:group-aria-pressed:text-primary-text'
      >
        {iconMode
          ? <ModeButtonIcon title={title} />
          : <p className='text-sm'>{title}</p>}
      </div>
    </button>
  );
}
