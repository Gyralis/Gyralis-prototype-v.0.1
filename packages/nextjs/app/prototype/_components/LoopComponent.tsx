"use client";

import { DebugContracts } from "./DebugContracts";
import { Disclosure, DisclosureButton, DisclosurePanel, DisclosureProps } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { ShieldCheckIcon, ShieldExclamationIcon } from "@heroicons/react/24/solid";
import { LoopContractUI } from "~~/app/prototype/_components/LoopContractUI";
import { useDeployedContractInfo, useNetworkColor } from "~~/hooks/scaffold-eth";
import { UseScaffoldReadConfig } from "~~/utils/scaffold-eth/contract";

export const LoopComponent = () => {
  // const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo("loop");

  // console.log(deployedContractLoading, deployedContractData);

  return (
    <main className="px-4  mt-6">
      {/* <h2 className="text-xl py-1">LOOPS</h2> */}
      <Example />
      {/* <div className="mx-auto max-w-3xl lg:max-w-7xl ">
        <h1 className="sr-only">Page title</h1>
        
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
          <div className="grid grid-cols-1 gap-4 lg:col-span-2">
            <section aria-labelledby="section-1-title">
              <div className="card-white flex flex-col items-center justify-between gap-24">
                <div className="w-full">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex flex-col gap-1">
                      <h5>
                        Loop period length: <span>24hs</span>
                      </h5>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <h5>
                        Current period registrations: <span>10</span>
                      </h5>
                      <h5>
                        Estimated claim amount for next period: <span>0.5 HNY</span>
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="">Countdown _component</div>
                <div className="">Register _button</div>
              </div>
            </section>
          </div>

          <div className="">
            <section aria-labelledby="section-2-title">
              <div className="p-6 flex flex-col gap-7 items-start justify-center">
                <LoopContractUI contractName="loop" />
                <div className="card-white w-full flex flex-col items-start gap-2">
                  <div className="relative">
                    <ShieldCheckIcon className="absolute top-0 -left-6 sm:-left-8 h-5 w-5 sm:h-6 w-6  text-green-500" />
                    <h4 className="font-bold">
                      Loop Shield: <span>Gitcoin Passport</span>
                    </h4>
                    <h5>
                      Score required: <span>15</span>
                    </h5>
                    <h5>
                      Your score: <span>20</span>
                    </h5>
                  </div>
                  <div className="flex flex-col items-start relative">
                    <ShieldExclamationIcon className="absolute top-0 -left-6 sm:-left-8 h-5 w-5 sm:h-6 w-6 text-red-500" />

                    <h3 className="font-bold">
                      Participation Criteria:{" "}
                      <a
                        href="https://app.gardens.fund/gardens/100/0x71850b7e9ee3f13ab46d67167341e4bdc905eef9/0xe2396fe2169ca026962971d3b2e373ba925b6257"
                        target="_blank"
                        rel=""
                        className="font-normal hover:underline transition-all ease-in-out duration-300"
                      >
                        1hive Member in GardensV2
                      </a>
                    </h3>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div> */}
    </main>
  );
};

function Example() {
  return (
    <div className="mx-auto">
      <h3 className="text-2xl font-semibold tracking-tight">
        Active Loops <span className="font-semibold">(1)</span>
      </h3>

      <dl className="mt-4 divide-y divide-gray-900/10">
        {/* {faqs.map(faq => ( */}
        <Disclosure open as={"div" as DisclosureProps["as"]} className="py-6 first:pt-0 last:pb-0">
          <dt>
            <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900 border2">
              <span className="text-base/7 font-semibold">Some info about the loop</span>
              <span className="ml-6 flex h-7 items-center transition-all ease-in-out duration-300">
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-6 group-data-[open]:hidden transition-all ease-in-out duration-300"
                />
                <ChevronUpIcon
                  aria-hidden="true"
                  className="size-6 group-[&:not([data-open])]:hidden transition-all ease-in-out duration-300"
                />
              </span>
            </DisclosureButton>
          </dt>
          <DisclosurePanel as={"div" as DisclosureProps["as"]} className="mt-2 pr-12">
            {/* <LoopComponent /> */}loop content
          </DisclosurePanel>
        </Disclosure>
        {/* ))} */}
      </dl>
    </div>
  );
}

       {/* <div className="mx-auto max-w-3xl lg:max-w-7xl ">
        <h1 className="sr-only">Page title</h1>
        
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
          <div className="grid grid-cols-1 gap-4 lg:col-span-2">
            <section aria-labelledby="section-1-title">
              <div className="card-white flex flex-col items-center justify-between gap-24">
                <div className="w-full">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex flex-col gap-1">
                      <h5>
                        Loop period length: <span>24hs</span>
                      </h5>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <h5>
                        Current period registrations: <span>10</span>
                      </h5>
                      <h5>
                        Estimated claim amount for next period: <span>0.5 HNY</span>
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="">Countdown _component</div>
                <div className="">Register _button</div>
              </div>
            </section>
          </div>

          <div className="">
            <section aria-labelledby="section-2-title">
              <div className="p-6 flex flex-col gap-7 items-start justify-center">
                <LoopContractUI contractName="loop" />
                <div className="card-white w-full flex flex-col items-start gap-2">
                  <div className="relative">
                    <ShieldCheckIcon className="absolute top-0 -left-6 sm:-left-8 h-5 w-5 sm:h-6 w-6  text-green-500" />
                    <h4 className="font-bold">
                      Loop Shield: <span>Gitcoin Passport</span>
                    </h4>
                    <h5>
                      Score required: <span>15</span>
                    </h5>
                    <h5>
                      Your score: <span>20</span>
                    </h5>
                  </div>
                  <div className="flex flex-col items-start relative">
                    <ShieldExclamationIcon className="absolute top-0 -left-6 sm:-left-8 h-5 w-5 sm:h-6 w-6 text-red-500" />

                    <h3 className="font-bold">
                      Participation Criteria:{" "}
                      <a
                        href="https://app.gardens.fund/gardens/100/0x71850b7e9ee3f13ab46d67167341e4bdc905eef9/0xe2396fe2169ca026962971d3b2e373ba925b6257"
                        target="_blank"
                        rel=""
                        className="font-normal hover:underline transition-all ease-in-out duration-300"
                      >
                        1hive Member in GardensV2
                      </a>
                    </h3>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div> */}
