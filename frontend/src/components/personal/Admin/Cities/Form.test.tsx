import '@testing-library/jest-dom';
import { render, screen } from '@/utils/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import * as api from '@/utils/api';

import Form from './Form';

import { exampleCity } from '@strength-inventory/test-utils';

beforeEach(() => {
  vi.clearAllMocks();
});

vi.mock('@/utils/api', async () => {
  const originalApiModule = await vi.importActual('@/utils/api');

  return { ...originalApiModule, postCity: vi.fn() };
});

test('displays form for creating a new city', () => {
  render(
    <Form
      formMode='create'
      setFormMode={vi.fn()}
      selectedCityId=''
      setSelectedCityId={vi.fn()}
    />
  );

  expect(screen.getByRole('heading')).toHaveTextContent('create new city');
});

test('displays form for editing a city', async () => {
  render(
    <Form
      formMode='edit'
      setFormMode={vi.fn()}
      selectedCityId={exampleCity.id}
      setSelectedCityId={vi.fn()}
    />
  );

  await screen.findByRole('heading');

  expect(screen.getByRole('heading'))
    .toHaveTextContent(`editing ${exampleCity.name}`);
});

test('sends a POST request with valid inputs in create mode', async () => {
  const user = userEvent.setup();

  render(
    <Form
      formMode='create'
      setFormMode={vi.fn()}
      selectedCityId=''
      setSelectedCityId={vi.fn()}
    />
  );

  expect(screen.getByRole('heading')).toHaveTextContent('create new city');

  const countryInput = screen.getByLabelText('country*');
  await user.selectOptions(countryInput, exampleCity.country);
  const nameInput = screen.getByLabelText('name*');
  await user.type(nameInput, exampleCity.name);
  const referencePointInput = screen.getByLabelText('reference point*');
  await user.type(referencePointInput, exampleCity.referencePoint);
  const latitudeInput = screen.getByLabelText('latitude*');
  await user.type(latitudeInput, exampleCity.latitude.toString());
  const longitudeInput = screen.getByLabelText('longitude*');
  await user.type(longitudeInput, exampleCity.longitude.toString());
  const submitButton = screen.getByText('create');
  await user.click(submitButton);

  expect(api.postCity).toHaveBeenCalledWith(
    /* The component automatically calls postCity with
    auth.refresh and auth.logout as two additional and required arguments.
    Since those two cannot be imported from within AuthProvider,
    this test only checks the argument containing the input values. */
    expect.objectContaining(
      {
        city: {
          country: exampleCity.country,
          name: exampleCity.name,
          referencePoint: exampleCity.referencePoint,
          latitude: exampleCity.latitude,
          longitude: exampleCity.longitude
        }
      }
    )
  );
});
