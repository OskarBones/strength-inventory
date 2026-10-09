import { Link, useLocation } from '@tanstack/react-router';
import { MdDarkMode, MdLightMode, MdOutlineLocationOn } from 'react-icons/md';
import { TbClock, TbContract } from 'react-icons/tb';
import { CgGym } from 'react-icons/cg';
import { IoSearch } from 'react-icons/io5';

interface IconToggleProps {
  iconMode: boolean;
  handleChange: () => void;
}

// reference [1]
function IconToggle ({ iconMode, handleChange }: IconToggleProps) {
  return (
    <div className='flex relative p-1'>
      <div aria-hidden='true' className='flex flex-1 text-xs items-center'>
        <CgGym /><TbContract /><TbClock />
      </div>
      <input
        id='icon-mode-checkbox'
        type='checkbox'
        checked={iconMode}
        className='peer sr-only'
        onChange={handleChange}
      />
      <label
        htmlFor='icon-mode-checkbox'
        aria-label='icon mode'
        className='
          flex items-center cursor-pointer before:rounded-md
          before:bg-red dark:before:bg-red-dark before:transition
          peer-checked:before:bg-green dark:peer-checked:before:bg-green-dark
          before:w-10 before:h-5 before:content-[""]
          after:absolute after:right-7
          after:rounded-md after:bg-primary-dark dark:after:bg-primary
          after:w-3 after:h-3 after:content-[""] after:transition
          peer-hover:after:scale-120
          peer-checked:after:translate-x-5'
      />
    </div>
  );
}

interface ThemeToggleProps extends IconToggleProps {
  darkMode: boolean;
}

// reference [1]
function ThemeToggle ({ iconMode, darkMode, handleChange }: ThemeToggleProps) {
  return (
    <div
      className='
        flex relative rounded-md py-1 pr-1
        bg-secondary-dark dark:bg-secondary
        text-primary-text-dark dark:text-primary-text'
    >
      <div
        aria-hidden='true'
        className='flex flex-1 flex-col justify-between items-center text-sm'
      >
        {iconMode
          ? (
            <div
              className='flex flex-1 flex-col justify-between py-0.5 text-xl'
            >
              <MdLightMode />
              <MdDarkMode />
            </div>
          )
          : (
            <>
              <p>light</p>
              <p>dark</p>
            </>
          )}
      </div>
      <input
        id='dark-mode-checkbox'
        type='checkbox'
        checked={darkMode}
        className='peer sr-only'
        onChange={handleChange}
      />
      <label
        htmlFor='dark-mode-checkbox'
        aria-label='dark mode'
        className='
          flex items-center cursor-pointer before:transition after:transition
          before:rounded-md before:bg-tertiary dark:before:bg-tertiary-dark
          before:w-10 before:h-14 before:content-[""]
          after:absolute after:top-2 after:right-2
          after:rounded-md after:bg-primary-dark dark:after:bg-primary
          after:w-8 after:h-4 after:content-[""]
          peer-hover:after:scale-110
          peer-checked:after:translate-y-8'
      />
    </div>
  );
}

interface SidebarLeftProps {
  sidebarLeftVisible: boolean
  setSidebarLeftVisible: React.Dispatch<React.SetStateAction<boolean>>
  iconMode: boolean
  setIconMode: React.Dispatch<React.SetStateAction<boolean>>
  darkMode: boolean
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SidebarLeft ({
  sidebarLeftVisible,
  setSidebarLeftVisible,
  iconMode,
  setIconMode,
  darkMode,
  setDarkMode
}: SidebarLeftProps) {
  const pathname = useLocation({
    select: (location) => location.pathname
  });

  return (
    <nav
      id='sidebar-left'
      className={`
        absolute left-0 flex flex-col gap-1 border-t border-r
        bg-secondary dark:bg-secondary-dark pt-3 pb-12 w-24 h-full
        text-primary-text dark:text-primary-text-dark text-sm
        ${sidebarLeftVisible
      ? ''
      : 'hidden md:flex'}`}
    >
      <h2 className='pb-1 pl-2 text-base font-bold cursor-default'>
        {iconMode
          ? <IoSearch aria-hidden='true' className='text-2xl' />
          : null}

        <span
          className={iconMode
            ? 'sr-only'
            : ''}
        >
          FIND
        </span>
      </h2>

      <Link
        to='/gyms'
        aria-current={
          pathname === '/gyms'
            ? 'page'
            : false
        }
        className={`
          py-1 pl-2 hover:bg-primary dark:hover:bg-background-dark
          active:font-semibold
          ${pathname === '/gyms'
      ? 'bg-primary dark:bg-background-dark font-semibold'
      : ''
    }`}
        onClick={() => {
          setSidebarLeftVisible(false);
        }}
      >
        {iconMode
          ? <MdOutlineLocationOn aria-hidden='true' className='text-xl' />
          : null}

        <span
          className={iconMode
            ? 'sr-only'
            : ''}
        >
          gyms
        </span>
      </Link>

      <div className='flex flex-col gap-1 mt-auto p-1'>
        <IconToggle
          iconMode={iconMode}
          handleChange={() => {
            setIconMode(!iconMode);
          }}
        />
        <ThemeToggle
          iconMode={iconMode}
          darkMode={darkMode}
          handleChange={() => {
            setDarkMode(!darkMode);
          }}
        />
      </div>
    </nav>
  );
}
