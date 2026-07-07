import { use, useActionState, useState } from 'react';

import {
  skipToken, useMutation, useQuery, useQueryClient
} from '@tanstack/react-query';
import { TbEdit, TbPlus } from 'react-icons/tb';

import { AuthContext, IconContext } from '../../../../utils/contexts';
import { getCities, getDistrict, postDistrict, putDistrict }
  from '../../../../utils/api';
import handleSubmitError from '../../../../utils/handleSubmitError';

import Notification from '../../../Notification';
import ReturnButton from '../ReturnButton';
import SubmitButton from '../SubmitButton';

import { FORM_INPUT_CLASSES } from '../../../../constants/theme';

import {
  type DistrictPostAndPut,
  DistrictPostAndPutSchema,
  LOCATION_MAX_LEN,
  REF_POINT_MAX_LEN
} from '@strength-inventory/schemas';

interface FormProps {
  formMode: string;
  setFormMode: React.Dispatch<React.SetStateAction<string>>;
  selectedDistrictId: string;
  setSelectedDistrictId: React.Dispatch<React.SetStateAction<string>>;
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string;
  }>>;
}

export default function Form ({
  formMode,
  setFormMode,
  selectedDistrictId,
  setSelectedDistrictId,
  setParentNotification
}: FormProps) {
  const auth = use(AuthContext);
  const iconMode = use(IconContext);

  const queryClient = useQueryClient();

  const districtQuery = useQuery({
    queryKey: ['district', selectedDistrictId],
    queryFn: selectedDistrictId
      ? () => getDistrict({ id: selectedDistrictId })
      : skipToken  // disable this query when creating a new district
  });

  const cityQuery = useQuery({
    queryKey: ['cities'],
    queryFn: () => getCities()
  });

  const postMutation = useMutation({
    mutationFn: (newDistrict: DistrictPostAndPut) =>
      postDistrict({
        district: newDistrict, refresh: auth.refresh, logout: auth.logout
      }),
    onSuccess: (newDistrictFromServer) => {
      void queryClient.invalidateQueries({
        queryKey: ['districts']
      });
      void queryClient.invalidateQueries({
        queryKey: ['cities']
      });
      setSelectedDistrictId(newDistrictFromServer.id);
      setFormMode('hidden');
      setTimeout(() => {
        setParentNotification({
          type: 'success', message: 'district created'
        });
      }, 150);
    }
  });

  const putMutation = useMutation({
    mutationFn: ({ id, updatedDistrict }:
    { id: string, updatedDistrict: DistrictPostAndPut; }) =>
      putDistrict({
        id: id,
        district: updatedDistrict,
        refresh: auth.refresh,
        logout: auth.logout
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['district', selectedDistrictId]
      });
      void queryClient.invalidateQueries({
        queryKey: ['districts']
      });
      void queryClient.invalidateQueries({
        queryKey: ['cities']
      });
      setFormMode('hidden');
      setTimeout(() => {
        setParentNotification({
          type: 'success', message: 'changes saved'
        });
      }, 150);
    }
  });

  interface DistrictProps {
    cityId: string
    name: string,
    referencePoint: string,
    latitude: string,
    longitude: string,
  }

  const [district, setDistrict] = useState<DistrictProps>({
    cityId: '',
    name: '',
    referencePoint: '',
    latitude: '',
    longitude: ''
  });
  const [originalDistrict, setOriginalDistrict] = useState<DistrictProps>({
    cityId: '',
    name: '',
    referencePoint: '',
    latitude: '',
    longitude: ''
  });

  const [firstRender, setFirstRender] = useState(true);

  const [notification, setNotification] = useState({
    type: '',
    message: ''
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_state, submitAction, isPending] = useActionState(submit, {
    success: true,
    error: null
  });

  interface State {
    success: boolean;
    error: string | null;
  }

  async function submit (_previousState: State, formData: FormData) {
    const req = Object.fromEntries(formData.entries());

    try {
      const validatedDistrict = DistrictPostAndPutSchema.parse(req);

      if (formMode === 'create') {
        try {
          await postMutation.mutateAsync(validatedDistrict);
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
            id: selectedDistrictId, updatedDistrict: validatedDistrict
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

  if ((selectedDistrictId && districtQuery.isPending) || cityQuery.isPending) {
    return <p>Loading...</p>;
  }

  if ((selectedDistrictId && districtQuery.isError)) {
    return <p>Error: {districtQuery.error.message}</p>;
  }

  if (cityQuery.isError) {
    return <p>Error: {cityQuery.error.message}</p>;
  }

  /* Initialize the form fields when opened in edit mode.
  selectedDistrictId is only defined in edit mode. */
  if (selectedDistrictId && districtQuery.isSuccess && firstRender) {
    const {
      cityId,
      name,
      referencePoint,
      latitude,
      longitude
    } = districtQuery.data;

    setDistrict({
      cityId: cityId,
      name: name,
      referencePoint: referencePoint,
      latitude: latitude
        ? String(latitude)
        : '',
      longitude: longitude
        ? String(longitude)
        : ''
    });
    setOriginalDistrict({
      cityId: cityId,
      name: name,
      referencePoint: referencePoint,
      latitude: latitude
        ? String(latitude)
        : '',
      longitude: longitude
        ? String(longitude)
        : ''
    });

    setFirstRender(false);
  }

  return (
    <div className='flex flex-col min-h-0 overflow-y-scroll'>
      <h3 className='flex self-center text-base'>
        {/* formMode is either 'create' or 'edit' */}
        {formMode === 'create'
          ? iconMode
            ? <TbPlus className='text-2xl' />
            : 'create new district'
          : iconMode
            ? (
              <span className='flex gap-1'>
                <TbEdit className='text-2xl' /> {originalDistrict.name}
              </span>
            )
            : <span>editing {originalDistrict.name}</span>}
      </h3>

      <div className='flex flex-col gap-3 px-3 pb-3 overflow-y-scroll text-xs'>
        <form
          action={submitAction}
          autoComplete='off'
          className='flex flex-col gap-3'
        >
          <div className='flex flex-col gap-1'>
            <div className='flex flex-col'>
              <label htmlFor='cityId'>city*</label>
              <select
                id='cityId'
                name='cityId'
                value={district.cityId}
                required
                className={`${FORM_INPUT_CLASSES} enabled:cursor-pointer`}
                onChange={(event) => {
                  setDistrict({ ...district, cityId: event.target.value });
                }}
              >
                <option value=''>-- please select a city --</option>
                {cityQuery.data.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name} ({city.country})
                  </option>
                ))}
              </select>
            </div>

            <div className='flex flex-col'>
              <label htmlFor='name'>name*</label>
              <input
                id='name'
                name='name'
                type='text'
                value={district.name}
                required
                maxLength={LOCATION_MAX_LEN}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setDistrict({ ...district, name: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='referencePoint'>reference point*</label>
              <input
                id='referencePoint'
                name='referencePoint'
                type='text'
                value={district.referencePoint}
                required
                maxLength={REF_POINT_MAX_LEN}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setDistrict({
                    ...district, referencePoint: event.target.value
                  });
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
                  value={district.latitude}
                  placeholder='D.DDDDD'
                  required
                  min={-90}
                  max={90}
                  step={0.00001}
                  className={`${FORM_INPUT_CLASSES} w-20`}
                  onChange={(event) => {
                    setDistrict({ ...district, latitude: event.target.value });
                  }}
                />
              </div>

              <div className='flex flex-col'>
                <label htmlFor='longitude'>longitude*</label>
                <input
                  id='longitude'
                  name='longitude'
                  type='number'
                  value={district.longitude}
                  placeholder='D.DDDDD'
                  required
                  min={-180}
                  max={180}
                  step={0.00001}
                  className={`${FORM_INPUT_CLASSES} w-22`}
                  onChange={(event) => {
                    setDistrict({ ...district, longitude: event.target.value });
                  }}
                />
              </div>
            </div>

            <p>* = required</p>

            <SubmitButton formMode={formMode} isPending={isPending} />
          </div>
        </form>

        <ReturnButton
          queriesToInvalidate={
            [['district', selectedDistrictId], ['districts']]
          }
          setFormMode={setFormMode}
          unsavedChanges={
            JSON.stringify(district) !== JSON.stringify(originalDistrict)
          }
        />
      </div>

      <Notification
        type={notification.type}
        message={notification.message}
        setNotification={setNotification}
      />
    </div>
  );
}
