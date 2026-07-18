import { use, useRef, useState } from 'react';

import { FaRegAddressCard } from 'react-icons/fa';
import { TbEdit } from 'react-icons/tb';
import { useQuery } from '@tanstack/react-query';

import { getGymMemberships } from '../../../../../../utils/api';
import { IconContext } from '../../../../../../utils/contexts';

import Error from '../../../../../Error';
import Form from './Form';
import List from './List';
import Loading from '../../../../../Loading';
import Notification from '../../../../../Notification';

interface GymMembershipsProps {
  gymId: string
  gymName: string
  gymCountry: string
  gymChain: string
  setEditForm: React.Dispatch<React.SetStateAction<string>>
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string
  }>>
}

export default function GymMemberships (
  { gymId, gymName, gymCountry, gymChain, setEditForm, setParentNotification }:
  GymMembershipsProps
) {
  const scrollTopRef = useRef(0);

  const iconMode = use(IconContext);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['gymMemberships', gymId],
    queryFn: () => getGymMemberships({ gymId: gymId })
  });

  const [formMode, setFormMode] = useState('hidden');
  const [selectedMembershipId, setSelectedMembershipId] = useState('');

  const [notification, setNotification] = useState({
    type: '',
    message: ''
  });

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={error.message} />;
  }

  return (
    <div
      className='flex flex-1 flex-col gap-5 min-h-0'
    >
      <h3 className='self-center text-center'>
        {iconMode
          ? (
            <span className='flex gap-2 items-center'>
              <TbEdit className='text-2xl' />
              <FaRegAddressCard className='text-2xl' />
              {gymName}
            </span>
          )
          : <span>editing memberships for {gymName}</span>}
      </h3>

      <div className='flex flex-1 flex-col overflow-y-scroll'>
        {formMode === 'hidden'
          ? (
            <div className='flex flex-1 overflow-y-scroll'>
              <List
                scrollTopRef={scrollTopRef}
                memberships={data}
                setFormMode={setFormMode}
                setSelectedMembershipId={setSelectedMembershipId}
                setEditForm={setEditForm}
                setParentNotification={setParentNotification}
              />
              <Notification
                type={notification.type}
                message={notification.message}
                setNotification={setNotification}
              />
            </div>
          )
          : (
            <Form
              gymId={gymId}
              gymCountry={gymCountry}
              gymChain={gymChain}
              currentMembershipIds={data.map((membership) => membership.id)}
              formMode={formMode}
              setFormMode={setFormMode}
              selectedMembershipId={selectedMembershipId}
              setSelectedMembershipId={setSelectedMembershipId}
              setParentNotification={setNotification}
            />
          )}
      </div>
    </div>
  );
}
