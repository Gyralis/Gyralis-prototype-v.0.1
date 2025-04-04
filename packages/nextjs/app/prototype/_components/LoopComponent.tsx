"use client";

import { useEffect, useState } from "react";
import { ClaimAndRegister } from "./ClaimAndRegister";
import { formatUnits } from "viem";
import { useBalance, useChainId } from "wagmi";
import { useLoopData } from "~~/hooks/useLoopData";
import { useLoopDataWagmi } from "~~/hooks/useLoopDataWagmi";
import { useNextPeriodStart } from "~~/hooks/useNextPeriodStart";
import { formatTime, secondsToTime } from "~~/utils";

const LOOP_ADDRESS = "0xED179b78D5781f93eb169730D8ad1bE7313123F4";
const TOKEN_ADDRESS = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";

export const LoopComponent = () => {
  const chainId = useChainId();

  const { loopDetails, isLoading } = useLoopData();

  const { data: loopBalance, refetch: refetchLoopBalance } = useBalance({
    address: LOOP_ADDRESS,
    token: TOKEN_ADDRESS as `0x${string}` | undefined,
    chainId: chainId,
  });

  // Countdown timer state and logic
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30,
  });

  const [buttonState, setButtonState] = useState("register"); // Possible states: register, claim, ok

  //const { loopData } = useLoopDataWagmi(LOOP_ADDRESS)
  //console.log(loopData);

  return (
    <div className="bg-gray-100 rounded-xl p-4 sm:p-8 flex flex-col justify-between  sticky top-8">
      <div>
        <div className="max-w-md lg:max-w-lg mx-auto text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-center">
            Use Gyralis in your organization
          </h2>
          <p className="text-center font-medium text-sm sm:text-base">
            Create custom Loops to reward your community and align incentives with your goals.
          </p>
        </div>

        {/* Badges and Loop Balance */}

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <div className="bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
            <span className="text-sm font-medium text-[#0065BD]">
              Period length:{" "}
              <span className="font-semibold text-lg">{secondsToTime(loopDetails?.periodLength ?? 0)}</span>
            </span>
          </div>
          <div className="bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
            <span className="text-sm font-medium text-[#0065BD]">
              Period distribution: <span className="font-semibold text-lg">{loopDetails?.percentPerPeriod} %</span>
            </span>
          </div>
        </div>
      </div>
      <div className="text-center mb-4">
        <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#0065BD]">
          {formatUnits(loopBalance?.value || 0n, 18)}
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl font-medium text-[#f7cd6f]">HNY</div>
      </div>

      {/* Countdown Timer */}
      <div className="text-center mb-8">
        <p className="text-sm text-gray-500 mb-2">Next distribution in:</p>
        {/* <div className="flex justify-center gap-2 sm:gap-4">
          <div className="bg-[#0065BD] text-white rounded-lg p-2 sm:p-3 w-16 sm:w-20">
            <div className="text-xl sm:text-2xl font-bold">{timeLeft.hours.toString().padStart(2, "0")}</div>
            <div className="text-xs text-gray-300">Hours</div>
          </div>
          <div className="bg-[#0065BD] text-white rounded-lg p-2 sm:p-3 w-16 sm:w-20">
            <div className="text-xl sm:text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, "0")}</div>
            <div className="text-xs text-gray-300">Minutes</div>
          </div>
          <div className="bg-[#0065BD] text-white rounded-lg p-2 sm:p-3 w-16 sm:w-20">
            <div className="text-xl sm:text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, "0")}</div>
            <div className="text-xs text-gray-300">Seconds</div>
          </div>
        </div> */}
        <Countdown />
      </div>

      <ClaimAndRegister />
    </div>
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
  const claimIn = nextPeriodStartAlso !== undefined ? nextPeriodStartAlso - currentTime : undefined;

  const displayClaimIn = claimIn !== undefined ? (claimIn < 0n ? 0n : claimIn) : undefined;

  if (loading) {
    return <div>Loading countdown...</div>;
  }

  return (
    <div>
      <p>Time remaining (claimIn): {formatTime(Number(displayClaimIn))}</p>
    </div>
  );
}
