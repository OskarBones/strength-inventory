import { useState } from 'react';

import { IoNavigateCircle } from 'react-icons/io5';
import { TbWorldWww } from 'react-icons/tb';

import GymExtension from './GymExtension';
import GymExtensionButton from './GymExtensionButton';

import { type GymGet } from '@strength-inventory/schemas';

export default function Gym ({ gym }: { gym: GymGet; }) {
  const [activeExtension, setActiveExtension] = useState<string | null>(null);

  function handleToggle (title: string) {
    setActiveExtension(activeExtension === title
      ? null
      : title);
  }

  return (
    <div
      className='
        flex flex-col
        text-primary-text dark:text-primary-text-dark'
    >
      {/* Adapt the placement of the extension buttons to the screen size */}
      <div className='flex flex-col md:flex-row'>
        <div
          className='
            flex flex-col border-x border-t rounded-t-sm
            md:border-x-0 md:border-l md:border-y md:rounded-l-sm
            md:rounded-tr-none bg-primary dark:bg-primary-dark p-3 md:w-4/9
            min-h-18'
        >
          <h2 className='font-bold'>
            {gym.url
              ? (
                <a
                  href={gym.url}
                  target='_blank'
                  className='
                    flex items-center gap-1
                    hover:text-blue-600 dark:hover:text-blue-400'
                >
                  {gym.name} <TbWorldWww />
                </a>
              )
              : <span>{gym.name}</span>}
          </h2>
          <a
            href={gym.location}
            target='_blank'
            className='
              flex items-center gap-1 text-sm
              hover:text-blue-600 dark:hover:text-blue-400'
          >
            <IoNavigateCircle className='text-xl' />
            {gym.street} {gym.streetNumber}, {gym.city}
          </a>
        </div>
        <div
          className='
            flex flex-1 border rounded-b-sm md:rounded-r-sm md:rounded-bl-none
            divide-x bg-secondary dark:bg-secondary-dark
            min-h-18'
        >
          <GymExtensionButton
            activeExtension={activeExtension}
            disabled={!gym.equipmentVisible}
            handleToggle={handleToggle}
            title='equipment'
          />
          <GymExtensionButton
            activeExtension={activeExtension}
            disabled={!gym.membershipsVisible}
            handleToggle={handleToggle}
            title='memberships'
          />
          <GymExtensionButton
            activeExtension={activeExtension}
            disabled={!gym.openingHoursVisible}
            handleToggle={handleToggle}
            title='opening hours'
          />
        </div>
      </div>

      <div className='bg-tertiary dark:bg-tertiary-dark'>
        <GymExtension activeExtension={activeExtension} gym={gym} />
      </div>
    </div>
  );
}
