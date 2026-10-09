import { use } from 'react';

import { BsCalendar3, BsCalendar4Week } from 'react-icons/bs';
import { MdKeyboardArrowRight } from 'react-icons/md';

import { IconContext } from '@/utils/contexts';

function ModeButtonIcon ({ title }: { title: string }) {
  if (title === 'next seven days') {
    return (
      <p className='flex mr-4.5 text-xl'>
        <MdKeyboardArrowRight aria-hidden='true' />
        <BsCalendar4Week aria-hidden='true' />
        <span className='sr-only'>{title}</span>
      </p>
    );
  }

  if (title === 'regular') {
    return (
      <p>
        <BsCalendar3 aria-hidden='true' className='text-xl' />
        <span className='sr-only'>{title}</span>
      </p>
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
      disabled={hoursMode === title}
      className='
        group flex justify-center items-center py-1 basis-1/2
        enabled:cursor-pointer enabled:hover:inset-ring
        enabled:active:inset-ring enabled:active:font-semibold
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
