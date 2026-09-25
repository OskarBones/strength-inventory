import { FaEye, FaRegAddressCard } from 'react-icons/fa';
import { TbClock, TbClockFilled } from 'react-icons/tb';
import { BsPeople } from 'react-icons/bs';
import { CgGym } from 'react-icons/cg';

import OpeningHoursDayInput from './OpeningHoursDayInput';

import { FORM_INPUT_CLASSES } from '@/constants/theme';

import type { CityFrontendGet, GymFrontendGet }
  from '@strength-inventory/schemas/frontend';

import {
  type District,
  LOCATION_MAX_LEN,
  STREET_NO_MAX_LEN
} from '@strength-inventory/schemas';

interface FormElementProps {
  dispatchAction: (payload: FormData) => void
  gym: {
    name: string;
    chain: string;
    street: string;
    streetNumber: string;
    district: string;
    city: string;
    country: string;
    latitude: string;
    longitude: string;
    url: string;
    location: string;
    equipmentVisible: boolean;
    membershipsVisible: boolean;
    openingHoursVisible: boolean;
    notes: string;
  },
  formMode: string,
  setGym: React.Dispatch<React.SetStateAction<{
    name: string;
    chain: string;
    street: string;
    streetNumber: string;
    district: string;
    city: string;
    country: string;
    latitude: string;
    longitude: string;
    url: string;
    location: string;
    equipmentVisible: boolean;
    membershipsVisible: boolean;
    openingHoursVisible: boolean;
    notes: string;
  }>>,
  cities: CityFrontendGet[],
  filteredDistricts: District[],
  iconMode: boolean,
  selectedGym: GymFrontendGet | undefined,
  setHoursChanged: React.Dispatch<React.SetStateAction<boolean>>,
  isPending: boolean
}

export default function FormElement (
  {
    dispatchAction,
    gym,
    formMode,
    setGym,
    cities,
    filteredDistricts,
    iconMode,
    selectedGym,
    setHoursChanged,
    isPending
  }: FormElementProps
) {
  return (
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
              const selectedCity = cities
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
            {cities.map((city) => (
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
          <div className='flex flex-row gap-2.5'>
            <div className='flex flex-col gap-1'>
              <OpeningHoursDayInput
                group='everyone'
                day='MO'
                editedHours={selectedGym?.openingHoursEveryone}
                setHoursChanged={setHoursChanged}
              />
              <OpeningHoursDayInput
                group='everyone'
                day='TU'
                editedHours={selectedGym?.openingHoursEveryone}
                setHoursChanged={setHoursChanged}
              />
              <OpeningHoursDayInput
                group='everyone'
                day='WE'
                editedHours={selectedGym?.openingHoursEveryone}
                setHoursChanged={setHoursChanged}
              />
              <OpeningHoursDayInput
                group='everyone'
                day='TH'
                editedHours={selectedGym?.openingHoursEveryone}
                setHoursChanged={setHoursChanged}
              />
            </div>
            <div className='flex flex-col justify-center gap-1'>
              <OpeningHoursDayInput
                group='everyone'
                day='FR'
                editedHours={selectedGym?.openingHoursEveryone}
                setHoursChanged={setHoursChanged}
              />
              <OpeningHoursDayInput
                group='everyone'
                day='SA'
                editedHours={selectedGym?.openingHoursEveryone}
                setHoursChanged={setHoursChanged}
              />
              <OpeningHoursDayInput
                group='everyone'
                day='SU'
                editedHours={selectedGym?.openingHoursEveryone}
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
          <div className='flex flex-row gap-2.5'>
            <div className='flex flex-col gap-1'>
              <OpeningHoursDayInput
                group='members'
                day='MO'
                editedHours={selectedGym?.openingHoursMembers}
                setHoursChanged={setHoursChanged}
              />
              <OpeningHoursDayInput
                group='members'
                day='TU'
                editedHours={selectedGym?.openingHoursMembers}
                setHoursChanged={setHoursChanged}
              />
              <OpeningHoursDayInput
                group='members'
                day='WE'
                editedHours={selectedGym?.openingHoursMembers}
                setHoursChanged={setHoursChanged}
              />
              <OpeningHoursDayInput
                group='members'
                day='TH'
                editedHours={selectedGym?.openingHoursMembers}
                setHoursChanged={setHoursChanged}
              />
            </div>
            <div className='flex flex-col justify-center gap-1'>
              <OpeningHoursDayInput
                group='members'
                day='FR'
                editedHours={selectedGym?.openingHoursMembers}
                setHoursChanged={setHoursChanged}
              />
              <OpeningHoursDayInput
                group='members'
                day='SA'
                editedHours={selectedGym?.openingHoursMembers}
                setHoursChanged={setHoursChanged}
              />
              <OpeningHoursDayInput
                group='members'
                day='SU'
                editedHours={selectedGym?.openingHoursMembers}
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
              : <span className='flex w-35'>equipment visible</span>}
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
              : <span className='flex w-35'>memberships visible</span>}
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
              : <span className='flex w-35'>opening hours visible</span>}
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
  );
}
