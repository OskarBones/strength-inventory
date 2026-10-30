import { createContext } from 'react';

import { type AuthState } from '@strength-inventory/schemas';
import { type NotificationProps } from '@strength-inventory/schemas/frontend';

export const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  user: null,
  login: async () => {
    await Promise.resolve();
  },
  refresh: async () => {
    return await Promise.resolve('');
  },
  logout: async () => {
    await Promise.resolve();
  }
});

export const IconContext = createContext(false);

export const NotificationContext = createContext<
  NotificationProps | null
>(null);
export const NotificationDispatchContext = createContext<
  React.Dispatch<NotificationProps>
>(() => {});
