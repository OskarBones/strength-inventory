import { FaGithub } from 'react-icons/fa6';
import { IoHeartOutline } from 'react-icons/io5';

import { VERSION } from '@strength-inventory/schemas';

export default function Footer () {
  return (
    <div
      className='
        relative flex justify-center bg-primary dark:bg-primary-dark p-1
        text-primary-text dark:text-primary-text-dark text-sm'
    >
      <p className='flex gap-1'>
        made with
        <IoHeartOutline aria-label='love' className='text-xl' />
        in Helsinki
      </p>

      <div className='absolute flex items-center right-2 md:right-25 gap-2'>
        <a
          href='https://github.com/OskarBones/strength-inventory/releases'
          target='_blank'
        >
          <p
            className='
              rounded-xl bg-secondary-dark dark:bg-secondary px-2 h-5.5
              text-sm text-primary-text-dark dark:text-primary-text'
          >
            v{VERSION}
          </p>
        </a>
        <a
          href='https://github.com/OskarBones/strength-inventory'
          target='_blank'
          aria-label='GitHub'
        >
          <FaGithub
            aria-hidden='true'
            className='mb-0.5 text-xl text-secondary-dark dark:text-secondary'
          />
        </a>
      </div>
    </div>
  );
}
