import { use } from 'react';

import { CgGym } from 'react-icons/cg';
import { FaRegAddressCard } from 'react-icons/fa';
import { TbClock } from 'react-icons/tb';

import { IconContext } from '@/utils/contexts';

function ButtonIcon ({ title }: { title: string }) {
  if (title === 'equipment') {
    return (
      <CgGym className='text-2xl md:text-5xl' />
    );
  }

  if (title === 'memberships') {
    return (
      <FaRegAddressCard className='text-2xl md:text-5xl' />
    );
  }

  if (title === 'opening hours') {
    return (
      <TbClock className='text-2xl md:text-5xl' />
    );
  }
}

interface GymEntryButtonProps {
  activeExtension: string | null
  disabled: boolean
  handleToggle: (title: string) => void
  title: string
}

export default function GymButton (
  { activeExtension, disabled, handleToggle, title }: GymEntryButtonProps
) {
  const iconMode = use(IconContext);

  return (
    <button
      aria-pressed={activeExtension === title}
      disabled={disabled}
      className='
        group flex flex-1 justify-center items-center p-2 cursor-pointer
        enabled:hover:inset-ring enabled:active:inset-ring
        enabled:active:font-semibold
        aria-pressed:bg-secondary-dark dark:aria-pressed:bg-secondary
        aria-pressed:font-semibold
        disabled:bg-background dark:disabled:bg-background-dark
        disabled:cursor-not-allowed'
      onClick={() => {
        handleToggle(title);
      }}
    >
      <h3
        className='
          group-aria-pressed:text-primary-text-dark
          dark:group-aria-pressed:text-primary-text'
      >
        {iconMode
          ? <ButtonIcon title={title} />
          : <span className='text-xs'>{title}</span>}
      </h3>
    </button>
  );
}
