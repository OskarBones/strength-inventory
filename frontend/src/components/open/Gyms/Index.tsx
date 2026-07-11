import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getGyms } from '../../../utils/api';

import Filters from './Filters';
import Gym from './Gym';

import type { CityGet, DistrictGet, GymWithDistance }
  from '@strength-inventory/schemas';

export default function Gyms () {
  function deg2rad (deg: number) {
    return deg * (Math.PI / 180);
  }

  interface calcDistanceInKmProps {
    lat1: number
    lon1: number
    lat2: number
    lon2: number
  }

  // reference [3]
  function calcDistanceInKm ({ lat1, lon1, lat2, lon2 }:
  calcDistanceInKmProps) {
    const R = 6371; // radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad above
    const dLon = deg2rad(lon2 - lon1);
    const a
      = (Math.sin(dLat / 2) * Math.sin(dLat / 2))
        + (Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
          * Math.sin(dLon / 2) * Math.sin(dLon / 2));
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return Number(d.toFixed(1));
  }

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

  const filteredGyms = data.filter((gym) => gym.city === selectedCity?.name);

  let gymsWithDistance: GymWithDistance[] = [];
  if (selectedDistrict) {
    gymsWithDistance = filteredGyms.map((gym) => {
      return {
        ...gym,
        distance: calcDistanceInKm({
          lat1: gym.latitude,
          lon1: gym.longitude,
          lat2: selectedDistrict.latitude,
          lon2: selectedDistrict.longitude
        }),
        referencePoint: selectedDistrict.referencePoint
      };
    });
  } else if (selectedCity) {
    gymsWithDistance = filteredGyms.map((gym) => {
      return {
        ...gym,
        distance: calcDistanceInKm({
          lat1: gym.latitude,
          lon1: gym.longitude,
          lat2: selectedCity.latitude,
          lon2: selectedCity.longitude
        }),
        referencePoint: selectedCity.referencePoint
      };
    });
  }

  gymsWithDistance.sort((a, b) => (a.distance > b.distance
    ? 1
    : -1));

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
              <div className='flex flex-col gap-3'>
                <p className='self-center text-sm'>
                  {filteredGyms.length > 1
                    ? `${selectedCity.name} has
                    ${String(filteredGyms.length)} gyms in the database`
                    : `${selectedCity.name} has 1 gym in the database`}
                </p>
                <ol className='flex flex-col gap-3'>
                  {gymsWithDistance.map((gym) =>
                    <li key={gym.id}><Gym gym={gym} /></li>)}
                </ol>
              </div>
            )
            : <p>the selected city has no gyms</p>
        )
        : null}
    </div>
  );
}
