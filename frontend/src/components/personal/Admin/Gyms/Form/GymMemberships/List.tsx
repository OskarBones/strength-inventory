import { type RefObject, useEffect, useRef } from 'react';

import EditFormReturnButton from '../EditFormReturnButton';
import MembershipList from '../../../MembershipList';

import type { Membership } from '@strength-inventory/schemas';

interface ListProps {
  scrollTopRef: RefObject<number>
  memberships: Membership[]
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  setSelectedMembershipId: React.Dispatch<React.SetStateAction<string>>
  setEditForm: React.Dispatch<React.SetStateAction<string>>
}

export default function List ({
  scrollTopRef,
  memberships,
  setFormMode,
  setSelectedMembershipId,
  setEditForm
}: ListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // reference [2]
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = scrollTopRef.current;
    }
  });

  return (
    <div
      ref={listRef}
      className='flex flex-1 flex-col gap-3 overflow-y-scroll'
      onScroll={(event) => {
        scrollTopRef.current = event.currentTarget.scrollTop;
      }}
    >
      <div className='bg-background dark:bg-background-dark'>
        <MembershipList
          memberships={memberships}
          filterType='gym'
          setFormMode={setFormMode}
          highlightChainMemberships={true}
          setSelectedMembershipId={setSelectedMembershipId}
          disabledMembershipIds={undefined}
          gymId=''
        />
      </div>
      <EditFormReturnButton
        model='memberships'
        setEditForm={setEditForm}
      />
    </div>
  );
}
