import { CiHeart } from 'react-icons/ci';
import { FaGithub } from 'react-icons/fa';

import { VERSION } from '../../constants/values';

export default function Footer () {
  return (
    <div
      className='
        relative flex justify-center bg-primary dark:bg-primary-dark p-1
        text-primary-text dark:text-primary-text-dark text-sm'
    >
      <p className='flex gap-1'>
        made with <CiHeart className='text-xl' /> in Helsinki
      </p>
      <a
        href='https://github.com/OskarBones/strength-inventory'
        target='_blank'
        className='absolute flex items-center right-2 md:right-25 gap-2'
      >
        <p
          className='
            rounded-xl bg-secondary-dark dark:bg-secondary px-2 h-5.5
            text-sm text-primary-text-dark dark:text-primary-text'
        >
          v{VERSION}
        </p>
        <FaGithub
          className='mb-0.5 text-xl text-secondary-dark dark:text-secondary'
        />
      </a>
    </div>
  );
}
