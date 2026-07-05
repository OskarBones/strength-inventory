import { use, useRef, useState } from 'react';

import { FaRegAddressCard } from 'react-icons/fa';

import { IconContext } from '../../../../utils/contexts';

import { Form } from './Form/Index';
import List from './List';
import Notification from '../../../Notification';

export default function AdminMemberships () {
  const iconMode = use(IconContext);

  const scrollTopRef = useRef(0);

  const [formMode, setFormMode] = useState('hidden');
  const [selectedMembershipId, setSelectedMembershipId] = useState('');
  const [country, setCountry] = useState('');
  const [chain, setChain] = useState('');

  const [notification, setNotification] = useState({
    type: '',
    message: ''
  });

  return (
    // give Notification a place to hide
    <div className='relative flex flex-1 overflow-y-hidden'>
      <div
        className='
          flex flex-1 flex-col gap-1 border rounded-sm
          bg-secondary dark:bg-secondary-dark p-3 overflow-y-scroll'
      >
        <h2 className='self-center font-bold'>
          {iconMode
            ? <FaRegAddressCard className='text-2xl' />
            : 'memberships'}
        </h2>

        {formMode === 'hidden'
          ? (
            <List
              scrollTopRef={scrollTopRef}
              setFormMode={setFormMode}
              setSelectedMembershipId={setSelectedMembershipId}
              country={country}
              setCountry={setCountry}
              chain={chain}
              setChain={setChain}
              setParentNotification={setNotification}
            />
          )
          : (
            <Form
              formMode={formMode}
              setFormMode={setFormMode}
              selectedMembershipId={selectedMembershipId}
              defaultCountry={country}
              defaultChain={chain}
              usedInGymMemberships={false}
              addToGym={false}
              gymId=''
              setParentNotification={setNotification}
            />
          )}
      </div>

      <Notification
        type={notification.type}
        message={notification.message}
        setNotification={setNotification}
      />
    </div>
  );
}
