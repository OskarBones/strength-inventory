import type { FormMembership } from './Index';

interface AvailabilityButtonProps {
  availabilityType: 'Desk' | 'Web' | 'App' | 'Other',
  selected: boolean,
  disabled: boolean,
  membership: FormMembership,
  setMembership: React.Dispatch<React.SetStateAction<FormMembership>>
}

export default function AvailabilityButton (
  { availabilityType, selected, disabled, membership, setMembership }:
    AvailabilityButtonProps
) {
  return (
    <button
      type='button'
      aria-pressed={selected}
      disabled={disabled}
      className='
        rounded-sm bg-red dark:bg-red-dark p-1 w-15
        enabled:border enabled:cursor-pointer
        aria-pressed:bg-green dark:aria-pressed:bg-green-dark'
      onClick={() => {
        setMembership({
          ...membership,
          availability: {
            ...membership.availability,
            [availabilityType]: !membership.availability[availabilityType]
          }
        });
      }}
    >
      {availabilityType.toLocaleLowerCase()}
    </button>
  );
}
