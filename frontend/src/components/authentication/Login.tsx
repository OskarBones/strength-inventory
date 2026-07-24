import { use, useActionState, useState } from 'react';

import {
  TbLogin2, TbPassword, TbUser, TbUserPlus, TbUserQuestion
} from 'react-icons/tb';

import { AuthContext, IconContext } from '../../utils/contexts';
import handleSubmitError from '../../utils/handleSubmitError';

import { Route } from '../../routes/(auth)/login';

import Notification from '../Notification';

import { LoginRequestSchema } from '@strength-inventory/schemas';

export default function Login () {
  const auth = use(AuthContext);
  const { redirect } = Route.useSearch();
  const navigate = Route.useNavigate();
  const iconMode = use(IconContext);

  let redirectDest: string;
  if (redirect !== '/login') {
    redirectDest = redirect;
  } else {
    redirectDest = '/gyms';
  }

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [notification, setNotification] = useState({
    type: '',
    message: ''
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_state, dispatchAction, isPending] = useActionState(login, {
    success: false,
    error: null
  });

  interface State {
    success: boolean
    error: string | null
  }

  async function login (_previousState: State, formData: FormData) {
    const req = Object.fromEntries(formData.entries());

    try {
      const validatedReq = LoginRequestSchema.parse(req);
      await auth.login(validatedReq.username, validatedReq.password);
      await navigate({ to: redirectDest, search: true })
        .catch((err: unknown) => {
          console.error('Redirect failed', err);
        });
      return { success: true, error: null };
    } catch (err: unknown) {
      return handleSubmitError({ err, setNotification });
    }
  }

  const LOGIN_FORM_INPUT_CLASSES
    = 'border rounded-sm bg-background dark:bg-background-dark pl-1';
  const SIGN_UP_AND_RECOVER_BUTTON_CLASSES
    = `flex justify-center border border-dashed rounded-sm
      bg-secondary dark:bg-secondary-dark py-1 cursor-not-allowed`;

  return (
    <div
      className='
        relative flex flex-1 flex-col self-center p-3
        w-full max-w-145 overflow-y-hidden'
    >
      <div
        className='
          flex flex-col self-center border rounded-sm
          bg-tertiary dark:bg-tertiary-dark w-full min-w-90 md:w-139'
      >
        <div
          className='
            flex flex-col items-center
            bg-secondary dark:bg-secondary-dark p-3'
        >
          <form
            action={dispatchAction}
            className='flex flex-col items-center gap-3'
          >
            <div className='flex flex-col items-center gap-1'>
              <label htmlFor='username'>
                {iconMode
                  ? <TbUser className='text-2xl' />
                  : 'username'}
              </label>
              <input
                id='username'
                name='username'
                type='text'
                value={username}
                required
                className={LOGIN_FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
            </div>

            <div className='flex flex-col items-center gap-1'>
              <label htmlFor='password'>
                {iconMode
                  ? <TbPassword className='text-2xl' />
                  : 'password'}
              </label>
              <input
                id='password'
                name='password'
                type='password'
                value={password}
                required
                className={LOGIN_FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
            </div>

            <div className='flex flex-col items-center gap-1'>
              <button
                type='submit'
                disabled={isPending}
                className='
                  flex justify-center border rounded-sm mt-2
                  bg-primary dark:bg-primary-dark py-1 w-30
                  cursor-progress enabled:cursor-pointer
                  hover:inset-ring active:font-semibold'
              >
                {!isPending
                  ? iconMode
                    ? <TbLogin2 className='text-2xl' />
                    : 'log in'
                  : iconMode
                    ? (
                      <span className='flex'>
                        <TbLogin2 className='text-2xl' />...
                      </span>
                    )
                    : 'logging in...'}
              </button>
            </div>
          </form>
        </div>

        {/* signing up and recovery are upcoming features */}
        <div className='flex flex-col gap-3 p-3'>
          <button className={SIGN_UP_AND_RECOVER_BUTTON_CLASSES}>
            {iconMode
              ? <TbUserPlus className='text-2xl' />
              : 'sign up'}
          </button>
          <button className={SIGN_UP_AND_RECOVER_BUTTON_CLASSES}>
            {iconMode
              ? <TbUserQuestion className='text-2xl' />
              : 'recover'}
          </button>
        </div>
      </div>

      <Notification
        type={notification.type}
        message={notification.message}
        setNotification={setNotification}
      />
    </div>
  );
}
