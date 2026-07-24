/* NOTE */

/* ReturnButton has permanent unsavedChanges === true after
any opening hours value has been changed,
whether or not the change was subsequently reverted.
The current structure of the component does not
facilitate comparisons with original hours without
adding new lines of clumsy code. */


import { use, useActionState, useState } from 'react';

import { FaEye, FaRegAddressCard } from 'react-icons/fa';
import { skipToken, useMutation, useQuery, useQueryClient }
  from '@tanstack/react-query';
import { TbClock, TbClockFilled, TbEdit, TbPlus, TbUserStar }
  from 'react-icons/tb';
import { BsPeople } from 'react-icons/bs';
import { CgGym } from 'react-icons/cg';
import { LuSave } from 'react-icons/lu';

import { AuthContext, IconContext } from '../../../../../utils/contexts';
import { getCities, getDistricts, getGym, postGym, putGym }
  from '../../../../../utils/api';
import handleSubmitError from '../../../../../utils/handleSubmitError';

import Error from '../../../../Error';
import GymEquipment from './GymEquipment/Index';
import GymMemberships from './GymMemberships/Index';
import Loading from '../../../../Loading';
import Notification from '../../../../Notification';
import OpeningHoursDayInput from './OpeningHoursDayInput';
import OpeningHoursExceptions from './OpeningHoursExceptions/Index';
import ReturnButton from '../../ReturnButton';

import { FORM_INPUT_CLASSES } from '../../../../../constants/theme';
import { WEEKDAYS } from '../../../../../constants/values';

