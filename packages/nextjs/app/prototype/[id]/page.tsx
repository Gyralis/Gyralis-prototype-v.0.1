
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
            <span className="relative z-10 flex items-center justify-center w-9 h-9 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange"><svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 462.799"><path fill-rule="nonzero" d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"/></svg></span>

            <span className="relative z-10 flex items-center justify-center w-10 h-10 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange"><svg viewBox="0 -28.5 256 256" version="1.1" xmlns="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#000000" fill-rule="nonzero"> </path> </g> </g></svg></span>
          
            </div>

            {/*  */}
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