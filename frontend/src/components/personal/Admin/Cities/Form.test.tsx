import '@testing-library/jest-dom';
import { render, screen } from '@/utils/tests/test-utils';
import { vi } from 'vitest';

import Form from './Form';

import { exampleCity } from '@strength-inventory/test-utils';

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
