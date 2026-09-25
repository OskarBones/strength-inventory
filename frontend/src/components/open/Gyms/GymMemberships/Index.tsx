import { useState } from 'react';

import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';

import Membership from './Membership';

import type { GymFrontendGet } from '@strength-inventory/schemas/frontend';

interface LeftArrowProps {
  membershipIndex: number
  setMembershipIndex: React.Dispatch<React.SetStateAction<number>>
}

function LeftArrow ({ membershipIndex, setMembershipIndex }: LeftArrowProps) {
  if (membershipIndex === 0) {
    return (
      <button
        disabled
        className='
          flex justify-end
          border rounded-sm border-primary dark:border-primary-dark
          bg-secondary dark:bg-secondary-dark w-25
          text-primary dark:text-primary-dark'
      >
        <FaCaretLeft className='aria-hidden' />
        <span className='sr-only'>previous membership</span>
      </button>
    );
  }

  return (
    <button
      className='
        flex justify-end border rounded-sm
        bg-secondary dark:bg-secondary-dark w-25 cursor-pointer
        hover:inset-ring active:scale-95'
      onClick={() => {
        setMembershipIndex(membershipIndex - 1);
      }}
    >
      <FaCaretLeft className='aria-hidden' />
      <span className='sr-only'>previous membership</span>
    </button>
  );
}

interface RightArrowProps {
  membershipIndex: number
  setMembershipIndex: React.Dispatch<React.SetStateAction<number>>
  membershipCount: number
}

function RightArrow ({
  membershipIndex,
  setMembershipIndex,
  membershipCount
}: RightArrowProps) {
  if (membershipIndex >= membershipCount - 1) {
    return (
      <button
        disabled
        className='
          flex border rounded-sm border-primary dark:border-primary-dark
          bg-secondary dark:bg-secondary-dark w-25
          text-primary dark:text-primary-dark'
      >
        <FaCaretRight className='aria-hidden' />
        <span className='sr-only'>next membership</span>
      </button>
    );
  }

  return (
    <button
      className='
        flex border rounded-sm bg-secondary dark:bg-secondary-dark w-25
        cursor-pointer hover:inset-ring active:scale-95'
      onClick={() => {
        setMembershipIndex(membershipIndex + 1);
      }}
    >
      <FaCaretRight className='aria-hidden' />
      <span className='sr-only'>next membership</span>
    </button>
  );
}

export default function GymMemberships ({ gym }: { gym: GymFrontendGet }) {
  const [membershipIndex, setMembershipIndex] = useState(0);

  const memberships = gym.memberships;
  const membershipCount = memberships.length;

  if (membershipCount === 0) {
    return (
      <div className='flex border-x border-b p-3'>
        <h4 className='sr-only'>memberships at {gym.name}</h4>
        {gym.name} does not have available memberships.
      </div>
    );
  }

  return (
    <div
      id={`${gym.id}-memberships`}
      className='flex flex-col border-x border-b gap-3 p-3'
    >
      <h4 className='sr-only'>memberships at {gym.name}</h4>

      <div className='flex justify-center gap-3 md:mr-66'>
        <LeftArrow
          membershipIndex={membershipIndex}
          setMembershipIndex={setMembershipIndex}
        />
        <p className='text-xs'>{membershipIndex + 1}/{membershipCount}</p>
        <RightArrow
          membershipIndex={membershipIndex}
          setMembershipIndex={setMembershipIndex}
          membershipCount={membershipCount}
        />
      </div>

      <div className='flex justify-center gap-3'>
        <Membership membership={memberships[membershipIndex]} />
        {membershipCount > 1
          ? membershipIndex + 1 < membershipCount
            ? (
              <div className='hidden md:block'>
                <Membership membership={memberships[membershipIndex + 1]} />
              </div>
            )
            : (
              /* on larger screens, render an invisible membership
              to have the last one lined up correctly */
              <div className='hidden md:block md:invisible'>
                <Membership membership={memberships[membershipIndex]} />
              </div>
            )
          : null}
      </div>
    </div>
  );
}
