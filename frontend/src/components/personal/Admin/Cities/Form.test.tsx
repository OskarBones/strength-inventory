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

  return { ...originalApiModule, postCity: vi.fn(), putCity: vi.fn() };
});

describe('Admin form for City', () => {
  describe('in create mode', () => {
    beforeEach(async () => {
      render(
        <Form
          formMode='create'
          setFormMode={vi.fn()}
          selectedCityId=''
          setSelectedCityId={vi.fn()}
        />
      );

      await screen.findByRole('heading');
    });

    test('displays', () => {
      expect(screen.getByRole('heading')).toHaveTextContent('create new city');
    });

    test('sends a POST when inputs are valid', async () => {
      const user = userEvent.setup();

      const visibleButton = screen
        .getByRole('button', { name: 'hidden (click to switch)' });
      await user.click(visibleButton);
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
      const submitButton = screen.getByRole('button', { name: 'create' });
      await user.click(submitButton);

      expect(api.postCity).toHaveBeenCalledWith(
        /* The component automatically calls postCity with
        auth.refresh and auth.logout as two additional and required arguments.
        Since those two cannot be imported from within AuthProvider,
        this test only checks the argument containing the input values. */
        expect.objectContaining(
          {
            city: {
              visible: exampleCity.visible,
              name: exampleCity.name,
              referencePoint: exampleCity.referencePoint,
              latitude: exampleCity.latitude,
              longitude: exampleCity.longitude,
              country: exampleCity.country
            }
          }
        )
      );
    });

    test(
      'does not send a POST when a required field (name) is empty',
      async () => {
        const user = userEvent.setup();

        const visibleButton = screen
          .getByRole('button', { name: 'hidden (click to switch)' });
        await user.click(visibleButton);
        const countryInput = screen.getByLabelText('country*');
        await user.selectOptions(countryInput, exampleCity.country);
        // nameInput left empty
        const referencePointInput = screen.getByLabelText('reference point*');
        await user.type(referencePointInput, exampleCity.referencePoint);
        const latitudeInput = screen.getByLabelText('latitude*');
        await user.type(latitudeInput, exampleCity.latitude.toString());
        const longitudeInput = screen.getByLabelText('longitude*');
        await user.type(longitudeInput, exampleCity.longitude.toString());
        const submitButton = screen.getByRole('button', { name: 'create' });
        await user.click(submitButton);

        expect(api.postCity).toHaveBeenCalledTimes(0);
      }
    );
  });

  describe('in edit mode', () => {
    beforeEach(async () => {
      render(
        <Form
          formMode='edit'
          setFormMode={vi.fn()}
          selectedCityId={exampleCity.id}
          setSelectedCityId={vi.fn()}
        />
      );

      await screen.findByRole('heading');
    });

    test('displays', () => {
      expect(screen.getByRole('heading'))
        .toHaveTextContent(`editing ${exampleCity.name}`);
    });

    test('sends a PUT when inputs are valid', async () => {
      const user = userEvent.setup();

      const referencePointInput = screen.getByLabelText('reference point*');
      await user.clear(referencePointInput);
      await user.type(referencePointInput, 'Senaatintori');
      const latitudeInput = screen.getByLabelText('latitude*');
      await user.clear(latitudeInput);
      await user.type(latitudeInput, '60.16950');
      const longitudeInput = screen.getByLabelText('longitude*');
      await user.clear(longitudeInput);
      await user.type(longitudeInput, '24.95216');
      const submitButton = screen.getByRole('button', { name: 'save' });
      await user.click(submitButton);

      expect(api.putCity).toHaveBeenCalledWith(
        expect.objectContaining(
          {
            id: exampleCity.id,
            city: {
              visible: exampleCity.visible,
              name: exampleCity.name,
              referencePoint: 'Senaatintori',
              latitude: 60.16950,
              longitude: 24.95216,
              country: exampleCity.country
            }
          }
        )
      );
    });

    test(
      'does not send a PUT when a required field (latitude) is empty',
      async () => {
        const user = userEvent.setup();

        const latitudeInput = screen.getByLabelText('latitude*');
        await user.clear(latitudeInput);
        const submitButton = screen.getByRole('button', { name: 'save' });
        await user.click(submitButton);

        expect(api.postCity).toHaveBeenCalledTimes(0);
      }
    );
  });
});
