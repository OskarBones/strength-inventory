// used by EquipmentForm and MembershipForm

/* GymForm's submit buttons are largely clones
that need to be updated manually! */

import { use } from 'react';

import { LuSave } from 'react-icons/lu';
import { TbPlus } from 'react-icons/tb';

import { IconContext } from '@/utils/contexts';

interface SubmitButtonProps {
  formMode: string
  isPending: boolean
}

export default function SubmitButton (
  { formMode, isPending }: SubmitButtonProps
) {
  const iconMode = use(IconContext);

  return (
    <button
      type='submit'
      disabled={isPending}
      className='
        flex justify-center border rounded-sm
        bg-green dark:bg-green-dark px-3 w-full
        text-primary-text dark:text-primary-text-dark text-base
        disabled:cursor-progress cursor-pointer
        enabled:hover:inset-ring
        active:inset-ring active:font-bold'
    >
      {formMode === 'create'
        ? !isPending
          ? iconMode
            ? <TbPlus className='my-0.5 text-xl' />
            : 'create'
          : iconMode
            ? (
              <span className='flex'>
                <TbPlus className='my-0.5 text-xl' />...
              </span>
            )
            : 'creating...'
        : !isPending
          ? iconMode
            ? <LuSave className='my-0.5 text-xl' />
            : 'save'
          : iconMode
            ? (
              <span className='flex'>
                <LuSave className='my-0.5 text-xl' />...
              </span>
            )
            : 'saving...'}
    </button>
  );
}
