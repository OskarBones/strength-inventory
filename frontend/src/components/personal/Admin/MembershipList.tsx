// used by
// - Memberships/List
// - GymMemberships/List
// - GymMemberships/Form

import { use } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaRegAddressCard } from 'react-icons/fa';
import { GiMeshNetwork } from 'react-icons/gi';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdOutlinePlaylistAddCheckCircle } from 'react-icons/md';

import { AuthContext, IconContext } from '@/utils/contexts';
import { postGymMembership } from '@/utils/api';

import type { Membership } from '@strength-inventory/schemas';

interface MembershipListProps {
  memberships: Membership[]
  filterType: string
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string
  }>>
  highlightChainMemberships: boolean
  setSelectedMembershipId: React.Dispatch<React.SetStateAction<string>>
  disabledMembershipIds: string[] | undefined
  gymId: string
}

export default function MembershipList ({
  memberships,
  filterType,
  setFormMode,
  setParentNotification,
  highlightChainMemberships,
  setSelectedMembershipId,
  /* disabledMembershipIds is only defined when this component
  is being used by GymMemberships/Form.
  In this case, this component is being used to add chain memberships
  to a gym, which explains the conditionals further below. */
  disabledMembershipIds,
  /* gymId !== '' only when this component
  is being used by GymMemberships/Form. */
  gymId
}: MembershipListProps) {
  const auth = use(AuthContext);
  const iconMode = use(IconContext);

  const queryClient = useQueryClient();

  const addToGymMutation = useMutation({
    mutationFn: ({ gymId, membershipId }:
    { gymId: string, membershipId: string }) =>
      postGymMembership({
        gymId: gymId,
        membershipId: membershipId,
        refresh: auth.refresh,
        logout: auth.logout
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries(
        { queryKey: ['gymMemberships', gymId] }
      );
      setFormMode('hidden');
      setTimeout(() => {
        setParentNotification({
          type: 'success', message: 'membership added'
        });
      }, 150);
    }
  });

  if (memberships.length === 0) {
    return (
      <div className='min-w-full bg-background dark:bg-background-dark'>
        <p className='p-1 text-center'>
          the selected {filterType} does not have memberships
        </p>
        <hr />
        <button
          className='
            flex flex-col min-w-full p-1
            hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer'
          onClick={() => {
            setFormMode('create');
          }}
        >
          add new membership
        </button>
        <hr />
      </div>
    );
  }

  memberships.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()
    ? 1
    : -1));

  return (
    <ul
      className='flex-1 min-w-full'
    >
      <hr />
      {memberships.map((membership) => (
        <li
          key={membership.id}
          className='flex flex-col min-w-full'
        >
          <button
            disabled={disabledMembershipIds?.includes(membership.id)}
            className='
              flex gap-1 min-w-full p-1 cursor-pointer
              enabled:hover:bg-gray-300 enabled:dark:hover:bg-gray-600
              disabled:cursor-default'
            onClick={() => {
              if (!disabledMembershipIds) {
                setFormMode('edit');
                setSelectedMembershipId(membership.id);
              } else {
                addToGymMutation
                  .mutate({ gymId: gymId, membershipId: membership.id });
              }
            }}
          >
            {disabledMembershipIds?.includes(membership.id)
              ? (
                <MdOutlinePlaylistAddCheckCircle
                  className='
                    self-center text-green-dark dark:text-green text-4xl'
                />
              )
              : null}

            {highlightChainMemberships && membership.chain
              ? (
                <GiMeshNetwork
                  className='
                    self-center text-green-dark dark:text-green text-4xl'
                />
              )
              : null}

            <div className='flex flex-col'>
              <h3 className='flex truncate'>{membership.name}</h3>
              <div className='flex text-xs'>
                <div className='flex w-32'>
                  <span className='flex mr-1'>
                    {membership.feeCurrency} {membership.membershipFee}
                  </span>
                  {!membership.visits
                    ? membership.validity > 1
                      ? (
                        <span>
                          / {membership.validity} {membership.validityUnit}s
                        </span>
                      )
                      : (
                        <span>
                          / {membership.validity} {membership.validityUnit}
                        </span>
                      )
                    : membership.visits > 1
                      ? (
                        <span>
                          / {membership.visits} visits
                        </span>
                      )
                      : (
                        <span>
                          / {membership.visits} visit
                        </span>
                      )}
                </div>

                {!membership.visits
                  ? membership.commitment
                    ? membership.commitment > 1
                      ? (
                        <span className='flex truncate'>
                          {/* eslint-disable-next-line @stylistic/max-len */}
                          commitment: {membership.commitment} {membership.commitmentUnit}s
                        </span>
                      )
                      : (
                        <span className='flex truncate'>
                          {/* eslint-disable-next-line @stylistic/max-len */}
                          commitment: {membership.commitment} {membership.commitmentUnit}
                        </span>
                      )
                    : null
                  : membership.validity > 1
                    ? (
                      <span>
                        {/* eslint-disable-next-line @stylistic/max-len */}
                        validity: {membership.validity} {membership.validityUnit}s
                      </span>
                    )
                    : (
                      <span>
                        {/* eslint-disable-next-line @stylistic/max-len */}
                        validity: {membership.validity} {membership.validityUnit}
                      </span>
                    )}
              </div>
            </div>
          </button>
          <hr />
        </li>
      ))}

      {disabledMembershipIds === undefined
        ? (
          <li>
            <button
              className='
                flex flex-col min-w-full p-1
                hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer'
              onClick={() => {
                setSelectedMembershipId('');
                setFormMode('create');
              }}
            >
              {iconMode
                ? (
                  <span className='flex justify-center gap-1 text-2xl'>
                    <IoAddCircleOutline /> <FaRegAddressCard />
                  </span>
                )
                : 'add new membership'}
            </button>
            <hr />
          </li>
        )
        : null}
    </ul>
  );
}
