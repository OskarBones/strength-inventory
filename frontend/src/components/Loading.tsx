import { TbLoader2 } from 'react-icons/tb';

export default function Loading () {
  return (
    <p className='self-center flex items-center gap-2 mt-3'>
      <TbLoader2 className='animate-spin mt-0.5' /> loading...
    </p>
  );
}
