
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export const metadata = getMetadata({
  title: "Debug Contracts",
  description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

const Prototype: NextPage = () => {
  return (
    <div className="py-4 border2">
          <header>
            <div className="mx-auto max-w-7xl border2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Explore organizations</h1>
            </div>
          </header>
          <main>
            <div className="mx-auto max-w-7xl py-4"><Example/></div>
         
          </main>
      </div>
  );
};

export default Prototype;


const people = [
  {
    name: '1hive',
    description: '1Hive is a DAO that issues and distributes a digital currency called Honey.',
    role: 'Admin',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',  },


]

const  Example = () => {
  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {people.map((person) => (
        <li
          key={person.name}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow shadow-md cursor-pointer hover:shadow-lg transition-all ease-in-out duration-300"
        >
          <div className="flex flex-1 flex-col p-8">
            {/* <img alt="" src={"/1hive-logo.png"} className="mx-auto shrink-0 rounded-full border2" /> */}
            <Image alt="" src={"/1hive-logo.svg"} className="mx-auto shrink-0 rounded-full" width={100} height={100} />
            <h2 className="mt-6 font-bold text-gray-900 text-center">{person.name}</h2>
            <dl className="mt-1 flex grow flex-col justify-between">
              <dt className="sr-only">description</dt>
              <dd className="text-sm text-gray-500">{person.description}</dd>
      
            </dl>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <a
                  href={`/prototype/${person.name}`}
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  
                  Active Loops
                  <ArrowUpRightIcon className="h-5 w-5 text-gray-900" aria-hidden="true" />
                </a>
              </div>
           
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}



