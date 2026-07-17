import { use, useState } from 'react';

import {
  useMutation, useQuery, useQueryClient
} from '@tanstack/react-query';
import { CgGym } from 'react-icons/cg';
import { MdClear } from 'react-icons/md';
import { TbEdit } from 'react-icons/tb';

import { AuthContext, IconContext } from '../../../../../../utils/contexts';
import {
  deleteGymEquipment,
  getEquipment,
  getGymEquipment,
  postGymEquipment,
  setGymEquipmentCount
} from '../../../../../../utils/api';

import AddNew from './AddNew';
import AvailableList from './AvailableList';
import CurrentList from './CurrentList';
import EditFormReturnButton from '../EditFormReturnButton';

import { type Equipment } from '@strength-inventory/schemas';

interface GymEquipmentProps {
  gymId: string
  gymName: string
  setEditForm: React.Dispatch<React.SetStateAction<string>>
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string
  }>>
}

export default function GymEquipment (
  { gymId, gymName, setEditForm, setParentNotification }: GymEquipmentProps
) {
  const auth = use(AuthContext);
  const iconMode = use(IconContext);

  const queryClient = useQueryClient();

  const gymEquipmentQuery = useQuery({
    queryKey: ['gymEquipment', gymId],
    queryFn: () => getGymEquipment({ gymId: gymId })
  });

  const equipmentQuery = useQuery({
    queryKey: ['equipment'],
    queryFn: () => getEquipment()
  });

  const addEquipmentMutation = useMutation({
    mutationFn: ({ gymId, equipmentId, count }:
    { gymId: string, equipmentId: string, count: number }) =>
      postGymEquipment({
        gymId: gymId,
        equipmentId: equipmentId,
        count: count,
        refresh: auth.refresh,
        logout: auth.logout
      }),
    onSuccess: async (responseFromServer) => {
      await queryClient.invalidateQueries({
        queryKey: ['gymEquipment', responseFromServer.gymId]
      });
    }
  });

  const setEquipmentCountMutation = useMutation({
    mutationFn: ({ relationshipId, count }:
    { relationshipId: string, count: number }) =>
      setGymEquipmentCount({
        relationshipId: relationshipId,
        count: count,
        refresh: auth.refresh,
        logout: auth.logout
      }),
    onSuccess: async (editedRelationshipFromServer) => {
      if (gymEquipmentQuery.data) {
        const updatedGymEquipment = gymEquipmentQuery.data.map((equipment) => {
          if (equipment.gymequipment.id !== editedRelationshipFromServer.id) {
            return equipment;
          } else {
            equipment.gymequipment = editedRelationshipFromServer;
            return equipment;
          }
        });

        await queryClient.setQueryData([
          'gymEquipment',
          gymId
        ], updatedGymEquipment);
      }
    }
  });

  const removeEquipmentMutation = useMutation({
    mutationFn: ({ gymId, equipmentId }:
    { gymId: string, equipmentId: string }) =>
      deleteGymEquipment({
        gymId: gymId,
        equipmentId: equipmentId,
        refresh: auth.refresh,
        logout: auth.logout
      }),
    onSuccess: async (responseFromServer) => {
      if (gymEquipmentQuery.data) {
        const updatedGymEquipment
          = gymEquipmentQuery.data.filter((equipment) => {
            return equipment.id !== responseFromServer.equipmentId;
          });

        await queryClient.setQueryData([
          'gymEquipment',
          gymId
        ], updatedGymEquipment);
      }
    }
  });

  const [search, setSearch] = useState('');
  const [equipmentToAdd, setEquipmentToAdd] = useState<Equipment | null>(null);

  if (gymEquipmentQuery.isPending || equipmentQuery.isPending) {
    return <p>Loading...</p>;
  }

  if (gymEquipmentQuery.isError || equipmentQuery.isError) {
    if (gymEquipmentQuery.isError && equipmentQuery.isError) {
      return (
        <div>
          <p>Error: {gymEquipmentQuery.error.message}</p>
          <p>Error: {equipmentQuery.error.message}</p>
        </div>
      );
    } else if (gymEquipmentQuery.isError) {
      return <p>Error: {gymEquipmentQuery.error.message}</p>;
    } else if (equipmentQuery.isError) {
      return <p>Error: {equipmentQuery.error.message}</p>;
    }
  }

  const gymEquipment = gymEquipmentQuery.data;
  gymEquipment.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()
    ? 1
    : -1));

  const equipment = equipmentQuery.data;
  equipment.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()
    ? 1
    : -1));

  let filteredEquipment = equipment;
  if (search !== '') {
    filteredEquipment = equipment.filter((piece) => {
      return (
        piece.name.toLowerCase().includes(search.toLowerCase())
        || piece.subcategory.toLowerCase().includes(search.toLowerCase())
        || piece.manufacturer.toLowerCase().includes(search.toLowerCase()));
    });
  }

  return (
    <div
      className='flex flex-1 flex-col min-h-0'
    >
      <h3 className='self-center mb-3 text-center'>
        {iconMode
          ? (
            <span className='flex gap-2 items-center'>
              <TbEdit className='text-2xl' />
              <CgGym className='text-2xl' />
              {gymName}
            </span>
          )
          : <span>editing equipment for {gymName}</span>}
      </h3>
      <div className='flex flex-1 flex-col overflow-y-scroll'>
        <CurrentList
          gymId={gymId}
          gymEquipment={gymEquipment}
          setEquipmentCountMutation={setEquipmentCountMutation}
          removeEquipmentMutation={removeEquipmentMutation}
        />
        {search
          ? !equipmentToAdd
            ? (
              <AvailableList
                currentEquipment={gymEquipment}
                filteredEquipment={filteredEquipment}
                setEquipmentToAdd={setEquipmentToAdd}
              />
            )
            : (
              <AddNew
                piece={equipmentToAdd}
                gymId={gymId}
                addEquipmentMutation={addEquipmentMutation}
                setEquipmentToAdd={setEquipmentToAdd}
                setParentNotification={setParentNotification}
              />
            )
          : (
            null
          )}
        <div
          className='
          flex gap-1 mt-1 mb-3 bg-background dark:bg-background-dark px-1'
        >
          <input
            type='search'
            value={search}
            placeholder='search to add new equipment'
            className='flex-1'
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
          <button
            className='cursor-pointer'
            onClick={() => {
              setSearch('');
            }}
          >
            <MdClear className='text-2xl' />
          </button>
        </div>
        <EditFormReturnButton
          model='equipment'
          setEditForm={setEditForm}
          setParentNotification={setParentNotification}
        />
      </div>
    </div>
  );
}
