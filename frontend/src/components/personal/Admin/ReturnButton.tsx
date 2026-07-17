// used by all admin base forms

import { use } from 'react';

import { IoReturnDownBack } from 'react-icons/io5';
import { LuSaveOff } from 'react-icons/lu';
import { useQueryClient } from '@tanstack/react-query';

import { IconContext } from '../../../utils/contexts';

import { FORM_RETURN_BUTTON_CLASSES } from '../../../constants/theme';

interface ReturnButtonProps {
  queriesToInvalidate: string[][]
  setFormMode: React.Dispatch<React.SetStateAction<string>>;
  unsavedChanges: boolean
}

export default function ReturnButton (
  { queriesToInvalidate, setFormMode, unsavedChanges }: ReturnButtonProps
) {
  const iconMode = use(IconContext);

  const queryClient = useQueryClient();

  return (
    <button
      type='button'
      className={FORM_RETURN_BUTTON_CLASSES}
      onClick={() => {
        queriesToInvalidate.map((query) =>
          void queryClient.invalidateQueries(
            { queryKey: query }
          ));
        setFormMode('hidden');
      }}
    >
      {unsavedChanges
        ? iconMode
          ? (
            <span className='flex gap-1'>
              <IoReturnDownBack className='text-base' />
              <LuSaveOff className='text-base' />
            </span>
          )
          : 'return without saving'
        : iconMode
          ? <IoReturnDownBack className='text-base' />
          : 'return'}
    </button>
  );
}