import {
  type District,
  type GymFormHours,
  GymFormHoursSchema,
  type GymFrontendPostAndPut,
  GymFrontendPostAndPutSchema,
  type Hours,
  LOCATION_MAX_LEN,
  type OpeningHoursException,
  STREET_NO_MAX_LEN
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
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['gym', selectedGymId]
      });
      void queryClient.invalidateQueries({
        queryKey: ['gymsIdAndName']
      });
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
      chain: chain,
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
      url: url,
      location: location,
      equipmentVisible: equipmentVisible,
      membershipsVisible: membershipsVisible,
      openingHoursVisible: openingHoursVisible,
      notes: notes
    });
    setOriginalGym({
      name: name,
      chain: chain,
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
      url: url,
      location: location,
      equipmentVisible: equipmentVisible,
      membershipsVisible: membershipsVisible,
      openingHoursVisible: openingHoursVisible,
      notes: notes
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
        <form
          action={dispatchAction}
          autoComplete='off'
          className='flex flex-col gap-3'
        >
          <div className='flex flex-col gap-1'>
            <div className='flex flex-col'>
              <label htmlFor='name'>name*</label>
              <input
                id='name'
                name='name'
                type='text'
                value={gym.name}
                required
                autoFocus={formMode === 'create'}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setGym({ ...gym, name: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='chain'>chain</label>
              <input
                id='chain'
                name='chain'
                type='text'
                value={gym.chain}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setGym({ ...gym, chain: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='city'>city*</label>
              <select
                id='city'
                name='city'
                value={gym.city}
                required
                className={`${FORM_INPUT_CLASSES} cursor-pointer`}
                onChange={(event) => {
                  const selectedCity = citiesQuery.data
                    .find((city) => city.name === event.target.value);
                  // truthy when the -- please select -- option is not selected
                  if (selectedCity) {
                    setGym({
                      ...gym,
                      city: event.target.value,
                      country: selectedCity.country,
                      district: ''
                    });
                  } else {
                    setGym({
                      ...gym, city: '', country: '', district: ''
                    });
                  }
                }}
              >
                <option value=''>-- please select a city --</option>
                {citiesQuery.data.map((city) => (
                  <option key={city.id} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>

            <div className='flex flex-col'>
              <label htmlFor='district'>district*</label>
              <select
                id='district'
                name='district'
                value={gym.district}
                disabled={gym.city === ''}
                required
                className={`${FORM_INPUT_CLASSES} enabled:cursor-pointer`}
                onChange={(event) => {
                  setGym({ ...gym, district: event.target.value });
                }}
              >
                <option value=''>
                  {gym.city
                    ? '-- please select a district --'
                    : '-- please select a city --'}
                </option>
                {filteredDistricts.map((district) => (
                  <option key={district.name} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex flex-col'>
              <label htmlFor='street'>street*</label>
              <input
                id='street'
                name='street'
                type='text'
                value={gym.street}
                required
                maxLength={LOCATION_MAX_LEN}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setGym({ ...gym, street: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='streetNumber'>street number*</label>
              <input
                id='streetNumber'
                name='streetNumber'
                type='text'
                value={gym.streetNumber}
                required
                maxLength={STREET_NO_MAX_LEN}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setGym({ ...gym, streetNumber: event.target.value });
                }}
              />
            </div>

            <div className='flex gap-3'>
              <div className='flex flex-col'>
                <label htmlFor='latitude'>latitude*</label>
                <input
                  id='latitude'
                  name='latitude'
                  type='number'
                  value={gym.latitude}
                  placeholder='D.DDDDD'
                  required
                  min={-90}
                  max={90}
                  step={0.00001}
                  className={`${FORM_INPUT_CLASSES} w-20`}
                  onChange={(event) => {
                    setGym({ ...gym, latitude: event.target.value });
                  }}
                />
              </div>

              <div className='flex flex-col'>
                <label htmlFor='longitude'>longitude*</label>
                <input
                  id='longitude'
                  name='longitude'
                  type='number'
                  value={gym.longitude}
                  placeholder='D.DDDDD'
                  required
                  min={-180}
                  max={180}
                  step={0.00001}
                  className={`${FORM_INPUT_CLASSES} w-22`}
                  onChange={(event) => {
                    setGym({ ...gym, longitude: event.target.value });
                  }}
                />
              </div>
            </div>

            <div className='flex flex-col'>
              <label htmlFor='url'>url</label>
              <input
                id='url'
                name='url'
                type='url'
                value={gym.url}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setGym({ ...gym, url: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='location'>location link</label>
              <input
                id='location'
                name='location'
                type='url'
                value={gym.location}
                required
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setGym({ ...gym, location: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='notes'>notes</label>
              <textarea
                id='notes'
                name='notes'
                value={gym.notes}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setGym({ ...gym, notes: event.target.value });
                }}
              />
            </div>

            <p>* = required</p>
          </div>

          <div className='flex flex-col gap-2'>
            <h4>
              {iconMode
                ? <TbClockFilled className='text-xl' />
                : (
                  <span className='text-sm font-bold'>
                    regular opening hours
                  </span>
                )}
            </h4>

            <div className='flex flex-col gap-1'>
              <h5>
                {iconMode
                  ? <BsPeople className='text-base' />
                  : 'everyone'}
              </h5>
              <div className='flex flex-row gap-10'>
                <div className='flex flex-col gap-1'>
                  <OpeningHoursDayInput
                    group='everyone'
                    day='MO'
                    editedHours={gymQuery.data?.openingHoursEveryone}
                    setHoursChanged={setHoursChanged}
                  />
                  <OpeningHoursDayInput
                    group='everyone'
                    day='TU'
                    editedHours={gymQuery.data?.openingHoursEveryone}
                    setHoursChanged={setHoursChanged}
                  />
                  <OpeningHoursDayInput
                    group='everyone'
                    day='WE'
                    editedHours={gymQuery.data?.openingHoursEveryone}
                    setHoursChanged={setHoursChanged}
                  />
                  <OpeningHoursDayInput
                    group='everyone'
                    day='TH'
                    editedHours={gymQuery.data?.openingHoursEveryone}
                    setHoursChanged={setHoursChanged}
                  />
                </div>
                <div className='flex flex-col justify-center gap-1'>
                  <OpeningHoursDayInput
                    group='everyone'
                    day='FR'
                    editedHours={gymQuery.data?.openingHoursEveryone}
                    setHoursChanged={setHoursChanged}
                  />
                  <OpeningHoursDayInput
                    group='everyone'
                    day='SA'
                    editedHours={gymQuery.data?.openingHoursEveryone}
                    setHoursChanged={setHoursChanged}
                  />
                  <OpeningHoursDayInput
                    group='everyone'
                    day='SU'
                    editedHours={gymQuery.data?.openingHoursEveryone}
                    setHoursChanged={setHoursChanged}
                  />
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-1'>
              <h5>
                {iconMode
                  ? <FaRegAddressCard className='text-base' />
                  : 'members'}
              </h5>
              <div className='flex flex-row gap-10'>
                <div className='flex flex-col gap-1'>
                  <OpeningHoursDayInput
                    group='members'
                    day='MO'
                    editedHours={gymQuery.data?.openingHoursMembers}
                    setHoursChanged={setHoursChanged}
                  />
                  <OpeningHoursDayInput
                    group='members'
                    day='TU'
                    editedHours={gymQuery.data?.openingHoursMembers}
                    setHoursChanged={setHoursChanged}
                  />
                  <OpeningHoursDayInput
                    group='members'
                    day='WE'
                    editedHours={gymQuery.data?.openingHoursMembers}
                    setHoursChanged={setHoursChanged}
                  />
                  <OpeningHoursDayInput
                    group='members'
                    day='TH'
                    editedHours={gymQuery.data?.openingHoursMembers}
                    setHoursChanged={setHoursChanged}
                  />
                </div>
                <div className='flex flex-col justify-center gap-1'>
                  <OpeningHoursDayInput
                    group='members'
                    day='FR'
                    editedHours={gymQuery.data?.openingHoursMembers}
                    setHoursChanged={setHoursChanged}
                  />
                  <OpeningHoursDayInput
                    group='members'
                    day='SA'
                    editedHours={gymQuery.data?.openingHoursMembers}
                    setHoursChanged={setHoursChanged}
                  />
                  <OpeningHoursDayInput
                    group='members'
                    day='SU'
                    editedHours={gymQuery.data?.openingHoursMembers}
                    setHoursChanged={setHoursChanged}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-1'>
            <h4>
              {iconMode
                ? <FaEye className='text-xl' />
                : <span className='text-sm font-bold'>visibility toggles</span>}
            </h4>
            <div className='flex gap-1'>
              <label
                htmlFor='equipmentVisible'
                hidden={formMode === 'create'}
              >
                {iconMode
                  ? <span className='flex w-5 text-base'><CgGym /></span>
                  : <span className='flex w-30'>equipment visible</span>}
              </label>
              <input
                id='equipmentVisible'
                name='equipmentVisible'
                type='checkbox'
                value='visible'
                checked={gym.equipmentVisible}
                hidden={formMode === 'create'}
                onChange={() => {
                  setGym({ ...gym, equipmentVisible: !gym.equipmentVisible });
                }}
              />
            </div>
            <div className='flex gap-1'>
              <label
                htmlFor='membershipsVisible'
                hidden={formMode === 'create'}
              >
                {iconMode
                  ? (
                    <span className='flex w-5 text-base'>
                      <FaRegAddressCard />
                    </span>
                  )
                  : <span className='flex w-30'>memberships visible</span>}
              </label>
              <input
                id='membershipsVisible'
                name='membershipsVisible'
                type='checkbox'
                value='visible'
                checked={gym.membershipsVisible}
                hidden={formMode === 'create'}
                onChange={() => {
                  setGym({
                    ...gym, membershipsVisible: !gym.membershipsVisible
                  });
                }}
              />
            </div>
            <div className='flex gap-1'>
              <label htmlFor='openingHoursVisible'>
                {iconMode
                  ? <span className='flex w-5 text-base'><TbClock /></span>
                  : <span className='flex w-30'>opening hours visible</span>}
              </label>
              <input
                id='openingHoursVisible'
                name='openingHoursVisible'
                type='checkbox'
                value='visible'
                checked={gym.openingHoursVisible}
                onChange={() => {
                  setGym({
                    ...gym, openingHoursVisible: !gym.openingHoursVisible
                  });
                }}
              />
            </div>
          </div>
          {/* actual submit button below <OpeningHoursExceptions /> */}
          <input
            type='submit'
            id='submit-form'
            disabled={isPending}
            className='hidden'
          />
        </form>

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
