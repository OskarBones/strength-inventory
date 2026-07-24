import { use, useActionState, useRef, useState } from 'react';

import {
  skipToken, useMutation, useQuery, useQueryClient
} from '@tanstack/react-query';
import { TbEdit, TbPlus } from 'react-icons/tb';
import { z } from 'zod';

import { AuthContext, IconContext } from '../../../../../utils/contexts';
import { getPiece, postEquipment, putEquipment }
  from '../../../../../utils/api';
import handleSubmitError from '../../../../../utils/handleSubmitError';

import AvailableWeights from './AvailableWeights';
import Error from '../../../../Error';
import Loading from '../../../../Loading';
import Notification from '../../../../Notification';
import ReturnButton from '../../ReturnButton';
import SubmitButton from '../../SubmitButton';

import { FORM_INPUT_CLASSES } from '../../../../../constants/theme';

import {
  ACCESSORIES_AND_TOOLS,
  BARS_AND_PLATES,
  CARDIO,
  type EquipmentPostAndPut,
  EquipmentPostAndPutSchema,
  FREE_WEIGHTS,
  HANDLE_ATTACHMENTS,
  MAX_WEIGHT,
  STRENGTH_MACHINES,
  SYSTEMS
} from '@strength-inventory/schemas';

interface FormProps {
  formMode: string
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  selectedPieceId: string
  setSelectedPieceId: React.Dispatch<React.SetStateAction<string>>
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string
  }>>
}

