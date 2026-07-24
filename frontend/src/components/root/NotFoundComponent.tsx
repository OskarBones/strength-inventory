import { Link } from '@tanstack/react-router';

export default function notFoundComponent () {
  return (
    <div className='flex justify-center p-3'>
      <div className='flex flex-col items-center gap-3'>
        <p>unknown URL</p>
        <Link
          to='/'
          className='
            flex flex-1 justify-center border rounded-sm
            bg-tertiary dark:bg-tertiary-dark p-3 w-35
            text-primary-text dark:text-primary-text-dark
            hover:inset-ring active:font-bold'
        >
          return home
        </Link>
      </div>
    </div>
  );
}
