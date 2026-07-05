import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getGyms } from '../../../utils/api';

import Filters from './Filters';
import Gym from './Gym';

import type { CityGet, DistrictGet, GymGet } from '@strength-inventory/schemas';

export default function Gyms () {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['gyms'],
    queryFn: () => getGyms()
  });

  const [selectedCity, setSelectedCity] = useState<CityGet | null>(null);
  const [selectedDistrict, setSelectedDistrict]
    = useState<DistrictGet | null>(null);

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message} </p>;
  }

  let filteredGyms: GymGet[] = [];
  if (selectedCity) {
    filteredGyms = data.filter((gym) => gym.city === selectedCity.name);
  }

  if (selectedDistrict) {
    console.log('sort around district ref point');
  } else {
    console.log('sort around city ref point');
  }

  return (
    <div
      className='
        flex flex-col gap-3 self-center p-3 md:px-27 mx-auto
        w-full min-w-90 md:min-w-135 max-w-250'
    >
      <Filters
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
      />

      {selectedCity
        ? (
          filteredGyms.length > 0
            ? (
              <ol className='flex flex-col gap-3'>
                {filteredGyms.map((gym) =>
                  <li key={gym.id}><Gym gym={gym} /></li>)}
              </ol>
            )
            : <p>the selected city has no gyms</p>
        )
        : null}
    </div>
  );
}
