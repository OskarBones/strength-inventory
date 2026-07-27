import { use } from 'react';

import { FaLock } from 'react-icons/fa6';

import { IconContext } from '../../../../utils/contexts';

interface DayProps {
  day: string,
  hours: string
  highlighted: boolean
  exception: string | undefined
  setExceptionReason: React.Dispatch<React.SetStateAction<string>>
}

export default function Day ({
  day, hours, highlighted, exception, setExceptionReason
}: DayProps) {
  const iconMode = use(IconContext);

  return (
    <button
      className={`rounded-md px-1 w-27 text-sm md:w-32 md:text-base
        ${highlighted
      ? 'bg-secondary dark:bg-secondary-dark'
      : ''
    }
        ${exception
      ? `outline-2 outline-dashed hover:outline-solid
        hover:cursor-help`
      : ''
    }`}
      onClick={() => {
        if (exception) {
          setExceptionReason(exception);
        }
      }}
    >
      {hours !== '-'
        ? (
          <p className='flex justify-between items-center w-full'>
            <span className='text-xs md:text-sm'>{day}</span>
            <span>{hours}</span>
          </p>
        )
        : iconMode
          ? (
            <p className='flex justify-between items-center w-full'>
              <span className='text-xs md:text-sm'>{day}</span>
              <span
                className='
                  flex justify-center items-center ml-2 w-full h-5 md:h-6'
              >
                <FaLock className='text-base' />
              </span>
            </p>
          )
          : (
            <p className='flex justify-between items-center w-full'>
              <span className='text-xs md:text-sm'>{day}</span>
              <span>closed</span>
            </p>
          )}
    </button>
  );
}
