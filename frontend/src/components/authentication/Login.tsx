import { use, useActionState } from 'react';

import {
  TbLogin2, TbPassword, TbUser, TbUserPlus, TbUserQuestion
} from 'react-icons/tb';

import { AuthContext, IconContext } from '../../utils/contexts';

import { Route } from '../../routes/(auth)/login';

import { LoginRequestSchema } from '@strength-inventory/schemas';

export default function Login () {
  const auth = use(AuthContext);
  const { redirect } = Route.useSearch();
  const navigate = Route.useNavigate();
  const iconMode = use(IconContext);

  const [state, submitAction, isPending] = useActionState(login, {
    success: false,
    error: null,
    enteredUsername: ''
  });

  interface State {
    success: boolean
    error: string | null
    enteredUsername: string
  }

  async function login (_previousState: State, formData: FormData) {
    const req = Object.fromEntries(formData.entries());

    try {
      const validatedReq = LoginRequestSchema.parse(req);
      await auth.login(validatedReq.username, validatedReq.password);
      navigate({ to: redirect, search: true }).catch((err: unknown) => {
        console.error('Redirect failed', err);
      });
      return { success: true, error: null, enteredUsername: '' };
    } catch {
      return {
        success: false,
        error: 'Invalid username or password',
        enteredUsername: formData.get('username') as string
      };
    }
  }

  return (
    <div
      className='
        flex flex-col self-center items-stretch mt-3 border
        bg-tertiary dark:bg-tertiary-dark w-85 md:w-135'
    >
      <div
        className='
          flex flex-col items-center
          bg-secondary dark:bg-secondary-dark p-3'
      >
        <form
          action={submitAction}
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
              defaultValue={state.enteredUsername}
              required
              className='border bg-background dark:bg-background-dark'
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
              required
              className='border bg-background dark:bg-background-dark'
            />
          </div>

          <div
            className={`
              flex flex-col items-center
              ${!state.error
      ? 'mt-7'
      : 'gap-1'}`}
          >
            <div className='text-red-600'>
              {state.error}
            </div>

            <button
              type='submit'
              disabled={isPending}
              className='
                flex justify-center border
                bg-primary dark:bg-primary-dark py-1 w-30 cursor-pointer
                hover:inset-ring active:font-semibold'
            >
              {iconMode
                ? <TbLogin2 className='text-2xl' />
                : 'log in'}
            </button>
          </div>
        </form>
      </div>

      {/* Signing up and recovery not implemented, yet */}
      <div className='flex flex-col gap-3 p-3'>
        <button
          className='
            flex justify-center border border-dashed
            bg-secondary dark:bg-secondary-dark py-1 cursor-not-allowed
            hover:inset-ring'
        >
          {iconMode
            ? <TbUserPlus className='text-2xl' />
            : 'sign up'}
        </button>
        <button
          className='
            flex justify-center border border-dashed
            bg-secondary dark:bg-secondary-dark py-1 cursor-not-allowed
            hover:inset-ring'
        >
          {iconMode
            ? <TbUserQuestion className='text-2xl' />
            : 'recover'}
        </button>
      </div>
    </div>
  );
}
