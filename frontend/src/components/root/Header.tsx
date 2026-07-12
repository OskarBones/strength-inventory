import { Link } from '@tanstack/react-router';

export default function Header () {
  return (
    <div
      className='
        flex justify-center bg-primary dark:bg-primary-dark p-1
        text-primary-text dark:text-primary-text-dark font-bold'
    >
      <Link
        to='/gyms'
        activeOptions={{ exact: true }}
        className='relative flex gap-3'
      >
        <p className='py-1 text-xl'>strength inventory</p>
        <p className='absolute -right-16 bottom-1.5 text-xs'>preview</p>
      </Link>
    </div>
  );
}
