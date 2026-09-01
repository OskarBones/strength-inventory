// shared with GymMemberships

import { use, useActionState, useState } from 'react';

import { skipToken, useMutation, useQuery, useQueryClient }
  from '@tanstack/react-query';
import { TbEdit, TbPlus, TbTrashX } from 'react-icons/tb';
import { FaRegAddressCard } from 'react-icons/fa';
import { IoRemoveCircleOutline } from 'react-icons/io5';
import { z } from 'zod';

import { AuthContext, IconContext } from '@/utils/contexts';
import {
  deleteGymMembership,
  deleteMembership,
  getMembership,
  postGymMembership,
  postMembership,
  putMembership
} from '@/utils/api';
import handleSubmitError from '@/utils/handleSubmitError';

import AvailabilityButton from './AvailabilityButton';
import Error from '@/components/Error';
import Loading from '@/components/Loading';
import Notification from '@/components/Notification';
import ReturnButton from '../../ReturnButton';
import SubmitButton from '../../SubmitButton';

import { FORM_INPUT_CLASSES } from '@/constants/theme';

import { type MembershipPostAndPut, MembershipPostAndPutSchema }
  from '@strength-inventory/schemas';

interface FormProps {
  formMode: string
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  selectedMembershipId: string
  defaultCountry: string
  defaultChain: string
  usedInGymMemberships: boolean
  addToGym: boolean
  gymId: string
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string
  }>>
}

/* This type is explicitly defined for AvailabilityButtons.
The membership state in MembershipForm would be fine without. */
export interface FormMembership {
  name: string,
  chain: string,
  country: string,
  initiationFee: string,
  membershipFee: string,
  feeCurrency: string,
  visits: string,
  validity: string,
  validityUnit: string,
  commitment: string,
  commitmentUnit: string,
  autoRenewal: boolean,
  availability: {
    Desk: boolean,
    Web: boolean,
    App: boolean,
    Other: boolean
  },
  url: string,
  notes: string
}

