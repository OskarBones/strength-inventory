import { use, useActionState, useRef, useState } from 'react';

import {
  skipToken, useMutation, useQuery, useQueryClient
} from '@tanstack/react-query';
import { TbEdit, TbPlus } from 'react-icons/tb';

import { AuthContext, IconContext } from '@/utils/contexts';
import { getCity, postCity, putCity }
  from '@/utils/api';
import handleSubmitError from '@/utils/handleSubmitError';

import Error from '@/components/Error';
import Loading from '@/components/Loading';
import Notification from '@/components/Notification';
import ReturnButton from '../ReturnButton';
import SubmitButton from '../SubmitButton';

import { FORM_INPUT_CLASSES } from '@/constants/theme';

import {
  type CityPostAndPut,
  CityPostAndPutSchema,
  LOCATION_MAX_LEN,
  REF_POINT_MAX_LEN
} from '@strength-inventory/schemas';

interface FormProps {
  formMode: string;
  setFormMode: React.Dispatch<React.SetStateAction<string>>;
  selectedCityId: string;
  setSelectedCityId: React.Dispatch<React.SetStateAction<string>>;
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string;
  }>>;
}

export default function Form ({
  formMode,
  setFormMode,
  selectedCityId,
  setSelectedCityId,
  setParentNotification
}: FormProps) {
  const auth = use(AuthContext);
  const iconMode = use(IconContext);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const cityQuery = useQuery({
    queryKey: ['city', selectedCityId],
    queryFn: selectedCityId
      ? () => getCity({ id: selectedCityId })
      : skipToken  // disable this query when creating a new city
  });

  const postMutation = useMutation({
    mutationFn: (newCity: CityPostAndPut) =>
      postCity({
        city: newCity, refresh: auth.refresh, logout: auth.logout
      }),
    onSuccess: async (newCityFromServer) => {
      // await required so that the list's delete button is active afterwards
      await queryClient.invalidateQueries({
        queryKey: ['cities']
      });
      setSelectedCityId(newCityFromServer.id);
      setFormMode('hidden');
      setTimeout(() => {
        setParentNotification({
          type: 'success', message: 'city created'
        });
      }, 150);
    }
  });

  const putMutation = useMutation({
    mutationFn: ({ id, updatedCity }:
    { id: string, updatedCity: CityPostAndPut; }) =>
      putCity({
        id: id, city: updatedCity, refresh: auth.refresh, logout: auth.logout
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['city', selectedCityId]
        }),
        queryClient.invalidateQueries({
          queryKey: ['cities']
        })
      ]);
      setFormMode('hidden');
      setTimeout(() => {
        setParentNotification({
          type: 'success', message: 'changes saved'
        });
      }, 150);
    }
  });

  interface CityProps {
    country: string
    name: string,
    referencePoint: string,
    latitude: string,
    longitude: string,
  }

  const [city, setCity] = useState<CityProps>({
    country: '',
    name: '',
    referencePoint: '',
    latitude: '',
    longitude: ''
  });
  const [originalCity, setOriginalCity] = useState<CityProps>({
    country: '',
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
  const [_state, dispatchAction, isPending] = useActionState(submit, {
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
      const validatedCity = CityPostAndPutSchema.parse(req);

      if (formMode === 'create') {
        try {
          await postMutation.mutateAsync(validatedCity);
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
            id: selectedCityId, updatedCity: validatedCity
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

  if (selectedCityId && cityQuery.isPending) {
    return <Loading />;
  }

  if (selectedCityId && cityQuery.isError) {
    return <Error message={cityQuery.error.message} />;
  }

  /* Initialize the form fields when opened in edit mode.
  selectedCityId is only defined in edit mode. */
  if (selectedCityId && cityQuery.isSuccess && firstRender) {
    const {
      country,
      name,
      referencePoint,
      latitude,
      longitude
    } = cityQuery.data;

    setCity({
      country: country,
      name: name,
      referencePoint: referencePoint,
      latitude: latitude
        ? String(latitude)
        : '',
      longitude: longitude
        ? String(longitude)
        : ''
    });
    setOriginalCity({
      country: country,
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
            : 'create new city'
          : iconMode
            ? (
              <span className='flex gap-1'>
                <TbEdit className='text-2xl' /> {originalCity.name}
              </span>
            )
            : <span>editing {originalCity.name}</span>}
      </h3>

      <div className='flex flex-col gap-3 px-3 pb-3 overflow-y-scroll text-xs'>
        <form
          action={dispatchAction}
          autoComplete='off'
          className='flex flex-col gap-3'
        >
          <div className='flex flex-col gap-1'>
            <div className='flex flex-col'>
              <label htmlFor='country'>country*</label>
              <select
                id='country'
                name='country'
                value={city.country}
                required
                className={`${FORM_INPUT_CLASSES} enabled:cursor-pointer`}
                onChange={(event) => {
                  setCity({ ...city, country: event.target.value });
                  nameInputRef.current?.focus();
                }}
              >
                <option value=''>-- please select a country</option>
                <option value='DEN'>Denmark</option>
                <option value='FIN'>Finland</option>
                <option value='ICE'>Iceland</option>
                <option value='NOR'>Norway</option>
                <option value='SWE'>Sweden</option>
              </select>
            </div>

            <div className='flex flex-col'>
              <label htmlFor='name'>name*</label>
              <input
                id='name'
                name='name'
                ref={nameInputRef}
                type='text'
                value={city.name}
                required
                maxLength={LOCATION_MAX_LEN}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setCity({ ...city, name: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='referencePoint'>reference point*</label>
              <input
                id='referencePoint'
                name='referencePoint'
                type='text'
                value={city.referencePoint}
                required
                maxLength={REF_POINT_MAX_LEN}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setCity({ ...city, referencePoint: event.target.value });
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
                  value={city.latitude}
                  placeholder='D.DDDDD'
                  required
                  min={-90}
                  max={90}
                  step={0.00001}
                  className={`${FORM_INPUT_CLASSES} w-20`}
                  onChange={(event) => {
                    setCity({ ...city, latitude: event.target.value });
                  }}
                />
              </div>

              <div className='flex flex-col'>
                <label htmlFor='longitude'>longitude*</label>
                <input
                  id='longitude'
                  name='longitude'
                  type='number'
                  value={city.longitude}
                  placeholder='D.DDDDD'
                  required
                  min={-180}
                  max={180}
                  step={0.00001}
                  className={`${FORM_INPUT_CLASSES} w-22`}
                  onChange={(event) => {
                    setCity({ ...city, longitude: event.target.value });
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
            [['city', selectedCityId], ['cities']]
          }
          setFormMode={setFormMode}
          unsavedChanges={
            JSON.stringify(city) !== JSON.stringify(originalCity)
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
