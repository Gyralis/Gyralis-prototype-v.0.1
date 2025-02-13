
import { NextPage } from 'next';
import { EnvelopeIcon, PhoneIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { ShieldCheckIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';
import Debug from '~~/app/debug/page';
import { DebugContracts } from '../_components/DebugContracts';


const Page: NextPage<{ params: { id: string } }> = async ({ params }) => {
    
    const { id } = params;

    return (
        <div>
            {/* <h1>Organization page: {id}</h1>
            <p>This is a dynamic page with the ID: {id}</p> */}
            <OrganizationHeader title={id} />
            <LoopComponent />
        </div>
    );
};

export default Page;



const OrganizationHeader =({ title }: { title: string })=> {
  return (
    <div>
      <div className='bg-yellow-100 h-28 lg:h-40'>
        {/* <img alt="" src={profile.backgroundImage} className="h-32 w-full object-cover lg:h-48" /> */}
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 ">
        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5 ">
          <div className="flex">
            <img alt="" src={"/1hive-logo.svg"} className="size-24 transition-all ease-in-out duration-300 bg-white hover:scale-105 hover:rotate-12 rounded-full ring-4 ring-white sm:size-28" />
          </div>
            
          <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:pb-1 ">
            <div className="mt-6 min-w-0 flex-1 sm:hidden md:block ">
              <h1 className="truncate text-2xl font-bold text-gray-900">{title}</h1>
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
          <h1 className="truncate text-2xl font-bold text-gray-900">{title}</h1>
        </div>
      </div>
    </div>
  )
}


const LoopComponent = () => {
  return (
    
    <main className="mt-5 pb-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="sr-only">Page title</h1>
            {/* Main 3 column grid */}
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
              {/* Left column */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                <section aria-labelledby="section-1-title">
                  <h2 id="section-1-title" className="sr-only">
                    Section title
                  </h2>
                  <div className="overflow-hidden rounded-3xl bg-slate-50 shadow p-6">
                    <div className="card-white flex flex-col items-center justify-between gap-24">
                      <div className='w-full'>
                        <div className='flex items-center justify-between w-full'>
                         <div className='flex flex-col gap-1'>
                          <h5>Registration period: <span>12hs</span></h5>
                          <h5>Claim period: <span>12hs</span></h5>
                         </div>
                         <div className='flex flex-col gap-1 items-end'>
                          <h5>Current period registrations: <span>10</span></h5>
                          <h5>Estimated claim amount for next period: <span>0.5 HNY</span></h5>
                         </div>
                        </div>
                      </div>
                      <div className=''>Countdown _component</div>
                      <div className=''>Register _button</div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right column */}
              <div className="">
                <section aria-labelledby="section-2-title">
                
                  <div className="rounded-3xl bg-slate-50 shadow">
                    <div className="p-6 flex flex-col gap-7 items-start justify-center">{/* Your content */}
                      <DebugContracts />
                      <div className='card-white w-full flex flex-col items-start gap-2'>
                        <div className='relative'>
                          <ShieldCheckIcon className='absolute top-0 -left-6 sm:-left-8 h-5 w-5 sm:h-6 w-6  text-green-500'/>
                      <h4 className="font-bold">Loop Shield: <span>Gitcoin Passport</span></h4>
                      <h5>Score required: <span>15</span></h5>
                      <h5>Your score: <span>20</span></h5>
                      </div>
                      <div className='flex flex-col items-start relative'>
                      <ShieldExclamationIcon className='absolute top-0 -left-6 sm:-left-8 h-5 w-5 sm:h-6 w-6 text-red-500'/>

                      <h3 className="font-bold">
                        Participation Criteria:{" "}
                        <a
                          href="https://app.gardens.fund/gardens/100/0x71850b7e9ee3f13ab46d67167341e4bdc905eef9/0xe2396fe2169ca026962971d3b2e373ba925b6257"
                          target="_blank"
                          rel=""
                          className='font-normal hover:underline transition-all ease-in-out duration-300'
                        >
                          1hive Member in GardensV2
                        </a>
                      </h3>
                      </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
  )
}