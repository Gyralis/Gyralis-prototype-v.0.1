"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import BottomCardsSection from "./BottomCardsSection";
import { ClaimAndRegister } from "./ClaimAndRegister";
import { motion, useSpring, useTransform } from "framer-motion";
import { formatUnits } from "viem";
import { useAccount, useBalance, useChainId } from "wagmi";
import GyralisLogo from "~~/components/assets/GyralisLogo.svg";
import deployedContracts from "~~/contracts/deployedContracts";
import { useLoopData } from "~~/hooks/useLoopData";
import { useNextPeriodStart } from "~~/hooks/useNextPeriodStart";
import { secondsToTime } from "~~/utils";

export const LoopComponent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loadingScore, setLoadingScore] = useState(true);
  const [score, setScore] = useState<number | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState<number | undefined>(undefined);

  const chainId = useChainId();
  const { address: connectedAccount } = useAccount();
  const { loopDetails, isLoading } = useLoopData();

  const contract = deployedContracts[chainId as keyof typeof deployedContracts]?.["loop"];

  useEffect(() => {
    setCurrentPeriod(loopDetails?.currentPeriod);
  }, [loopDetails]);

  const {
    data: loopBalance,
    refetch: refetchLoopBalance,
    isLoading: loadingLoopBalance,
  } = useBalance({
    address: contract?.address,
    token: loopDetails?.token as `0x${string}`,
    chainId: chainId,
  });

  const handleFetchScore = async () => {
    setLoadingScore(true);
    if (!connectedAccount) return;

    try {
      const response = await fetch(`/api/passport/${connectedAccount.toLowerCase()}`, { method: "GET" });
      if (!response.ok) {
        if (response.status === 400) {
          setHasSubmitted(false);
          // console.log("It seems a response 400 infetching score");
        } else {
          throw new Error("Failed to fetch score in hanldeFetchScore");
        }
      } else {
        const data = await response.json();
        const numericScore = Number(data.score);
        // console.log(`I fetched the score ${connectedAccount}`, numericScore);
        setScore(numericScore || 0);
        setHasSubmitted(true);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoadingScore(false);
    }
  };

  const handleSubmitPassport = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submit-passport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectedAccount }),
      });
      if (!response.ok) throw new Error("Submission failed while submitting passport");
      setHasSubmitted(false);
      handleFetchScore();
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (connectedAccount) {
      handleFetchScore();
      console.log("I have fetched the score in useEffect", connectedAccount);
    }
  }, [connectedAccount]);

  if (isLoading) {
    return <p>loading...</p>; // or null
  }

  return (
    <>
      <div className="rounded-xl p-4 sm:p-8 flex flex-col justify-between group relative lg:sticky top-8 bg-transparent border-[#0065BD] shadow-md shadow-[#0065BD]/20 backdrop-blur-sm ">
        <div className="absolute top-0 left-0 -z-10 right-0 bottom-0 h-full w-full flex items-center justify-center">
          <Image src={GyralisLogo} alt="Gyralis Logo" width={400} height={400} className="-z-10 opacity-5" />
        </div>
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
          {isLoading || loadingLoopBalance ? (
            <p>loading dataaa...</p>
          ) : (
            <>
              {/* Loop data */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <div className="bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                  <span className="text-sm font-medium text-[#0065BD]">
                    Period length:{" "}
                    <span className="font-semibold text-lg">{secondsToTime(loopDetails?.periodLength ?? 0)}</span>
                  </span>
                </div>
                <div className="bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                  <span className="text-sm font-medium text-[#0065BD]">
                    Period distribution:{" "}
                    <span className="font-semibold text-lg">{loopDetails?.percentPerPeriod} %</span>
                  </span>
                </div>
              </div>

              {/* Loop Balance */}
              <div className="text-center mb-4">
                <div>{<AnimatedNumber value={parseFloat(formatUnits(loopBalance?.value || 0n, 18))} />}</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-medium text-[#f7cd6f]">{loopBalance?.symbol}</div>
              </div>

              {/* Countdown Timer */}
              <div className="text-center mb-8">
                <p className="text-sm text-gray-500 mb-2">Next distribution in:</p>
                <Countdown loopAddress={contract.address} />
              </div>
              {/* Claim and Register component */}
              <ClaimAndRegister score={score} refecthLoopBalance={refetchLoopBalance} currentPeriod={currentPeriod} />
            </>
          )}
        </div>
      </div>
      <BottomCardsSection
        score={score}
        hasSubmitted={hasSubmitted}
        loadingScore={loadingScore}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmitPassport}
      />
    </>
  );
};

const Countdown = ({ loopAddress }: { loopAddress: `0x${string}` }) => {
  // Get the next period start from the custom hook
  const { nextPeriodStart: nextPeriodStartAlso, loading: loadingNextPeriodStart } = useNextPeriodStart(loopAddress);

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

  const { hours, minutes, seconds } = formatTime2(Number(displayClaimIn));

  if (loadingNextPeriodStart) {
    return <div>Loading countdown...</div>;
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-4">
      <TimeBlock label="Hours" value={hours} />
      <TimeBlock label="Minutes" value={minutes} />
      <TimeBlock label="Seconds" value={seconds} />
    </div>
  );
};

// Utility to format seconds into { days, hours, minutes, seconds }
const formatTime2 = (totalSeconds: number) => {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
};

type AnimatedNumberProps = {
  value: number;
};

const AnimatedNumber = ({ value }: AnimatedNumberProps) => {
  const spring = useSpring(value, {
    mass: 0.5,
    stiffness: 50,
    damping: 10,
  });

  const display = useTransform(spring, current =>
    Number(current).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }),
  );

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#0065BD]">{display}</motion.span>;
};

const TimeBlock = ({ label, value }: { label: string; value: number }) => {
  const display = value != null ? value.toString().padStart(2, "0") : "--";
  return (
    <div className="bg-[#0065BD] text-white rounded-lg p-2 sm:p-3 w-16 sm:w-20">
      <div className="text-xl sm:text-2xl font-bold">{display}</div>
      <div className="text-xs text-gray-300">{label}</div>
    </div>
  );
};
