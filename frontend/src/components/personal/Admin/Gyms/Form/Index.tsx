/* NOTE */

/* ReturnButton has permanent unsavedChanges === true after
any opening hours value has been changed,
whether or not the change is subsequently reverted.
The current structure of the component does not
facilitate comparisons with original hours without
adding new lines of clumsy code. */


import { use, useActionState, useState } from 'react';

import { skipToken, useMutation, useQuery, useQueryClient }
  from '@tanstack/react-query';
import { TbEdit, TbPlus, TbUserStar } from 'react-icons/tb';
import { CgGym } from 'react-icons/cg';
import { FaRegAddressCard } from 'react-icons/fa';
import { LuSave } from 'react-icons/lu';

import { AuthContext, IconContext } from '@/utils/contexts';
import { getCities, getDistricts, getGym, postGym, putGym } from '@/utils/api';
import handleSubmitError from '@/utils/handleSubmitError';

import Error from '@/components/Error';
import FormElement from './FormElement';
import GymEquipment from './GymEquipment/Index';
import GymMemberships from './GymMemberships/Index';
import Loading from '@/components/Loading';
import Notification from '@/components/Notification';
import OpeningHoursExceptions from './OpeningHoursExceptions/Index';
import ReturnButton from '../../ReturnButton';

import { WEEKDAYS } from '@/constants/values';

import {
  type GymFormHours,
  GymFormHoursSchema,
  type GymFrontendPostAndPut,
  GymFrontendPostAndPutSchema
} from '@strength-inventory/schemas/frontend';

import {
  type District,
  type Hours,
  type OpeningHoursException
} from '@strength-inventory/schemas';

interface FormProps {
  formMode: string;
  setFormMode: React.Dispatch<React.SetStateAction<string>>;
  selectedGymId: string;
  setSelectedGymId: React.Dispatch<React.SetStateAction<string>>;
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string
  }>>
}

