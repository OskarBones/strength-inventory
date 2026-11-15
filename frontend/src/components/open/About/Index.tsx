export default function About () {
  return (
    <div
      className='flex flex-col gap-1 p-3 md:px-27 w-full min-w-90'
    >
      <h1 className='text-xl font-bold'>about strength inventory</h1>
      <h2 className='font-semibold'>attributions</h2>
      <ul className='ml-4 list-disc'>
        <li>
          The logo is
          {' '}
          <a
            // eslint-disable-next-line @stylistic/max-len
            href='https://github.com/game-icons/icons/blob/master/delapouite/gym-bag.svg'
            rel='noopener noreferrer'
            target='_blank'
            className='text-blue-500'
          >
            gym-bag.svg
          </a> by
          {' '}
          <a
            href='http://delapouite.com'
            rel='noopener noreferrer'
            target='_blank'
            className='text-blue-500'
          >
            Delapouite
          </a>, distributed as part of
          {' '}
          <a
            href='https://game-icons.net/'
            rel='noopener noreferrer'
            target='_blank'
            className='text-blue-500'
          >
            game-icons
          </a> under
          {' '}
          <a
            href='https://creativecommons.org/licenses/by/3.0/'
            rel='noopener noreferrer'
            target='_blank'
            className='text-blue-500'
          >
            CC BY 3.0 license
          </a>.
        </li>

        <li>
          See
          {' '}
          <a
            // eslint-disable-next-line @stylistic/max-len
            href='https://github.com/OskarBones/strength-inventory/blob/main/references.md'
            rel='noopener noreferrer'
            target='_blank'
            className='text-blue-500'
          >
            references.md
          </a> on GitHub for attributions related to source code.
        </li>
      </ul>
    </div>
  );
}
