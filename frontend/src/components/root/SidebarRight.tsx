import { use } from 'react';

import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import {
  TbLogin2, TbLogout2, TbUser, TbUserCode, TbUserShield, TbUserStar
} from 'react-icons/tb';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

import { AuthContext } from '@/utils/contexts';

import { type UserRole } from '@strength-inventory/schemas';

interface RoleProps {
  role: UserRole
  iconMode: boolean
}

function Role ({ role, iconMode }: RoleProps) {
  if (role === 'GYM-GOER') {
    return (
      <div className='flex justify-end pr-2'>
        {iconMode
          ? <TbUser className='text-base' />
          : <p className='cursor-default'>Gym-Goer</p>}
      </div>
    );
  } else if (role === 'MANAGER') {
    return (
      <div className='flex justify-end pr-2'>
        {iconMode
          ? <TbUserStar className='text-base' />
          : <p className='cursor-default'>Manager</p>}
      </div>
    );
  } else if (role === 'ADMIN') {
    return (
      <div className='flex justify-end pr-2'>
        {iconMode
          ? <TbUserShield className='text-base' />
          : <p className='cursor-default'>Admin</p>}
      </div>
    );
  } else {
    return (
      <div className='flex justify-end pr-2'>
        {iconMode
          ? <TbUserCode className='text-base' />
          : <p className='cursor-default'>Superuser</p>}
      </div>
    );
  }
}

interface SidebarRightProps {
  sidebarRightVisible: boolean
  setSidebarRightVisible: React.Dispatch<React.SetStateAction<boolean>>
  iconMode: boolean
}

export default function SidebarRight (
  { sidebarRightVisible, setSidebarRightVisible, iconMode }: SidebarRightProps
) {
  const auth = use(AuthContext);
  const navigate = useNavigate();
  const pathname = useLocation({
    select: (location) => location.pathname
  });

  /* role is only used when a user is logged in
  i.e. when auth.user exists.
  The primary purpose of defining role here is to satisfy TS. */
  let role: UserRole;
  if (auth.user) {
    role = auth.user.role;
  } else {
    role = 'GYM-GOER';
  }

  async function handleLogout () {
    try {
      await auth.logout();
      await navigate({ to: location.pathname, reloadDocument: true });
    } catch (err: unknown) {
      console.error('Logout failed', err);
    }
  }

  return (
    <nav
      className={`
        absolute right-0 md:translate-x-0 flex flex-col items-stretch
        border-t border-l
        bg-secondary dark:bg-secondary-dark pt-3 pb-12 w-24 h-full
        text-primary-text dark:text-primary-text-dark text-sm
        ${sidebarRightVisible
      ? 'translate-x-0'
      : 'translate-x-full'}`}
    >
      {!auth.isAuthenticated
        ? (
          <div className='flex flex-col items-stretch gap-1'>
            <Link
              to='/login'
              search={() => ({ redirect: location.pathname })}
              className={`
                flex justify-end py-1 pr-2 cursor-pointer
                hover:bg-primary dark:hover:bg-background-dark
                active:font-semibold
                ${pathname === '/login'
            ? 'bg-primary dark:bg-background-dark font-semibold'
            : ''
          }`}
              onClick={() => {
                setSidebarRightVisible(false);
              }}
            >
              {iconMode
                ? <TbLogin2 className='text-xl' />
                : 'log in'}
            </Link>
          </div>
        )
        : (
          <div className='flex flex-1 flex-col items-stretch gap-1'>
            <Link
              to='/admin'
              className={`
                flex justify-end py-1 pr-2
                hover:bg-primary dark:hover:bg-background-dark
                active:font-semibold
                ${pathname.startsWith('/admin')
            ? 'bg-primary dark:bg-background-dark font-semibold'
            : ''
          }`}
              onClick={() => {
                setSidebarRightVisible(false);
              }}
            >
              {iconMode
                ? <MdOutlineAdminPanelSettings className='text-xl' />
                : 'admin'}
            </Link>

            <div className='flex flex-col gap-3 mt-auto text-xs'>
              <div className='flex flex-col gap-1'>
                <Role role={role} iconMode={iconMode} />
                <div
                  className='flex justify-end mx-2 font-bold cursor-default'
                >
                  <p
                    className='
                      ml-auto truncate hover:overflow-visible transition-none'
                  >
                    {auth.user?.username}
                  </p>
                </div>
              </div>
              <button
                className='
                  flex justify-end py-1 pr-2 cursor-pointer
                  hover:bg-primary dark:hover:bg-background-dark
                  active:font-semibold'
                onClick={() => {
                  handleLogout().catch(() => {});
                  setSidebarRightVisible(false);
                }}
              >
                {iconMode
                  ? <TbLogout2 className='text-base' />
                  : 'log out'}
              </button>
            </div>
          </div>
        )}
    </nav>
  );
}
