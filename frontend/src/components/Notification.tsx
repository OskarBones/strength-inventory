/* general-purpose component to be imported by any component
that needs to display 5-second notifications */

import { use, useEffect } from 'react';

import { NotificationDispatchContext } from '@/utils/contexts';

interface NotificationProps {
  type: string
  message: string
}

export default function Notification ({ type, message }:
NotificationProps) {
  const dispatch = use(NotificationDispatchContext);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch({ type: '', message: '' });
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [message, dispatch]);

  return (
    <button
      tabIndex={-1} // make untabbable
      className={`
        absolute inset-x-4 bottom-10 md:mx-25
        border rounded-3xl p-3 h-15 transition
        ${type === 'success'
      ? 'bg-green dark:bg-green-dark'
      : ''}
        ${type === 'info'
      ? 'bg-background dark:bg-background-dark'
      : ''}
        ${type === 'error'
      ? 'bg-red dark:bg-red-dark'
      : ''}
        ${!message
      ? 'translate-y-29'
      : ''}`}
      onClick={() => {
        dispatch({ type: '', message: '' });
      }}
    >
      {message}
    </button>
  );
}
