"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { ShieldCheckIcon, ShieldExclamationIcon } from "@heroicons/react/24/solid";
import { LoopContractUI } from "~~/app/prototype/_components/LoopContractUI";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useLoopData } from "~~/hooks/useLoopData";
import { useNextPeriodStart } from "~~/hooks/useNextPeriodStart";
import { formatTime, secondsToTime } from "~~/utils";

export const LoopComponent = () => {

  

  console.log("Im rendering...");

 const { loopDetails, isLoading } = useLoopData();

  //hora se deployo el contrato 3:01 pm (firstPeriodStart) // PERIOD LENGHT 10min  // volver a llamar cuando > 3:11

  // const nextPeriodStart = useMemo(() => {
  //   if (
  //     loopDetails &&
  //     loopDetails.currentPeriod !== undefined &&
  //     !isNaN(loopDetails.currentPeriod) &&
  //     !isNaN(Number(loopDetails.firstPeriodStart)) &&
  //     !isNaN(loopDetails.periodLength)
  //   ) {
  //     return (
  //       BigInt(loopDetails.firstPeriodStart) +
  //       BigInt(loopDetails.periodLength) * (BigInt(loopDetails.currentPeriod) + 1n)
  //     );
  //   }
  //   return 0n;
  // }, [loopDetails]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setClientTime(BigInt(Date.now()) / 1000n);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  //const claimBefore = clientTime !== null ? nextPeriodStart - clientTime - 1n : null;

  // const { nextPeriodStart: nextPeriodStartAlso } = useNextPeriodStart("0xED179b78D5781f93eb169730D8ad1bE7313123F4");
  // //testing time

  // const currentTimeInSeconds = BigInt(Date.now()) / 1000n;

  // const claimBeforeAlso = nextPeriodStartAlso && nextPeriodStartAlso - currentTimeInSeconds - 1n;

  // const claimIn = nextPeriodStartAlso && nextPeriodStartAlso - currentTimeInSeconds;

  // console.log(currentTimeInSeconds);

  return (
    <main className="px-4 mt-6">
      <h2 className="text-xl py-1">TEST LOOP:</h2>
      {/* <div className="mx-auto max-w-3xl lg:max-w-7xl"> */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          <section>
            <div className="card-white flex flex-col items-center justify-between gap-10">
              <div className="w-full">
                <div className="flex flex-col items-start w-full">
                  <div className="flex flex-col gap-1">
                    <h5>
                      Loop period length:{" "}
                      <span>
                        {loopDetails?.periodLength !== undefined
                          ? secondsToTime(Number(loopDetails.periodLength))
                          : "N/A"}
                      </span>
                    </h5>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h5>
                      Loop distribution: <span>{loopDetails?.percentPerPeriod} %</span>
                    </h5>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h5>
                      Currento Period: <span>{loopDetails?.currentPeriod}</span>
                    </h5>
                  </div>
                  <div className="flex flex-col gap-1 items-start">
               
                    <h5>
                      Estimated claim amount for next period: <span>0</span>
                    </h5>
                  </div>
                </div>

              </div>
              <Countdown />
              {/* <div className="">{`Claim Before: ${formatTime(Number(claimBeforeAlso))}`}</div>
              <div className="">{`Claim in: ${formatTime(Number(claimIn))}`}</div> */}

              <div className="">
                {/* <button
                    className="btn btn-primary"
                    onClick={async () => {
                      const hashedSignature = await simulateSignature({ message: address ?? "" });
                      if (!hashedSignature) return;
                      try {
                        await writeLoopContractAsync({
                          functionName: "claimAndRegister",
                          args: [hashedSignature],
                        });
                      } catch (e) {
                        console.error("Error claim&Register:", e);
                      }
                    }}
                  >
                    claim & Register
                  </button> */}
              </div>
            </div>
          </section>
        </div>
        <div>
          {/* <section>
              <div className="p-6 flex flex-col gap-7 items-start">
                <LoopContractUI contractName="loop" />
                <div className="card-white w-full flex flex-col items-start gap-2">
                  <div className="relative">
                    <ShieldCheckIcon className="absolute top-0 -left-6 h-5 w-5 text-green-500" />
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
                    <ShieldExclamationIcon className="absolute top-0 -left-6 h-5 w-5 text-red-500" />
                    <h3 className="font-bold">
                      Participation Criteria:
                      <a
                        href="https://app.gardens.fund/gardens/100/0x71850b7e9ee3f13ab46d67167341e4bdc905eef9/0xe2396fe2169ca026962971d3b2e373ba925b6257"
                        target="_blank"
                        className="font-normal hover:underline"
                      >
                        1hive Member in GardensV2
                      </a>
                    </h3>
                  </div>
                </div>
              </div>
            </section> */}
        </div>
      </div>
      {/* </div> */}
    </main>
  );
};

export function Countdown() {
  // Get the next period start from the custom hook
  const { nextPeriodStart: nextPeriodStartAlso, loading } = useNextPeriodStart(
    "0xED179b78D5781f93eb169730D8ad1bE7313123F4",
  );

  // State to keep track of the current time in seconds
  const [currentTime, setCurrentTime] = useState<bigint>(BigInt(Date.now()) / 1000n);

  // Update the current time every second for a live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(BigInt(Date.now()) / 1000n);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate the time remaining until the next period starts
  const claimIn =
  nextPeriodStartAlso !== undefined
    ? nextPeriodStartAlso - currentTime
    : undefined;

const displayClaimIn =
  claimIn !== undefined ? (claimIn < 0n ? 0n : claimIn) : undefined;


  if (loading) {
    return <div>Loading countdown...</div>;
  }

  return (
    <div>
      <h2>Countdown to Next Period</h2>
      <p>Time remaining (claimIn): {formatTime(Number(displayClaimIn))}</p>
      
    </div>
  );
}
