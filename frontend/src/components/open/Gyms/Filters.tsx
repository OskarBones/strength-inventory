import { useQuery } from '@tanstack/react-query';

import { getCities, getDistricts } from '../../../utils/api';

import type { CityGet, District, DistrictGet }
  from '@strength-inventory/schemas';

interface FiltersProps {
  selectedCity: CityGet | null
  setSelectedCity: React.Dispatch<React.SetStateAction<CityGet | null>>
  selectedDistrict: DistrictGet | null
  setSelectedDistrict: React.Dispatch<React.SetStateAction<DistrictGet | null>>
}

export default function Filters ({
  selectedCity, setSelectedCity, selectedDistrict, setSelectedDistrict
}: FiltersProps) {
  const citiesQuery = useQuery({
    queryKey: ['cities'],
    queryFn: () => getCities()
  });

  const districtsQuery = useQuery({
    queryKey: ['districts'],
    queryFn: () => getDistricts()
  });

  if (citiesQuery.isPending || districtsQuery.isPending) {
    return <p>Loading...</p>;
  }

  if (citiesQuery.isError) {
    return <p>Error: {citiesQuery.error.message}</p>;
  }

  if (districtsQuery.isError) {
    return <p>Error: {districtsQuery.error.message}</p>;
  }

  let filteredDistricts: District[] = [];
  if (selectedCity) {
    filteredDistricts = selectedCity.districts;
  }

  return (
    <div
      className='
        relative flex flex-col items-center gap-3 rounded-sm p-3
        bg-tertiary dark:bg-tertiary-dark text-sm'
    >
      <p
        className={`
          flex flex-col justify-center items-center h-15
          transition-opacity delay-100 duration-500
          ${selectedCity
      ? 'invisible opacity-0'
      : 'opacity-100'
    }`}
      >
        <span className='font-semibold'>Welcome!</span>
        <span>select a city to see its gyms</span>
      </p>
      <div
        className={`
          flex flex-col items-center gap-1 h-15
          transition-transform ease-out duration-300
          ${selectedCity
      ? '-translate-y-18'
      : ''
    }`}
      >
        <label htmlFor='city'>select your city</label>
        <select
          id='city'
          name='city'
          value={selectedCity
            ? selectedCity.name
            : ''}
          className='border rounded-sm p-1 pl-5 w-50 text-center cursor-pointer'
          onChange={(event) => {
            const newSelectedCity = citiesQuery.data
              .find((city) => city.name === event.target.value);
            // truthy when the -- city -- option is not selected
            if (newSelectedCity) {
              setSelectedCity(newSelectedCity);
            } else {
              setSelectedCity(null);
            }
            setSelectedDistrict(null);
          }}
        >
          <option value=''>-- city --</option>
          {citiesQuery.data.map((city) => (
            <option key={city.id} value={city.name}>
              {city.name} ({city.country})
            </option>
          ))}
        </select>
      </div>

      <div
        className={`
          absolute bottom-3 flex flex-col items-center gap-1 h-15
          transition-opacity delay-100 duration-500
        ${!selectedCity
      ? 'invisible opacity-0'
      : 'opacity-100'}
      `}
      >
        <label htmlFor='district'>sort gyms around a district?</label>
        <select
          id='district'
          name='disctrict'
          value={selectedDistrict
            ? selectedDistrict.name
            : ''}
          className='border rounded-sm p-1 pl-5 w-50 text-center cursor-pointer'
          onChange={(event) => {
            const newSelectedDistrict = districtsQuery.data
              .find((district) => district.name === event.target.value);
            // truthy when the -- district -- option is not selected
            if (newSelectedDistrict) {
              setSelectedDistrict(newSelectedDistrict);
            } else {
              setSelectedDistrict(null);
            }
          }}
        >
          <option value=''>no district</option>
          {filteredDistricts.map((district) => (
            <option key={district.id} value={district.name}>
              {district.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
