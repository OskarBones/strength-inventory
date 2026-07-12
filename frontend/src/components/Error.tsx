export default function Error ({ message }: { message: string }) {
  return (
    <p className='self-center mt-3 text-center'>Error: {message}</p>
  );
}
