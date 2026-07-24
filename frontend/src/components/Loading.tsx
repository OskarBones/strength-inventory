import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function Loading () {
  return (
    <p className='self-center flex items-center gap-2 mt-3'>
      <AiOutlineLoading3Quarters className='animate-spin' /> loading...
    </p>
  );
}
