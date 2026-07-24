import { use, useState } from 'react';

import { FaRegAddressCard } from 'react-icons/fa';
import { GiMeshNetwork } from 'react-icons/gi';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdOutlineLocationOn } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';

import { getMembershipsByCountry } from '../../../../../../utils/api';
import { IconContext } from '../../../../../../utils/contexts';

import Error from '../../../../../Error';
import Loading from '../../../../../Loading';
import { Form as MembershipForm } from '../../../Memberships/Form/Index';
import MembershipList from '../../../MembershipList';
import ReturnButton from '../../../ReturnButton';

import { FORM_RETURN_BUTTON_CLASSES } from '../../../../../../constants/theme';

interface FormProps {
  gymId: string
  gymCountry: string
  gymChain: string
  currentMembershipIds: string[]
  formMode: string
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  selectedMembershipId: string
  setSelectedMembershipId: React.Dispatch<React.SetStateAction<string>>
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string
  }>>
}

export default function Form ({
  gymId,
  gymCountry,
  gymChain,
  currentMembershipIds,
  formMode,
  setFormMode,
  selectedMembershipId,
  setSelectedMembershipId,
  setParentNotification
}: FormProps) {
  const iconMode = use(IconContext);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['membershipsByCountry', gymCountry],
    queryFn: () => getMembershipsByCountry({ country: gymCountry })
  });

  const [createMode, setCreateMode] = useState('');

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={error.message} />;
  }

  const chainMemberships = data.filter((membership) => {
    return membership.chain === gymChain;
  });

  if (formMode === 'create') {
    if (!createMode) {
      return (
        <div className='flex flex-col gap-3'>
          <h4 className='self-center'>
            {iconMode
              ? (
                <span className='flex justify-center gap-1 text-2xl'>
                  <IoAddCircleOutline /> <FaRegAddressCard />
                </span>
              )
              : 'add new membership'}
          </h4>

          <button
            className={`${FORM_RETURN_BUTTON_CLASSES} w-full`}
            onClick={() => {
              setCreateMode('noChain');
            }}
          >
            {iconMode
              ? (
                <span className='flex gap-1 text-xl'>
                  <MdOutlineLocationOn /> <FaRegAddressCard />
                </span>
              )
              : <span className='text-sm'>gym's own membership</span>}
          </button>

          <div className='flex flex-col gap-0.5'>
            <button
              disabled={chainMemberships.length === 0}
              className={`
                ${FORM_RETURN_BUTTON_CLASSES} w-full
                disabled:border-dashed
                disabled:bg-secondary dark:disabled:bg-secondary-dark
                disabled:cursor-not-allowed`}
              onClick={() => {
                setCreateMode('chain');
              }}
            >
              {iconMode
                ? (
                  <span className='flex gap-1 text-xl'>
                    <GiMeshNetwork /> <FaRegAddressCard />
                  </span>
                )
                : <span className='text-sm'>chain membership</span>}
            </button>
            {chainMemberships.length === 0
              ? (
                <p className='self-center text-xs'>
                  not available for this gym
                </p>
              )
              : null}
          </div>

          <ReturnButton
            queriesToInvalidate={[['gymMemberships', gymId]]}
            setFormMode={setFormMode}
            unsavedChanges={false}
          />
        </div>
      );
    } else if (createMode === 'noChain') {
      return (
        <MembershipForm
          formMode={formMode}
          setFormMode={setFormMode}
          selectedMembershipId={selectedMembershipId}
          defaultCountry=''
          defaultChain=''
          usedInGymMemberships={true}
          addToGym={true}
          gymId={gymId}
          setParentNotification={setParentNotification}
        />
      );
    } else {  // createMode === 'chain'
      return (
        <div className='flex flex-col gap-3'>
          <h3 className='flex justify-center text-base'>
            {iconMode
              ? (
                <span className='flex justify-center gap-1 text-2xl'>
                  <IoAddCircleOutline /> <GiMeshNetwork /> <FaRegAddressCard />
                </span>
              )
              : 'select a chain membership to add'}
          </h3>

          <div className='bg-background dark:bg-background-dark'>
            <MembershipList
              memberships={chainMemberships}
              filterType='chain'
              setFormMode={setFormMode}
              setParentNotification={setParentNotification}
              highlightChainMemberships={false}
              setSelectedMembershipId={setSelectedMembershipId}
              disabledMembershipIds={currentMembershipIds}
              gymId={gymId}
            />
          </div>

          <ReturnButton
            queriesToInvalidate={[['gymMemberships', gymId]]}
            setFormMode={setFormMode}
            unsavedChanges={false}
          />
        </div>
      );
    }
  }

  return (  // formMode === 'edit'
    <MembershipForm
      formMode={formMode}
      setFormMode={setFormMode}
      selectedMembershipId={selectedMembershipId}
      defaultCountry=''
      defaultChain=''
      usedInGymMemberships={true}
      addToGym={false}
      gymId={gymId}
      setParentNotification={setParentNotification}
    />
  );
}
