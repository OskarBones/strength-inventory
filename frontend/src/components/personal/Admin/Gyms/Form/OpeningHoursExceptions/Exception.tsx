import { type OpeningHoursException } from '@strength-inventory/schemas';

interface ExceptionProps {
  exception: OpeningHoursException
  selectedExceptionId: string
  setSelectedExceptionId: React.Dispatch<React.SetStateAction<string>>
  setEditedExceptionId: React.Dispatch<React.SetStateAction<string>>
}

export default function Exception ({
  exception, selectedExceptionId, setSelectedExceptionId, setEditedExceptionId
}: ExceptionProps) {
  const { id, date, hours, reason, concerns } = exception;

  return (
    <button
      aria-pressed={id === selectedExceptionId}
      className='
        flex flex-col min-w-full
        aria-pressed:bg-gray-300 dark:aria-pressed:bg-gray-600 text-left'
      onClick={() => {
        setSelectedExceptionId(id);
      }}
      onDoubleClick={() => {
        setSelectedExceptionId('');
        setEditedExceptionId(id);
      }}
    >
      <span className='flex flex-row gap-2'>
        <span>{date.toLocaleDateString('en-GB')}</span>
        {hours[0] || hours[1]
          ? <span className='w-18'>{hours[0]}-{hours[1]}</span>
          : <span className='w-18'>closed</span>}
        <span>concerns: {concerns}</span>
      </span>
      <span className=''>reason: {reason}</span>
    </button>
  );
}
