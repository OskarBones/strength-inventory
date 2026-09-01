import { useState } from 'react';

import { FaPlus } from 'react-icons/fa6';
import { IoNavigateCircle } from 'react-icons/io5';
import { TbWorldWww } from 'react-icons/tb';
import { TiInfoLarge } from 'react-icons/ti';

import GymExtension from './GymExtension';
import GymExtensionButton from './GymExtensionButton';

import { type GymWithDistance } from '@strength-inventory/schemas';

export default function Gym ({ gym }: { gym: GymWithDistance }) {
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [activeExtension, setActiveExtension] = useState<string | null>(null);

  function handleToggle (title: string) {
    setActiveExtension(activeExtension === title
      ? null
      : title);
  }

  return (
    <div className='flex flex-col'>
      {/* Adapt the placement of the extension buttons to the screen size */}
      <div className='flex flex-col md:flex-row'>
        <div
          className='
            flex flex-col border-x border-t rounded-t-sm
            md:border-x-0 md:border-l md:border-y md:rounded-l-sm
            md:rounded-tr-none min-h-20 md:min-h-25
            bg-primary dark:bg-primary-dark md:w-27/60'
        >
          <div
            className='
              flex flex-1 md:flex-col justify-center items-center md:items-start
              pr-1 pl-3'
          >
            <div className='flex flex-col w-1/2 md:w-full'>
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
                      <span className='truncate'>{gym.name}</span>
                      <TbWorldWww className='w-5' />
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
                <IoNavigateCircle className='text-base' />
                <span className='truncate'>{gym.street}</span>
                <span>{gym.streetNumber}</span>
              </a>
            </div>

            <div
              className='
                flex flex-1 md:flex-0 flex-col md:flex-row items-center
                gap-1 text-sm'
            >
              <p className='flex items-center gap-1'>
                {gym.distance} km
                <span className='mt-0.5 text-xs'>from</span>
              </p>
              {gym.referencePoint}
            </div>
          </div>

          <div
            className={!gym.notes
              ? 'hidden'
              : ''}
          >
            <button
              aria-pressed={showNotes}
              className='
                hidden md:flex justify-center items-center border-t
                md:rounded-bl-sm py-0.5 w-full cursor-pointer
                hover:inset-ring active:inset-ring
                inset-ring-black dark:inset-ring-neutral-400
                aria-pressed:bg-background
                dark:aria-pressed:bg-background-dark'
              onClick={() => {
                setShowNotes(!showNotes);
              }}
            >
              <FaPlus className='text-xs' /> <TiInfoLarge />
            </button>
            <button
              aria-pressed={showNotes}
              className='
                md:hidden flex justify-center items-center
                border-t py-0.5 w-full cursor-pointer
                hover:inset-ring active:inset-ring
                inset-ring-black dark:inset-ring-neutral-400
                aria-pressed:bg-background
                dark:aria-pressed:bg-background-dark'
              onClick={() => {
                setShowNotes(!showNotes);
              }}
            >
              <FaPlus className='text-xs' /> <TiInfoLarge />
            </button>
          </div>
        </div>

        {/* notes on small screens */}
        {showNotes
          ? (
            <div
              className='
                md:hidden bg-background dark:bg-background-dark p-1
                border-x border-t text-center text-sm'
            >
              {gym.notes}
            </div>
          )
          : null}

        <div
          className='
            flex flex-1 border rounded-b-sm md:rounded-r-sm md:rounded-bl-none
            divide-x bg-secondary dark:bg-secondary-dark'
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

      {/* notes on big screens */}
      {showNotes
        ? (
          <div
            className='
              hidden md:block bg-background dark:bg-background-dark p-1
              border-x border-b text-center text-sm'
          >
            {gym.notes}
          </div>
        )
        : null}

      <div className='bg-tertiary dark:bg-tertiary-dark'>
        <GymExtension activeExtension={activeExtension} gym={gym} />
      </div>
    </div>
  );
}
