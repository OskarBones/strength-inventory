import { http, HttpResponse } from 'msw/http';

import { baseUrl } from '@/utils/api';

import { exampleCity } from '@strength-inventory/test-utils';

export const handlers = [
  http.get(`${baseUrl}/cities/${exampleCity.id}`, () => {
    return HttpResponse.json(exampleCity);
  })
];