export function Form (
  {
    formMode,
    setFormMode,
    selectedMembershipId,
    defaultCountry,
    defaultChain,
    usedInGymMemberships,
    addToGym,
    gymId,
    setParentNotification
  }: FormProps
) {
  const auth = use(AuthContext);
  const iconMode = use(IconContext);

  const queryClient = useQueryClient();

  const [membership, setMembership] = useState<FormMembership>({
    name: '',
    chain: defaultChain,
    country: defaultCountry,
    initiationFee: '',
    membershipFee: '',
    feeCurrency: '',
    visits: '',
    validity: '',
    validityUnit: '',
    commitment: '',
    commitmentUnit: '',
    autoRenewal: false,
    availability: {
      Desk: false,
      Web: false,
      App: false,
      Other: false
    },
    url: '',
    notes: ''
  });
  const [originalMembership, setOriginalMembership] = useState<FormMembership>({
    name: '',
    chain: defaultChain,
    country: defaultCountry,
    initiationFee: '',
    membershipFee: '',
    feeCurrency: '',
    visits: '',
    validity: '',
    validityUnit: '',
    commitment: '',
    commitmentUnit: '',
    autoRenewal: false,
    availability: {
      Desk: false,
      Web: false,
      App: false,
      Other: false
    },
    url: '',
    notes: ''
  });

  const membershipQuery = useQuery({
    queryKey: ['membership', selectedMembershipId],
    queryFn: selectedMembershipId
      ? () => getMembership({ id: selectedMembershipId })
      : skipToken  // disable this query when creating a new membership
  });

  const postMutation = useMutation({
    mutationFn: (newMembership: MembershipPostAndPut) =>
      postMembership({
        membership: newMembership, refresh: auth.refresh, logout: auth.logout
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(
        { queryKey: ['membershipsByCountry', membership.country] }
      );
      // Exit the form immediately if addToGymMutation won't be run afterwards.
      if (!addToGym) {
        setFormMode('hidden');
        setTimeout(() => {
          setParentNotification({
            type: 'success', message: 'membership created'
          });
        }, 150);
      }
    }
  });

  const addToGymMutation = useMutation({
    mutationFn: ({ gymId, membershipId }:
    { gymId: string, membershipId: string }) =>
      postGymMembership({
        gymId: gymId,
        membershipId: membershipId,
        refresh: auth.refresh,
        logout: auth.logout
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(
        { queryKey: ['gymMemberships', gymId] }
      );
      setFormMode('hidden');
      setTimeout(() => {
        setParentNotification({
          type: 'success', message: 'membership created'
        });
      }, 150);
    }
  });

  const putMutation = useMutation({
    mutationFn: ({ id, updatedMembership }:
    { id: string, updatedMembership: MembershipPostAndPut }) =>
      putMembership({
        id: id,
        membership: updatedMembership,
        refresh: auth.refresh,
        logout: auth.logout
      }),
    onSuccess: async (editedMembershipFromServer) => {
      await Promise.all([
        queryClient.setQueryData(
          ['membership', selectedMembershipId],
          editedMembershipFromServer
        ),
        queryClient.invalidateQueries(
          { queryKey: ['membershipsByCountry', membership.country] }
        ),
        queryClient.invalidateQueries(
          { queryKey: ['gymMemberships', gymId] }
        )
      ]);
      setFormMode('hidden');
      setTimeout(() => {
        setParentNotification({
          type: 'success', message: 'changes saved'
        });
      }, 150);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      deleteMembership({ id: id, refresh: auth.refresh, logout: auth.logout }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries(
          { queryKey: ['membershipsByCountry', membership.country] }
        ),
        queryClient.invalidateQueries(
          { queryKey: ['gymMemberships', gymId] }
        )
      ]);
      setFormMode('hidden');
      setTimeout(() => {
        setParentNotification({
          type: 'success', message: 'membership deleted'
        });
      }, 150);
    }
  });

  const removeMutation = useMutation({
    mutationFn: ({ gymId, membershipId }:
    { gymId: string, membershipId: string }) =>
      deleteGymMembership({
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
          type: 'success', message: 'membership removed'
        });
      }, 150);
    }
  });

  const [firstRender, setFirstRender] = useState(true);

  const [notification, setNotification] = useState({
    type: '',
    message: ''
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_state, submitAction, isPending] = useActionState(submit, {
    success: false,
    error: null
  });

  interface State {
    success: boolean
    error: string | null
  }

  async function submit (_previousState: State, formData: FormData) {
    const req = Object.fromEntries(formData.entries());

    try {
      const preprocessCommitmentUnit = z.preprocess((val) => {
        if (val === '') {
          return null;
        } else {
          return val;
        }
      }, z.string().min(1)
        .nullable());
      const preprocessedCommitmentUnit
        = preprocessCommitmentUnit.parse(req.commitmentUnit);
      const unvalidatedMembership = {
        ...req,
        commitmentUnit: preprocessedCommitmentUnit,
        autoRenewal: membership.autoRenewal,
        country: membership.country,
        chain: membership.chain,
        availability: membership.availability
      };
      const validatedMembership
        = MembershipPostAndPutSchema.parse(unvalidatedMembership);

      if (formMode === 'create') {
        try {
          const { id } = await postMutation.mutateAsync(validatedMembership);
          if (addToGym && gymId) {
            await addToGymMutation
              .mutateAsync({ gymId: gymId, membershipId: id });
          }
          return {
            success: true,
            error: null
          };
        } catch (err: unknown) {
          return handleSubmitError({ err, setNotification });
        }
      } else {  // formMode === 'edit'
        try {
          await putMutation.mutateAsync({
            id: selectedMembershipId, updatedMembership: validatedMembership
          });
          return {
            success: true,
            error: null
          };
        } catch (err: unknown) {
          return handleSubmitError({ err, setNotification });
        }
      }
    } catch (err: unknown) {
      return handleSubmitError({ err, setNotification });
    }
  }

  if (selectedMembershipId && membershipQuery.isPending) {
    return <Loading />;
  }

  if (selectedMembershipId && membershipQuery.isError) {
    return <Error message={membershipQuery.error.message} />;
  }

  /* Initialize the form fields when opened in edit mode.
  selectedMembershipId is only defined in edit mode. */
  if (selectedMembershipId && membershipQuery.isSuccess && firstRender) {
    const {
      name,
      chain,
      country,
      initiationFee,
      membershipFee,
      feeCurrency,
      visits,
      validity,
      validityUnit,
      commitment,
      commitmentUnit,
      autoRenewal,
      availability,
      url,
      notes
    } = membershipQuery.data;

    setMembership({
      name: name,
      chain: chain,
      country: country,
      initiationFee: initiationFee
        ? String(initiationFee)
        : '',
      membershipFee: membershipFee
        ? String(membershipFee)
        : '',
      feeCurrency: feeCurrency,
      visits: visits
        ? String(visits)
        : '',
      validity: validity
        ? String(validity)
        : '',
      validityUnit: validityUnit,
      commitment: commitment
        ? String(commitment)
        : '',
      commitmentUnit: commitmentUnit ?? '',
      autoRenewal: autoRenewal,
      availability: availability,
      url: url ?? '',
      notes: notes
    });
    setOriginalMembership({
      name: name,
      chain: chain,
      country: country,
      initiationFee: initiationFee
        ? String(initiationFee)
        : '',
      membershipFee: membershipFee
        ? String(membershipFee)
        : '',
      feeCurrency: feeCurrency,
      visits: visits
        ? String(visits)
        : '',
      validity: validity
        ? String(validity)
        : '',
      validityUnit: validityUnit,
      commitment: commitment
        ? String(commitment)
        : '',
      commitmentUnit: commitmentUnit ?? '',
      autoRenewal: autoRenewal,
      availability: availability,
      url: url ?? '',
      notes: notes
    });

    setFirstRender(false);
  }

  let readOnly = false;
  if (usedInGymMemberships && membership.chain) {
    readOnly = true;
  }

  function handleMinus () {
    if (!readOnly) {
      deleteMutation.mutateAsync(selectedMembershipId)
        .catch((err: unknown) => {
          handleSubmitError({ err, setNotification });
        });
    } else {
      removeMutation
        .mutateAsync({ gymId: gymId, membershipId: selectedMembershipId })
        .catch((err: unknown) => {
          handleSubmitError({ err, setNotification });
        });
    }
  }

  return (
    <div className='flex flex-col min-h-0 overflow-y-scroll'>
      {/* second-highest <div> with px-3 ensures that
      the scrollbar stays clear of content */}
      <div className='flex flex-col gap-3 px-3 text-xs'>
        <div className='flex flex-col gap-1'>
          <h4 className='flex justify-center text-base'>
            {/* formMode is either 'create' or 'edit' */}
            {formMode === 'create'
              ? usedInGymMemberships
                ? iconMode
                  ? (
                    <span className='flex gap-1 text-2xl'>
                      <TbPlus /> <FaRegAddressCard />
                    </span>
                  )
                  : 'create new membership'
                : iconMode
                  ? <TbPlus className='text-2xl' />
                  : 'create new membership'
              : iconMode
                ? readOnly
                  ? (
                    <span className='flex gap-1'>
                      {originalMembership.name}
                    </span>
                  )
                  : (
                    <span className='flex gap-1'>
                      <TbEdit className='text-2xl' /> {originalMembership.name}
                    </span>
                  )
                : readOnly
                  ? <span>{originalMembership.name}</span>
                  : <span>editing {originalMembership.name}</span>}
          </h4>

          {readOnly
            ? (
              <p className='text-center italic'>
                only admins and chain managers can edit chain memberships
              </p>
            )
            : null}
        </div>

        <div className='flex flex-col gap-3'>
          {membership.country && membership.chain
            ? (
              <div className='flex flex-col gap-1'>
                <p className='flex'>
                  <span className='w-15'>country:</span> {membership.country}
                </p>

                <p className='flex'>
                  <span className='w-15'>chain:</span> {membership.chain}
                </p>
              </div>
            )
            : null}

          <form
            action={submitAction}
            autoComplete='off'
            className='flex flex-col gap-1'
          >
            <div className='flex flex-col'>
              <label htmlFor='name'>name*</label>
              <input
                id='name'
                name='name'
                type='text'
                value={membership.name}
                disabled={readOnly}
                required
                autoFocus={formMode === 'create'}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setMembership({ ...membership, name: event.target.value });
                }}
              />
            </div>

            <div className='flex gap-3'>
              <div className='flex flex-col'>
                <label htmlFor='membershipFee'>membership fee*</label>
                <input
                  id='membershipFee'
                  name='membershipFee'
                  type='number'
                  value={membership.membershipFee}
                  disabled={readOnly}
                  required
                  min={0.01}
                  step={0.01}
                  className={`${FORM_INPUT_CLASSES} w-25`}
                  onChange={(event) => {
                    setMembership(
                      { ...membership, membershipFee: event.target.value }
                    );
                  }}
                />
              </div>

              <div className='flex flex-col'>
                <label htmlFor='initiationFee'>initiation fee</label>
                <input
                  id='initiationFee'
                  name='initiationFee'
                  type='number'
                  value={membership.initiationFee}
                  disabled={readOnly}
                  min={0.01}
                  step={0.01}
                  className={`${FORM_INPUT_CLASSES} w-25`}
                  onChange={(event) => {
                    setMembership(
                      { ...membership, initiationFee: event.target.value }
                    );
                  }}
                />
              </div>

              <div className='flex flex-col'>
                <label htmlFor='feeCurrency'>currency*</label>
                <select
                  id='feeCurrency'
                  name='feeCurrency'
                  value={membership.feeCurrency}
                  disabled={readOnly}
                  required
                  className={`${FORM_INPUT_CLASSES} enabled:cursor-pointer`}
                  onChange={(event) => {
                    setMembership(
                      { ...membership, feeCurrency: event.target.value }
                    );
                  }}
                >
                  <option value='' />
                  <option value='DKK'>DKK</option>
                  <option value='EUR'>EUR</option>
                  <option value='ISK'>ISK</option>
                  <option value='NOK'>NOK</option>
                  <option value='SEK'>SEK</option>
                </select>
              </div>
            </div>

            <div className='flex gap-3'>
              <div className='flex flex-col'>
                <label htmlFor='visits'>visits</label>
                <input
                  id='visits'
                  name='visits'
                  type='number'
                  value={membership.visits}
                  placeholder='unlimited'
                  className={`${FORM_INPUT_CLASSES} w-20`}
                  onChange={(event) => {
                    setMembership(
                      { ...membership, visits: event.target.value }
                    );
                  }}
                />
              </div>

              <div className='flex gap-1'>
                <div className='flex flex-col'>
                  <label htmlFor='validity'>validity*</label>
                  <input
                    id='validity'
                    name='validity'
                    type='number'
                    value={membership.validity}
                    disabled={readOnly}
                    required
                    min={1}
                    step={1}
                    className={`${FORM_INPUT_CLASSES} w-15`}
                    onChange={(event) => {
                      setMembership(
                        { ...membership, validity: event.target.value }
                      );
                    }}
                  />
                </div>
                <select
                  id='validityUnit'
                  name='validityUnit'
                  value={membership.validityUnit}
                  disabled={readOnly}
                  required
                  className={
                    `${FORM_INPUT_CLASSES}
                    self-end enabled:cursor-pointer`
                  }
                  onChange={(event) => {
                    setMembership(
                      { ...membership, validityUnit: event.target.value }
                    );
                  }}
                >
                  <option value=''>-- unit* --</option>
                  <option value='hour'>hour(s)</option>
                  <option value='day'>day(s)</option>
                  <option value='week'>week(s)</option>
                  <option value='month'>month(s)</option>
                  <option value='year'>year(s)</option>
                </select>
              </div>
            </div>

            <div className='flex gap-8'>
              <div className='flex flex-col'>
                <label>commitment</label>
                <div className='flex gap-1'>
                  <input
                    id='commitment'
                    name='commitment'
                    type='number'
                    value={membership.commitment}
                    disabled={readOnly}
                    required={membership.commitmentUnit !== ''}
                    min={1}
                    step={1}
                    className={`${FORM_INPUT_CLASSES} w-15`}
                    onChange={(event) => {
                      setMembership(
                        { ...membership, commitment: event.target.value }
                      );
                    }}
                  />
                  <select
                    id='commitmentUnit'
                    name='commitmentUnit'
                    value={membership.commitmentUnit}
                    disabled={readOnly}
                    required={membership.commitment !== ''}
                    className={
                      `${FORM_INPUT_CLASSES} self-end enabled:cursor-pointer`
                    }
                    onChange={(event) => {
                      setMembership(
                        { ...membership, commitmentUnit: event.target.value }
                      );
                    }}
                  >
                    <option value=''>-- unit --</option>
                    <option value='hour'>hour(s)</option>
                    <option value='day'>day(s)</option>
                    <option value='week'>week(s)</option>
                    <option value='month'>month(s)</option>
                    <option value='year'>year(s)</option>
                  </select>
                </div>
              </div>

              <div className='flex self-end items-center gap-1'>
                <label htmlFor='autoRenewal'>auto-renewal</label>
                <input
                  id='autoRenewal'
                  name='autoRenewal'
                  type='checkbox'
                  value='autoRenewal'
                  checked={membership.autoRenewal}
                  onChange={() => {
                    setMembership({
                      ...membership, autoRenewal: !membership.autoRenewal
                    });
                  }}
                />
              </div>
            </div>

            <div className='flex flex-col'>
              <label>availability</label>
              <div className='flex gap-3'>
                <AvailabilityButton
                  availabilityType='Desk'
                  selected={membership.availability.Desk}
                  disabled={readOnly}
                  membership={membership}
                  setMembership={setMembership}
                />
                <AvailabilityButton
                  availabilityType='Web'
                  selected={membership.availability.Web}
                  disabled={readOnly}
                  membership={membership}
                  setMembership={setMembership}
                />
                <AvailabilityButton
                  availabilityType='App'
                  selected={membership.availability.App}
                  disabled={readOnly}
                  membership={membership}
                  setMembership={setMembership}
                />
                <AvailabilityButton
                  availabilityType='Other'
                  selected={membership.availability.Other}
                  disabled={readOnly}
                  membership={membership}
                  setMembership={setMembership}
                />
              </div>
            </div>

            <div className='flex flex-col'>
              <label htmlFor='name'>url</label>
              <input
                id='url'
                name='url'
                type='text'
                value={membership.url}
                disabled={readOnly}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setMembership({ ...membership, url: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='notes'>notes</label>
              <textarea
                id='notes'
                name='notes'
                value={membership.notes}
                disabled={readOnly}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setMembership({ ...membership, notes: event.target.value });
                }}
              />
            </div>

            <p>* = required</p>

            {!readOnly
              ? <SubmitButton formMode={formMode} isPending={isPending} />
              : null}
          </form>

          <button
            disabled={deleteMutation.isPending}
            hidden={formMode === 'create'}
            className={`
              flex justify-center border rounded-sm bg-red dark:bg-red-dark px-3
              w-full text-base hover:inset-ring
              active:inset-ring active:font-bold
              ${!deleteMutation.isPending
      ? 'cursor-pointer'
      : 'cursor-progress'
    }`}
            onClick={() => {
              handleMinus();
            }}
          >
            {!deleteMutation.isPending && !removeMutation.isPending
              ? !readOnly
                ? iconMode
                  ? <TbTrashX className='my-0.5 text-xl' />
                  : 'delete'
                : iconMode
                  ? <IoRemoveCircleOutline className='my-0.5 text-xl' />
                  : 'remove'
              : !readOnly
                ? iconMode
                  ? (
                    <span className='flex'>
                      <TbTrashX className='my-0.5 text-xl' />...
                    </span>
                  )
                  : 'deleting'
                : iconMode
                  ? (
                    <span className='flex'>
                      <IoRemoveCircleOutline className='my-0.5 text-xl' />...
                    </span>
                  )
                  : 'removing'}
          </button>

          <ReturnButton
            queriesToInvalidate={[['membershipsByCountry', membership.country]]}
            setFormMode={setFormMode}
            unsavedChanges={
              JSON.stringify(membership) !== JSON.stringify(membership)
            }
          />
        </div>
      </div>

      <Notification
        type={notification.type}
        message={notification.message}
        setNotification={setNotification}
      />
    </div>
  );
}
