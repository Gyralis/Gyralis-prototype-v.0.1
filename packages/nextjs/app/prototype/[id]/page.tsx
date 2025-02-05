
import { NextPage } from 'next';

const Page: NextPage<{ params: { id: string } }> = async ({ params }) => {
    
    const { id } = params;

    return (
        <div>
            {/* <h1>Organization page: {id}</h1>
            <p>This is a dynamic page with the ID: {id}</p> */}
            <OrganizationHeader />
        </div>
    );
};

export default Page;

import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'

const profile = {
  name: '1hive DAO',
  email: 'ricardo.cooper@example.com',
  avatar:
    'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
  backgroundImage:
    'https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  fields: [
    ['Phone', '(555) 123-4567'],
    ['Email', 'ricardocooper@example.com'],
    ['Title', 'Senior Front-End Developer'],
    ['Team', 'Product Development'],
    ['Location', 'San Francisco'],
    ['Sits', 'Oasis, 4th floor'],
    ['Salary', '$145,000'],
    ['Birthday', 'June 8, 1990'],
  ],
}

const OrganizationHeader =()=> {
  return (
    <div>
      <div className='bg-yellow-100 h-28 lg:h-38'>
        {/* <img alt="" src={profile.backgroundImage} className="h-32 w-full object-cover lg:h-48" /> */}
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 ">
        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5 ">
          <div className="flex">
            <img alt="" src={"/1hive-logo.svg"} className="size-24 transition-all ease-in-out duration-300 bg-white hover:scale-105 hover:rotate-12 rounded-full ring-4 ring-white sm:size-32" />
          </div>
            
          <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:pb-1 ">
            <div className="mt-6 min-w-0 flex-1 sm:hidden md:block ">
              <h1 className="truncate text-2xl font-bold text-gray-900">{profile.name}</h1>
             {/* <p>des</p> */}
            </div>
           
            <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
              <button
                type="button"
                className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <EnvelopeIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5 text-gray-400" />
                <span>Follow</span>
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <PhoneIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5 text-gray-400" />
                <span>Discord</span>
              </button>
            </div>
          </div>
          {/* <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1 ">
          <p>description</p>
          </div> */}
          {/* <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:pb-1 "><p>description</p></div> */}
          
        
        </div>
        <div className="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
          <h1 className="truncate text-2xl font-bold text-gray-900">{profile.name}</h1>
        </div>
      </div>
    </div>
  )
}
