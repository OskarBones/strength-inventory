import { useLocation } from '@tanstack/react-router';

import {
  MdOutlineAdminPanelSettings, MdOutlineLocationOn
} from 'react-icons/md';
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarLeftExpandFilled,
  TbLayoutSidebarRightCollapse,
  TbLayoutSidebarRightCollapseFilled,
  TbLayoutSidebarRightExpand,
  TbLayoutSidebarRightExpandFilled,
  TbLogin2
} from 'react-icons/tb';
import { BsInfoCircle } from 'react-icons/bs';

interface PageTitleProps {
  pathname: string
  iconMode: boolean
}

function PageTitle ({ pathname, iconMode }: PageTitleProps) {
  if (pathname === '/gyms') {
    return (
      <p>
        {iconMode
          ? <MdOutlineLocationOn className='text-2xl' />
          : 'gyms'}
      </p>
    );
  } else if (pathname === '/login') {
    return (
      <p>
        {iconMode
          ? <TbLogin2 className='text-2xl' />
          : 'login'}
      </p>
    );
  } else if (pathname.startsWith('/admin')) {
    return (
      <p>
        {iconMode
          ? <MdOutlineAdminPanelSettings className='text-2xl' />
          : 'admin'}
      </p>
    );
  } else if (pathname.startsWith('/about')) {
    return (
      <p>
        {iconMode
          ? <BsInfoCircle className='text-2xl' />
          : 'about'}
      </p>
    );
  }
}

interface NavbarProps {
  sidebarLeftVisible: boolean
  setSidebarLeftVisible: React.Dispatch<React.SetStateAction<boolean>>
  sidebarRightVisible: boolean
  setSidebarRightVisible: React.Dispatch<React.SetStateAction<boolean>>
  iconMode: boolean
}

export default function Navbar ({
  sidebarLeftVisible,
  setSidebarLeftVisible,
  sidebarRightVisible,
  setSidebarRightVisible,
  iconMode
}: NavbarProps) {
  const pathname = useLocation({
    select: (location) => location.pathname
  });

  return (
    <nav
      className='
        flex justify-between items-center
        bg-secondary dark:bg-secondary-dark p-1
        text-primary-text dark:text-primary-text-dark md:hidden'
    >
      <button
        aria-expanded={sidebarLeftVisible}
        aria-controls='sidebar-left'
        className='group relative w-4 h-4 cursor-pointer'
        onClick={() => {
          setSidebarLeftVisible(!sidebarLeftVisible);
        }}
      >
        {sidebarLeftVisible
          ? (
            <div>
              <TbLayoutSidebarLeftCollapseFilled
                aria-hidden='true'
                className='
                  absolute inset-0 opacity-0 m-auto group-hover:opacity-100'
              />
              <TbLayoutSidebarLeftCollapse
                aria-hidden='true'
                className='absolute inset-0 m-auto group-hover:opacity-0'
              />
              <span className='sr-only'>hide left sidebar</span>
            </div>
          )
          : (
            <div>
              <TbLayoutSidebarLeftExpandFilled
                aria-hidden='true'
                className='
                  absolute inset-0 opacity-0 m-auto group-hover:opacity-100'
              />
              <TbLayoutSidebarLeftExpand
                aria-hidden='true'
                className='absolute inset-0 m-auto group-hover:opacity-0'
              />
              <span className='sr-only'>show left sidebar</span>
            </div>
          )}
      </button>

      <PageTitle pathname={pathname} iconMode={iconMode} />

      <button
        aria-expanded={sidebarRightVisible}
        aria-controls='sidebar-right'
        className='group relative w-4 h-4 cursor-pointer'
        onClick={() => {
          setSidebarRightVisible(!sidebarRightVisible);
        }}
      >
        {sidebarRightVisible
          ? (
            <div>
              <TbLayoutSidebarRightCollapseFilled
                aria-hidden='true'
                className='
                  absolute inset-0 opacity-0 m-auto group-hover:opacity-100'
              />
              <TbLayoutSidebarRightCollapse
                aria-hidden='true'
                className='absolute inset-0 m-auto group-hover:opacity-0'
              />
              <span className='sr-only'>hide right sidebar</span>
            </div>
          )
          : (
            <div>
              <TbLayoutSidebarRightExpandFilled
                aria-hidden='true'
                className='
                  absolute inset-0 opacity-0 m-auto group-hover:opacity-100'
              />
              <TbLayoutSidebarRightExpand
                aria-hidden='true'
                className='absolute inset-0 m-auto group-hover:opacity-0'
              />
              <span className='sr-only'>show right sidebar</span>
            </div>
          )}
      </button>
    </nav>
  );
}
