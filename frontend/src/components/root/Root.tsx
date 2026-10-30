import { useEffect, useReducer, useState } from 'react';

import { Outlet, useRouterState } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { IconContext, NotificationContext, NotificationDispatchContext }
  from '../../utils/contexts';

import Footer from './Footer';
import Header from './Header';
import Loading from '../Loading';
import Navbar from './Navbar';
import Notification from '../Notification';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';

import { type NotificationProps } from '@strength-inventory/schemas/frontend';

export default function Root () {
  const { isLoading } = useRouterState();

  const [iconMode, setIconMode] = useState(() => {
    const savedVisuals = localStorage.getItem('visuals');
    if (savedVisuals === 'icons') {
      return true;
    } else {
      return false;
    }
  });

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      return true;
    } else {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      'theme',
      darkMode
        ? 'dark'
        : 'light'
    );

    const root = window.document.documentElement;

    if (darkMode) {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [darkMode]);

  const [sidebarLeftVisible, setSidebarLeftVisible] = useState(false);
  const [sidebarRightVisible, setSidebarRightVisible] = useState(false);

  function notificationReducer (
    _notification: NotificationProps,
    action: NotificationProps
  ) {
    switch (action.type) {
      case 'success': {
        return {
          type: 'success',
          message: action.message
        };
      }
      case 'info': {
        return {
          type: 'info',
          message: action.message
        };
      }
      case 'error': {
        return {
          type: 'error',
          message: action.message
        };
      }
      case '': {
        return {
          type: '',
          message: ''
        };
      }
      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }

  const [notification, dispatch] = useReducer(notificationReducer, {
    type: 'success',
    message: 'Notifications dispatched'
  });

  return (
    <IconContext value={iconMode}>
      <NotificationContext value={notification}>
        <NotificationDispatchContext value={dispatch}>
          {/* using svh (Small Viewport Height) ensures that
          content does not get hidden behind browser UI */}
          <div className='flex flex-col h-svh'>
            <Header />
            <Navbar
              sidebarLeftVisible={sidebarLeftVisible}
              setSidebarLeftVisible={setSidebarLeftVisible}
              sidebarRightVisible={sidebarRightVisible}
              setSidebarRightVisible={setSidebarRightVisible}
              iconMode={iconMode}
            />

            <div className='relative flex flex-1 flex-col overflow-hidden'>
              <div
                className='
                  flex flex-1 flex-col
                  bg-background dark:bg-background-dark
                  overflow-y-auto text-primary-text dark:text-primary-text-dark'
              >
                {isLoading
                  ? <Loading />
                  : <Outlet />}
              </div>
              <Footer />

              <SidebarLeft
                sidebarLeftVisible={sidebarLeftVisible}
                setSidebarLeftVisible={setSidebarLeftVisible}
                iconMode={iconMode}
                setIconMode={setIconMode}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
              <SidebarRight
                sidebarRightVisible={sidebarRightVisible}
                setSidebarRightVisible={setSidebarRightVisible}
                iconMode={iconMode}
              />

              <Notification
                type={notification.type}
                message={notification.message}
              />
            </div>
          </div>

          <ReactQueryDevtools />
          <TanStackRouterDevtools />
        </NotificationDispatchContext>
      </NotificationContext>
    </IconContext >
  );
}
