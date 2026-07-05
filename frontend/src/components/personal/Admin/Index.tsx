import { use } from 'react';

import { Link, Outlet, useLocation } from '@tanstack/react-router';
import { CgGym } from 'react-icons/cg';
import { FaRegAddressCard } from 'react-icons/fa';
import { LiaDrawPolygonSolid } from 'react-icons/lia';
import { MdOutlineLocationOn } from 'react-icons/md';
import { PiCity } from 'react-icons/pi';

import { IconContext } from '../../../utils/contexts';

function Icon ({ pathname }: { pathname: string }) {
  if (pathname === 'gyms') {
    return <MdOutlineLocationOn className='text-base' />;
  }

  if (pathname === 'equipment') {
    return <CgGym className='text-base' />;
  }

  if (pathname === 'memberships') {
    return <FaRegAddressCard className='text-base' />;
  }

  if (pathname === 'cities') {
    return <PiCity className='text-base' />;
  }

  if (pathname === 'districts') {
    return <LiaDrawPolygonSolid className='text-base' />;
  }

  return '';
}

function AdminLink ({ pathname }: { pathname: string }) {
  const iconMode = use(IconContext);

  const currentPathname = useLocation({
    select: (location) => location.pathname
  });

  /* keep these paths updated */
  const validPaths = [
    'cities', 'districts', 'equipment', 'gyms', 'memberships'
  ];
  let to: string;
  if (validPaths.includes(pathname)) {
    to = `/admin/${pathname}`;
  } else {
    to = '/admin';
  }

  return (
    <Link
      to={to}
      disabled={to === '/admin'}
      className={`
        flex flex-1 justify-center border rounded-sm
        bg-tertiary dark:bg-tertiary-dark py-1 min-w-20
        text-primary-text dark:text-primary-text-dark text-xs
        hover:inset-ring active:font-bold
        ${currentPathname === to
      ? 'font-bold inset-ring'
      : ''
    }`}
    >
      {iconMode
        ? <Icon pathname={pathname} />
        : pathname}
    </Link>
  );
}

export default function AdminLayoutComponent () {
  return (
    <div
      className='
        flex flex-1 justify-center w-full overflow-hidden'
    >
      <div className='flex flex-1 flex-col gap-1 p-3 min-w-90 max-w-145'>
        <nav className='flex justify-evenly gap-1'>
          <AdminLink pathname='gyms' />
          <AdminLink pathname='equipment' />
          <AdminLink pathname='memberships' />
        </nav>
        <nav className='flex justify-evenly gap-1'>
          <AdminLink pathname='cities' />
          <AdminLink pathname='districts' />
        </nav>
        <Outlet />
      </div>
    </div>
  );
}
