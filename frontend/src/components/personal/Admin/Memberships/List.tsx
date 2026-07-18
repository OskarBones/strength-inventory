import { type RefObject, useEffect, useRef } from 'react';

import { skipToken, useQuery } from '@tanstack/react-query';

import { getMembershipsByCountry } from '../../../../utils/api';

import MembershipList from '../MembershipList';

import type { Membership } from '@strength-inventory/schemas';

interface ListProps {
  scrollTopRef: RefObject<number>
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  setSelectedMembershipId: React.Dispatch<React.SetStateAction<string>>
  country: string
  setCountry: React.Dispatch<React.SetStateAction<string>>
  chain: string
  setChain: React.Dispatch<React.SetStateAction<string>>
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string
  }>>
}

export default function List ({
  scrollTopRef,
  setFormMode,
  setSelectedMembershipId,
  country,
  setCountry,
  chain,
  setChain,
  setParentNotification
}: ListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // reference [2]
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = scrollTopRef.current;
    }
  });

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['membershipsByCountry', country],
    queryFn: country
      ? () => getMembershipsByCountry({ country: country })
      : skipToken  // disable this query when no country has yet been selected
  });

  let filteredMemberships: Membership[] = [];
  if (chain && data) {
    filteredMemberships = data.filter((membership) => {
      return membership.chain === chain;
    });
  }

  filteredMemberships.sort((a, b) => (a.name > b.name
    ? 1
    : -1));

  return (
    <div className='flex flex-1 flex-col gap-1 overflow-y-scroll text-sm'>
      <div className='flex flex-col'>
        <label htmlFor='country'>
          country
        </label>
        <select
          id='country'
          name='country'
          value={country}
          className='
            border rounded-sm
            bg-tertiary dark:bg-tertiary-dark p-1 cursor-pointer'
          onChange={(event) => {
            setCountry(event.target.value);
            if (event.target.value === '') {
              setChain('');
            }
          }}
        >
          <option value=''>-- please select a country --</option>
          <option value='DEN'>DEN</option>
          <option value='FIN'>FIN</option>
          <option value='ICE'>ICE</option>
          <option value='NOR'>NOR</option>
          <option value='SWE'>SWE</option>
        </select>
      </div>

      <div hidden={!country} className='flex flex-col'>
        <label htmlFor='chain'>
          chain
        </label>
        <input
          id='chain'
          name='chain'
          type='text'
          value={chain}
          autoComplete='off'
          className='border rounded-sm bg-tertiary dark:bg-tertiary-dark pl-1'
          onChange={(event) => {
            setChain(event.target.value);
          }}
        />
      </div>

      <div
        ref={listRef}
        hidden={!country}
        className='
          flex flex-1 rounded-sm bg-background dark:bg-background-dark
          overflow-y-scroll overflow-x-scroll'
        onScroll={(event) => {
          scrollTopRef.current = event.currentTarget.scrollTop;
        }}
      >
        {isPending
          ? 'loading...'
          : chain
            ? (
              <MembershipList
                memberships={filteredMemberships}
                filterType='chain'
                setFormMode={setFormMode}
                setParentNotification={setParentNotification}
                highlightChainMemberships={false}
                setSelectedMembershipId={setSelectedMembershipId}
                disabledMembershipIds={undefined}
                gymId=''
              />
            )
            : (
              <p
                className='flex-1 bg-background dark:bg-background-dark p-1'
              >
                <span className='flex justify-center text-center'>
                  please enter a chain to see its memberships (case-sensitive)
                </span>
              </p>
            )}
      </div>

      {isError
        ? <div>{error.message}</div>
        : null}
    </div>
  );
}
