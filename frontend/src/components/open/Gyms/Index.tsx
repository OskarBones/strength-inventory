import { useState } from 'react';

import { BsInfoCircle } from 'react-icons/bs';
import { useQuery } from '@tanstack/react-query';

import { getCities, getDistricts, getGyms } from '../../../utils/api';
import calcDistanceInKm from '@/utils/calcDistanceInKm';

import Error from '@/components/Error';
import Filters from './Filters';
import Gym from './Gym';
import Loading from '@/components/Loading';

import type { CityGet, DistrictGet, GymWithDistance }
  from '@strength-inventory/schemas';

export default function Gyms () {
  const gymsQuery = useQuery({
    queryKey: ['gyms'],
    queryFn: () => getGyms()
  });

  const citiesQuery = useQuery({
    queryKey: ['cities'],
    queryFn: () => getCities()
  });

  const districtsQuery = useQuery({
    queryKey: ['districts'],
    queryFn: () => getDistricts()
  });

  const [selectedCity, setSelectedCity] = useState<CityGet | null>(null);
  const [selectedDistrict, setSelectedDistrict]
    = useState<DistrictGet | null>(null);

  if (
    citiesQuery.isPending || districtsQuery.isPending || gymsQuery.isPending
  ) {
    return <Loading />;
  }

  if (gymsQuery.isError) {
    return <Error message={gymsQuery.error.message} />;
  }

  if (citiesQuery.isError) {
    return <Error message={citiesQuery.error.message} />;
  }

  if (districtsQuery.isError) {
    return <Error message={districtsQuery.error.message} />;
  }

  const filteredGyms = gymsQuery.data
    .filter((gym) => gym.city === selectedCity?.name);

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

  gymsWithDistance.sort((a, b) => (a.distance - b.distance));

  return (
    <div
      className='
        flex flex-col gap-3 self-center p-3 md:px-27 mx-auto
        w-full min-w-90 md:min-w-135 max-w-250'
    >
      <p
        className='
          flex justify-center items-center gap-3 rounded-sm
          bg-tertiary dark:bg-tertiary-dark p-3 text-center'
      >
        <span><BsInfoCircle className='text-2xl' /></span>
        <span className='text-sm'>
          This preview showcases the functionalities of the website.
          The underlying database currently lacks sufficient coverage
          of any area to be very useful in practice.
        </span>
      </p>

      <Filters
        cities={citiesQuery.data}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        districts={districtsQuery.data}
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