export default function Form (
  {
    formMode,
    setFormMode,
    selectedGymId,
    setSelectedGymId,
    setParentNotification
  }: FormProps
) {
  function formatHours (req: GymFormHours) {
    const openingHoursEveryone: Hours = {
      MO: ['', ''],
      TU: ['', ''],
      WE: ['', ''],
      TH: ['', ''],
      FR: ['', ''],
      SA: ['', ''],
      SU: ['', '']
    };
    const openingHoursMembers: Hours = {
      MO: ['', ''],
      TU: ['', ''],
      WE: ['', ''],
      TH: ['', ''],
      FR: ['', ''],
      SA: ['', ''],
      SU: ['', '']
    };

    WEEKDAYS.forEach((weekday) => {
      openingHoursEveryone[weekday]
        = [req[`everyone${weekday}Open`], req[`everyone${weekday}Close`]];
      openingHoursMembers[weekday]
        = [req[`members${weekday}Open`], req[`members${weekday}Close`]];
    });

    return { openingHoursEveryone, openingHoursMembers };
  }

  const auth = use(AuthContext);
  const iconMode = use(IconContext);

  const queryClient = useQueryClient();

  const gymQuery = useQuery({
    queryKey: ['gym', selectedGymId],
    queryFn: selectedGymId
      ? () => getGym({ id: selectedGymId })
      : skipToken  // disable this query when creating a new gym
  });

  const citiesQuery = useQuery({
    queryKey: ['cities'],
    queryFn: () => getCities()
  });

  const districtsQuery = useQuery({
    queryKey: ['districts'],
    queryFn: () => getDistricts()
  });

  const postMutation = useMutation({
    mutationFn: (newGym: GymFrontendPostAndPut) =>
      postGym({ gym: newGym, refresh: auth.refresh, logout: auth.logout }),
    onSuccess: (newGymFromServer) => {
      setSelectedGymId(newGymFromServer.id);
      setOriginalName(newGymFromServer.name);
      setFormMode('edit');
      setTimeout(() => {
        setNotification({
          type: 'success', message: 'gym created'
        });
      }, 150);
    }
  });

  const putMutation = useMutation({
    mutationFn: ({ id, updatedGym }:
    { id: string, updatedGym: GymFrontendPostAndPut; }) =>
      putGym({
        id: id, gym: updatedGym, refresh: auth.refresh, logout: auth.logout
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['gym', selectedGymId] }),
        queryClient.invalidateQueries({ queryKey: ['gymsIdAndName'] })
      ]);
      setFormMode('hidden');
      setTimeout(() => {
        setParentNotification({
          type: 'success', message: 'changes saved'
        });
      }, 150);
    }
  });

  const [gym, setGym] = useState({
    name: '',
    chain: '',
    street: '',
    streetNumber: '',
    district: '',
    city: '',
    country: '',
    latitude: '',
    longitude: '',
    url: '',
    location: '',
    equipmentVisible: false,
    membershipsVisible: false,
    openingHoursVisible: false,
    notes: ''
  });
  const [originalGym, setOriginalGym] = useState({
    name: '',
    chain: '',
    street: '',
    streetNumber: '',
    district: '',
    city: '',
    country: '',
    latitude: '',
    longitude: '',
    url: '',
    location: '',
    equipmentVisible: false,
    membershipsVisible: false,
    openingHoursVisible: false,
    notes: ''
  });

  /* Opening hours exceptions move with
  the above state variables and regular opening hours,
  but they have their own state for convenience.
  formatSubmit function attaches exceptions to
  the other variables before API calls. */
  const [exceptions, setExceptions] = useState<OpeningHoursException[]>([]);
  const [originalExceptions, setOriginalExceptions]
    = useState<OpeningHoursException[]>([]);
  /* editForm denotes the subform opened on top of this form. */
  const [editForm, setEditForm] = useState('');
  const [firstRender, setFirstRender] = useState(true);
  const [originalName, setOriginalName] = useState('');
  const [hoursChanged, setHoursChanged] = useState(false);
  const [sevenDaysBefore] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });

  const [notification, setNotification] = useState({
    type: '',
    message: ''
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_state, dispatchAction, isPending] = useActionState(submit, {
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
      const hours = GymFormHoursSchema.parse(req);
      const { openingHoursEveryone, openingHoursMembers }
        = formatHours(hours);
      const validatedReq = GymFrontendPostAndPutSchema.parse({
        ...req,
        country: gym.country,
        openingHoursEveryone: openingHoursEveryone,
        openingHoursMembers: openingHoursMembers,
        openingHoursExceptions: { data: exceptions }
      });
      if (formMode === 'create') {
        try {
          await postMutation.mutateAsync(validatedReq);
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
            id: selectedGymId, updatedGym: validatedReq
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

  if ((selectedGymId && gymQuery.isPending)
    || citiesQuery.isPending
    || districtsQuery.isPending) {
    return <Loading />;
  }

  if (selectedGymId && gymQuery.isError) {
    return <Error message={gymQuery.error.message} />;
  }

  if (citiesQuery.isError) {
    return <Error message={citiesQuery.error.message} />;
  }

  if (districtsQuery.isError) {
    return <Error message={districtsQuery.error.message} />;
  }

  /* Initialize the form fields when opened in edit mode.
  selectedGymId is only defined in edit mode. */
  if (selectedGymId && gymQuery.isSuccess && firstRender) {
    const {
      name,
      chain,
      street,
      streetNumber,
      district,
      city,
      country,
      latitude,
      longitude,
      openingHoursExceptions,
      url,
      location,
      equipmentVisible,
      membershipsVisible,
      openingHoursVisible,
      notes
    } = gymQuery.data;

    setGym({
      name: name,
      chain: chain ?? '',
      street: street,
      streetNumber: streetNumber,
      district: district,
      city: city,
      country: country,
      latitude: latitude
        ? String(latitude)
        : '',
      longitude: longitude
        ? String(longitude)
        : '',
      url: url ?? '',
      location: location,
      equipmentVisible: equipmentVisible,
      membershipsVisible: membershipsVisible,
      openingHoursVisible: openingHoursVisible,
      notes: notes ?? ''
    });
    setOriginalGym({
      name: name,
      chain: chain ?? '',
      street: street,
      streetNumber: streetNumber,
      district: district,
      city: city,
      country: country,
      latitude: latitude
        ? String(latitude)
        : '',
      longitude: longitude
        ? String(longitude)
        : '',
      url: url ?? '',
      location: location,
      equipmentVisible: equipmentVisible,
      membershipsVisible: membershipsVisible,
      openingHoursVisible: openingHoursVisible,
      notes: notes ?? ''
    });

    /* This is the only place in the entire application where old exceptions get
    deleted. Notice that these changes are disregarded
    if the admin returns without saving. */
    const prunedExceptions = openingHoursExceptions.data.filter((exception) => {
      return exception.date > sevenDaysBefore;
    });
    setExceptions(prunedExceptions);
    setOriginalExceptions(prunedExceptions);

    setFirstRender(false);
    setOriginalName(name);
  }

  // set districts for the district <select>
  const selectedCity = citiesQuery.data.find((city) => city.name === gym.city);
  let filteredDistricts: District[] = [];
  if (selectedCity) {
    filteredDistricts = selectedCity.districts;
  }

  if (editForm === 'equipment') {
    return (
      <GymEquipment
        gymId={selectedGymId}
        gymName={gym.name}
        setEditForm={setEditForm}
        setParentNotification={setNotification}
      />
    );
  }

  if (editForm === 'memberships') {
    return (
      <GymMemberships
        gymId={selectedGymId}
        gymName={gym.name}
        gymCountry={gym.country}
        gymChain={gym.chain}
        setEditForm={setEditForm}
        setParentNotification={setNotification}
      />
    );
  }

  return (
    <div className='flex flex-col min-h-0'>
      <h3 className='flex self-center text-base'>
        {/* formMode is either 'create' or 'edit' */}
        {formMode === 'create'
          ? iconMode
            ? <TbPlus className='text-2xl' />
            : 'create new gym'
          : iconMode
            ? (
              <span className='flex gap-1'>
                <TbEdit className='text-2xl' /> {originalName}
              </span>
            )
            : <span className='text-center'>editing {originalName}</span>}
      </h3>

      <div className='flex flex-col gap-3 px-3 overflow-y-scroll text-xs'>
        <FormElement
          dispatchAction={dispatchAction}
          gym={gym}
          formMode={formMode}
          setGym={setGym}
          cities={citiesQuery.data}
          filteredDistricts={filteredDistricts}
          iconMode={iconMode}
          selectedGym={gymQuery.data}
          setHoursChanged={setHoursChanged}
          isPending={isPending}
        />

        <OpeningHoursExceptions
          exceptions={exceptions}
          setExceptions={setExceptions}
          setParentNotification={setNotification}
        />

        {/* Actual submit button outside the <form>
        to have <OpeningHoursExceptions /> appear as part of the form.
        Keep this button identical with SubmitButton used by the other forms!*/}
        <label
          htmlFor='submit-form'
          tabIndex={0} /* make tabbable */
          className={`
            flex justify-center mt-3 border rounded-sm
            bg-green dark:bg-green-dark px-3 w-full
            text-primary-text dark:text-primary-text-dark text-base
            active:inset-ring active:font-bold
            ${!isPending
      ? 'cursor-pointer hover:inset-ring'
      : 'cursor-progress'
    }`}
        >
          {formMode === 'create'
            ? !isPending
              ? iconMode
                ? <TbPlus className='my-0.5 text-xl' />
                : 'create'
              : iconMode
                ? (
                  <span className='flex'>
                    <TbPlus className='my-0.5 text-xl' />...
                  </span>
                )
                : 'creating...'
            : !isPending
              ? iconMode
                ? <LuSave className='my-0.5 text-xl' />
                : 'save'
              : iconMode
                ? (
                  <span className='flex'>
                    <LuSave className='my-0.5 text-xl' />...
                  </span>
                )
                : 'saving...'}
        </label>

        <ReturnButton
          queriesToInvalidate={[['gym', selectedGymId], ['gymsIdAndName']]}
          setFormMode={setFormMode}
          unsavedChanges={
            (JSON.stringify(gym) !== JSON.stringify(originalGym))
            || JSON.stringify(exceptions) !== JSON.stringify(originalExceptions)
            || hoursChanged
          }
        />

        {formMode === 'edit'
          ? <hr />
          : null}

        <div className='flex flex-col gap-1 pb-3'>
          {formMode === 'edit'
            ? (
              <>
                <button
                  className='
                    border rounded-sm bg-tertiary dark:bg-tertiary-dark py-1
                    cursor-pointer hover:bg-background
                    dark:hover:bg-background-dark active:font-bold'
                  onClick={() => {
                    setEditForm('equipment');
                  }}
                >
                  {iconMode
                    ? (
                      <span className='flex justify-center gap-1 text-base'>
                        <TbEdit /> <CgGym />
                      </span>
                    )
                    : 'edit equipment'}
                </button>
                <button
                  className='
                    border rounded-sm bg-tertiary dark:bg-tertiary-dark py-1
                    cursor-pointer hover:bg-background
                    dark:hover:bg-background-dark active:font-bold'
                  onClick={() => {
                    setEditForm('memberships');
                  }}
                >
                  {iconMode
                    ? (
                      <span className='flex justify-center gap-1 text-base'>
                        <TbEdit /> <FaRegAddressCard />
                      </span>
                    )
                    : 'edit memberships'}
                </button>
                <button
                  disabled /* upcoming post-1.0 feature */
                  className='
                    border rounded-sm bg-tertiary dark:bg-tertiary-dark py-1
                    text-red-dark dark:text-red
                    cursor-not-allowed enabled:cursor-pointer
                    enabled:hover:bg-background
                    enabled:dark:hover:bg-background-dark
                    enabled:active:font-bold'
                >
                  {iconMode
                    ? (
                      <span className='flex justify-center gap-1 text-base'>
                        <TbEdit /> <TbUserStar />
                      </span>
                    )
                    : 'edit managers'}
                </button>
              </>
            )
            : null}
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
