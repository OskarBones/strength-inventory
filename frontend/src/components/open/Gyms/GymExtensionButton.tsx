import { use } from 'react';

import { CgGym } from 'react-icons/cg';
import { FaRegAddressCard } from 'react-icons/fa6';
import { TbClock } from 'react-icons/tb';

import { IconContext } from '@/utils/contexts';

function ButtonIcon ({ title }: { title: string }) {
  if (title === 'equipment') {
    return (
      <span>
        <CgGym aria-hidden='true' className='text-2xl md:text-5xl' />
        <span className='sr-only'>equipment</span>
      </span>
    );
  }

  if (title === 'memberships') {
    return (
      <span>
        <FaRegAddressCard className='text-2xl md:text-5xl' />
        <span className='sr-only'>memberships</span>
      </span>
    );
  }

  if (title === 'opening hours') {
    return (
      <span>
        <TbClock className='text-2xl md:text-5xl' />
        <span className='sr-only'>opening hours</span>
      </span>
    );
  }
}

interface GymExtensionButtonProps {
  activeExtension: string | null
  disabled: boolean
  handleToggle: (title: string) => void
  gymId: string
  title: string
}

export default function GymExtensionButton (
  { activeExtension, disabled, handleToggle, gymId, title }:
  GymExtensionButtonProps
) {
  const iconMode = use(IconContext);

  let controls = '';
  switch (title) {
    case ('equipment'):
      controls = `${gymId}-equipment`;
      break;
    case ('memberships'):
      controls = `${gymId}-memberships`;
      break;
    case ('opening hours'):
      controls = `${gymId}-opening-hours`;
      break;
  }

  return (
    <button
      aria-pressed={activeExtension === title}
      aria-expanded={activeExtension === title}
      aria-controls={controls}
      disabled={disabled}
      className='
        group flex flex-1 justify-center items-center p-2 cursor-pointer
        enabled:hover:inset-ring enabled:active:inset-ring
        enabled:active:font-semibold
        aria-pressed:bg-secondary-dark dark:aria-pressed:bg-secondary
        aria-pressed:inset-ring-primary-text-dark aria-pressed:font-semibold
        disabled:bg-background dark:disabled:bg-background-dark
        disabled:cursor-not-allowed'
      onClick={() => {
        handleToggle(title);
      }}
    >
      <p
        className='
          group-aria-pressed:text-primary-text-dark
          dark:group-aria-pressed:text-primary-text'
      >
        {iconMode
          ? <ButtonIcon title={title} />
          : <span className='text-xs'>{title}</span>}
      </p>
    </button>
  );
}