export default function Form ({
  formMode,
  setFormMode,
  selectedPieceId,
  setSelectedPieceId,
  setParentNotification
}: FormProps) {
  const auth = use(AuthContext);
  const iconMode = use(IconContext);

  const manufacturerInputRef = useRef<HTMLInputElement>(null);
  const weightInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const pieceQuery = useQuery({
    queryKey: ['piece', selectedPieceId],
    queryFn: selectedPieceId
      ? () => getPiece({ id: selectedPieceId })
      : skipToken  // disable this query when creating a new piece
  });

  const postMutation = useMutation({
    mutationFn: (newPiece: EquipmentPostAndPut) =>
      postEquipment({
        piece: newPiece, refresh: auth.refresh, logout: auth.logout
      }),
    onSuccess: (newPieceFromServer) => {
      void queryClient.invalidateQueries({
        queryKey: ['equipment']
      });
      setSelectedPieceId(newPieceFromServer.id);
      setFormMode('hidden');
      setTimeout(() => {
        setParentNotification({
          type: 'success', message: 'piece created'
        });
      }, 150);
    }
  });

  const putMutation = useMutation({
    mutationFn: ({ id, updatedPiece }:
    { id: string, updatedPiece: EquipmentPostAndPut }) =>
      putEquipment({
        id: id, piece: updatedPiece, refresh: auth.refresh, logout: auth.logout
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['piece', selectedPieceId]
      });
      void queryClient.invalidateQueries({
        queryKey: ['equipment']
      });
      setFormMode('hidden');
      setTimeout(() => {
        setParentNotification({
          type: 'success', message: 'changes saved'
        });
      }, 150);
    }
  });

  interface PieceProps {
    name: string,
    category: string,
    subcategory: string,
    manufacturer: string,
    code: string,
    weightUnit: string,
    weight: string,
    startingWeight: string,
    maximumWeight: string,
    maximumWeightType: string,
    outOfProduction: boolean,
    url: string,
    notes: string
  }

  const [piece, setPiece] = useState<PieceProps>({
    name: '',
    category: '',
    subcategory: '',
    manufacturer: '',
    code: '',
    weightUnit: '',
    weight: '',
    startingWeight: '',
    maximumWeight: '',
    maximumWeightType: 'load',
    outOfProduction: false,
    url: '',
    notes: ''
  });
  const [originalPiece, setOriginalPiece] = useState<PieceProps>({
    name: '',
    category: '',
    subcategory: '',
    manufacturer: '',
    code: '',
    weightUnit: '',
    weight: '',
    startingWeight: '',
    maximumWeight: '',
    maximumWeightType: 'load',
    outOfProduction: false,
    url: '',
    notes: ''
  });

  let subcategoryOptions: string[];

  if (piece.category === 'system') {
    subcategoryOptions = SYSTEMS;
  } else if (piece.category === 'barOrPlate') {
    subcategoryOptions = BARS_AND_PLATES;
  } else if (piece.category === 'handleAttachment') {
    subcategoryOptions = HANDLE_ATTACHMENTS;
  } else if (piece.category === 'freeWeight') {
    subcategoryOptions = FREE_WEIGHTS;
  } else if (piece.category === 'strengthMachine') {
    subcategoryOptions = STRENGTH_MACHINES;
  } else if (piece.category === 'accessoryOrTool') {
    subcategoryOptions = ACCESSORIES_AND_TOOLS;
  } else if (piece.category === 'cardio') {
    subcategoryOptions = CARDIO;
  } else {
    subcategoryOptions = [];
  }

  /* Available weights are visually part of the form,
  but logically they have their separate state which is merged
  with the form data in submit() */
  const [availableWeights, setAvailableWeights] = useState<number[]>([]);
  const [firstRender, setFirstRender] = useState(true);
  const [unknownManufacturer, setUnknownManufacturer] = useState(false);
  const [unknownCode, setUnknownCode] = useState(false);

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
    success: boolean
    error: string | null
  }

  async function submit (_previousState: State, formData: FormData) {
    const req = Object.fromEntries(formData.entries());

    try {
      const preprocessWeightUnit = z.preprocess((val) => {
        if (val === '') {
          return null;
        } else {
          return val;
        }
      }, z.string().min(1)
        .nullable());
      const preprocessOutOfProduction = z.preprocess((val) => {
        if (val) {
          return true;
        } else {
          return false;
        }
      }, z.boolean());
      const preprocessedWeightUnit = preprocessWeightUnit.parse(req.weightUnit);
      const preprocessedOutOfProduction
        = preprocessOutOfProduction.parse(req.outOfProduction);
      const piece = {
        ...req,
        weightUnit: preprocessedWeightUnit,
        availableWeights: availableWeights,
        outOfProduction: preprocessedOutOfProduction
      };
      const validatedPiece = EquipmentPostAndPutSchema.parse(piece);

      if (formMode === 'create') {
        try {
          await postMutation.mutateAsync(validatedPiece);
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
            id: selectedPieceId, updatedPiece: validatedPiece
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

  if (selectedPieceId && pieceQuery.isPending) {
    return <Loading />;
  }

  if (selectedPieceId && pieceQuery.isError) {
    return <Error message={pieceQuery.error.message} />;
  }

  /* Initialize the form fields when opened in edit mode.
  selectedPieceId is only defined in edit mode. */
  if (selectedPieceId && pieceQuery.isSuccess && firstRender) {
    const {
      name,
      category,
      subcategory,
      manufacturer,
      code,
      weightUnit,
      weight,
      startingWeight,
      availableWeights,
      maximumWeight,
      maximumWeightType,
      outOfProduction,
      url,
      notes
    } = pieceQuery.data;

    setPiece({
      name: name,
      category: category,
      subcategory: subcategory,
      manufacturer: manufacturer,
      code: code,
      weightUnit: weightUnit ?? '',
      weight: weight
        ? String(weight)
        : '',
      startingWeight: startingWeight
        ? String(startingWeight)
        : '',
      maximumWeight: maximumWeight
        ? String(maximumWeight)
        : '',
      maximumWeightType: maximumWeightType,
      outOfProduction: outOfProduction,
      url: url ?? '',
      notes: notes
    });
    setOriginalPiece({
      name: name,
      category: category,
      subcategory: subcategory,
      manufacturer: manufacturer,
      code: code,
      weightUnit: weightUnit ?? '',
      weight: weight
        ? String(weight)
        : '',
      startingWeight: startingWeight
        ? String(startingWeight)
        : '',
      maximumWeight: maximumWeight
        ? String(maximumWeight)
        : '',
      maximumWeightType: maximumWeightType,
      outOfProduction: outOfProduction,
      url: url ?? '',
      notes: notes
    });
    setAvailableWeights(availableWeights);
    setUnknownManufacturer(manufacturer === 'unknown');
    setUnknownCode(code === 'unknown');

    setFirstRender(false);
  }

  return (
    <div className='flex flex-col min-h-0 overflow-y-scroll'>
      <h3 className='flex self-center text-base'>
        {/* formMode is either 'create' or 'edit' */}
        {formMode === 'create'
          ? iconMode
            ? <TbPlus className='text-2xl' />
            : 'create new equipment'
          : iconMode
            ? (
              <span className='flex gap-1'>
                <TbEdit className='text-2xl' /> {originalPiece.name}
              </span>
            )
            : <span>editing {originalPiece.name}</span>}
      </h3>

      <div className='flex flex-col gap-3 px-3 pb-3 overflow-y-scroll text-xs'>
        <form
          action={submitAction}
          autoComplete='off'
          className='flex flex-col gap-3'
        >
          <div className='flex flex-col gap-1'>
            <div className='flex gap-3'>
              <div className='flex flex-1 flex-col'>
                <label htmlFor='name'>name*</label>
                <input
                  id='name'
                  name='name'
                  type='text'
                  value={piece.name}
                  required
                  autoFocus={formMode === 'create'}
                  className={FORM_INPUT_CLASSES}
                  onChange={(event) => {
                    setPiece({ ...piece, name: event.target.value });
                  }}
                />
              </div>

              <div className='flex items-end gap-1'>
                <label htmlFor='outOfProduction'>out of production</label>
                <input
                  id='outOfProduction'
                  name='outOfProduction'
                  type='checkbox'
                  value='outOfProduction'
                  checked={piece.outOfProduction}
                  onChange={() => {
                    setPiece({
                      ...piece, outOfProduction: !piece.outOfProduction
                    });
                  }}
                />
              </div>
            </div>

            <div className='flex flex-col'>
              <label htmlFor='category'>category*</label>
              <select
                id='category'
                name='category'
                value={piece.category}
                required
                className={`${FORM_INPUT_CLASSES} cursor-pointer`}
                onChange={(event) => {
                  setPiece({ ...piece, category: event.target.value });
                }}
              >
                <option value=''>-- please select a category --</option>
                <option value='system'>system</option>
                <option value='barOrPlate'>bar or plate</option>
                <option value='freeWeight'>free weight</option>
                <option value='handleAttachment'>handle attachment</option>
                <option value='strengthMachine'>strength machine</option>
                <option value='cardio'>cardio</option>
                <option value='accessoryOrTool'>accessory or tool</option>
              </select>
            </div>

            <div className='flex flex-col'>
              <label htmlFor='subcategory'>subcategory*</label>
              <select
                id='subcategory'
                name='subcategory'
                value={piece.subcategory}
                disabled={piece.category === ''}
                required
                className={`${FORM_INPUT_CLASSES} enabled:cursor-pointer`}
                onChange={(event) => {
                  setPiece({ ...piece, subcategory: event.target.value });
                  if (!unknownManufacturer) {
                    manufacturerInputRef.current?.focus();
                  }
                }}
              >
                <option value=''>-- please select a subcategory --</option>
                {subcategoryOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className='flex gap-3'>
              <div className='flex flex-1 flex-col'>
                <label htmlFor='manufacturer'>manufacturer*</label>
                <input
                  id='manufacturer'
                  name='manufacturer'
                  ref={manufacturerInputRef}
                  type='text'
                  value={piece.manufacturer}
                  readOnly={piece.manufacturer === 'unknown'}
                  required
                  className={`
                    ${FORM_INPUT_CLASSES}
                    read-only:bg-secondary dark:read-only:bg-secondary-dark`}
                  onChange={(event) => {
                    setPiece({ ...piece, manufacturer: event.target.value });
                  }}
                />
              </div>

              <div className='flex items-end gap-1'>
                <label htmlFor='unknownManufacturer'>unknown</label>
                <input
                  id='unknownManufacturer'
                  name='unknownManufacturer'
                  type='checkbox'
                  value='unknownManufacturer'
                  checked={piece.manufacturer === 'unknown'}
                  onChange={() => {
                    setUnknownManufacturer(!unknownManufacturer);
                    if (!unknownManufacturer) {
                      setPiece({
                        ...piece, manufacturer: 'unknown'
                      });
                    } else {
                      if (originalPiece.manufacturer === 'unknown') {
                        setPiece({
                          ...piece, manufacturer: ''
                        });
                      } else {
                        setPiece({
                          ...piece, manufacturer: originalPiece.manufacturer
                        });
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className='flex gap-3'>
              <div className='flex flex-1 flex-col'>
                <label htmlFor='code'>code*</label>
                <input
                  id='code'
                  name='code'
                  type='text'
                  value={piece.code}
                  readOnly={piece.code === 'unknown'}
                  required
                  className={`
                    ${FORM_INPUT_CLASSES}
                    read-only:bg-secondary dark:read-only:bg-secondary-dark`}
                  onChange={(event) => {
                    setPiece({ ...piece, code: event.target.value });
                  }}
                />
              </div>

              <div className='flex items-end gap-1'>
                <label htmlFor='unknownCode'>unknown</label>
                <input
                  id='unknownCode'
                  name='unknownCode'
                  type='checkbox'
                  value='unknownCode'
                  checked={piece.code === 'unknown'}
                  onChange={() => {
                    setUnknownCode(!unknownCode);
                    if (!unknownCode) {
                      setPiece({
                        ...piece, code: 'unknown'
                      });
                    } else {
                      if (originalPiece.code === 'unknown') {
                        setPiece({
                          ...piece, code: ''
                        });
                      } else {
                        setPiece({
                          ...piece, code: originalPiece.code
                        });
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className='flex flex-col'>
              <label htmlFor='weightUnit'>weight unit</label>
              <select
                id='weightUnit'
                name='weightUnit'
                value={piece.weightUnit}
                className={`${FORM_INPUT_CLASSES} cursor-pointer`}
                onChange={(event) => {
                  setPiece({ ...piece, weightUnit: event.target.value });
                  weightInputRef.current?.focus();
                }}
              >
                <option value=''>-- weight unit for values below --</option>
                <option value='kg'>kilograms</option>
                <option value='lbs'>pounds</option>
              </select>
            </div>

            <div className='flex flex-col'>
              <label htmlFor='weight'>weight</label>
              <input
                id='weight'
                name='weight'
                ref={weightInputRef}
                type='number'
                value={piece.weight}
                min={0.01}
                max={MAX_WEIGHT}
                step={0.01}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setPiece({ ...piece, weight: event.target.value });
                }}
              />
            </div>

            <AvailableWeights
              availableWeights={availableWeights}
              setAvailableWeights={setAvailableWeights}
              startingWeight={piece.startingWeight}
              maximumWeight={piece.maximumWeight}
            />

            <div className='flex flex-col'>
              <label htmlFor='startingWeight'>starting weight</label>
              <input
                id='startingWeight'
                name='startingWeight'
                type='number'
                value={piece.startingWeight}
                min={0.01}
                max={piece.maximumWeight
                  ? piece.maximumWeight
                  : MAX_WEIGHT}
                step={0.01}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setPiece({ ...piece, startingWeight: event.target.value });
                }}
              />
            </div>

            <div className='flex gap-3'>
              <div className='flex flex-1 flex-col'>
                <label htmlFor='maximumWeight'>maximum weight</label>
                <input
                  id='maximumWeight'
                  name='maximumWeight'
                  type='number'
                  value={piece.maximumWeight}
                  min={piece.startingWeight
                    ? piece.startingWeight
                    : 0.01}
                  max={MAX_WEIGHT}
                  step={0.01}
                  className={FORM_INPUT_CLASSES}
                  onChange={(event) => {
                    setPiece({ ...piece, maximumWeight: event.target.value });
                  }}
                />
              </div>

              <div className='flex flex-col'>
                <label htmlFor='maximumWeightType'>maximum weight type</label>
                <select
                  id='maximumWeightType'
                  name='maximumWeightType'
                  value={piece.maximumWeightType}
                  className={`${FORM_INPUT_CLASSES} cursor-pointer`}
                  onChange={(event) => {
                    setPiece({
                      ...piece, maximumWeightType: event.target.value
                    });
                  }}
                >
                  <option value='load'>load</option>
                  <option value='weight'>weight</option>
                </select>
              </div>
            </div>

            <div className='flex flex-col'>
              <label htmlFor='url'>url</label>
              <input
                id='url'
                name='url'
                type='url'
                value={piece.url}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setPiece({ ...piece, url: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='notes'>notes</label>
              <textarea
                id='notes'
                name='notes'
                value={piece.notes}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setPiece({ ...piece, notes: event.target.value });
                }}
              />
            </div>

            <p>* = required</p>

            <SubmitButton formMode={formMode} isPending={isPending} />
          </div>
        </form>

        <ReturnButton
          queriesToInvalidate={
            [['piece', selectedPieceId], ['equipmentIdAndName']]
          }
          setFormMode={setFormMode}
          unsavedChanges={
            JSON.stringify(piece) !== JSON.stringify(originalPiece)
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
