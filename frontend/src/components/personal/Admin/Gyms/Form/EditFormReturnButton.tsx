// used by GymEquipment and GymMemberships/List

import { use } from 'react';

import { IoReturnDownBack } from 'react-icons/io5';

import { IconContext, NotificationDispatchContext } from '@/utils/contexts';

interface EditFormReturnButtonProps {
  model: string
  setEditForm: React.Dispatch<React.SetStateAction<string>>
}

export default function EditFormReturnButton (
  { model, setEditForm }: EditFormReturnButtonProps
) {
  const iconMode = use(IconContext);
  const dispatch = use(NotificationDispatchContext);

  return (
    <button
      className='form-return-button'
      onClick={() => {
        setEditForm('');
        setTimeout(() => {
          dispatch({
            type: 'info', message: `${model} have been saved`
          });
        }, 150);
      }}
    >
      {iconMode
        ? <IoReturnDownBack className='text-base' />
        : 'return'}
    </button>
  );
}
