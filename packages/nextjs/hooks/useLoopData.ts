import { useEffect, useState } from "react";
import { truncate } from "fs";
import { Address, formatUnits } from "viem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const useLoopData = () => {
  const { data: readContractData, isLoading: isLoadingDetails, refetch:refetch } = useScaffoldReadContract({
    contractName: "loop",
    functionName: "getLoopDetails",
    watch: false,
  });

  const { data: currentPeriod, isLoading: isLoadingCurrentPeriod, refetch:refetchPeriod } = useScaffoldReadContract({
    contractName: "loop",
    functionName: "getCurrentPeriod",
    watch: false,
  });

  const { data: currentPeriodData, isLoading: isLoadingCurrentPeriodData, refetch:refetchPeriodData } = useScaffoldReadContract({
    contractName: "loop",
    functionName: "getCurrentPeriodData",
    watch: false,
  });

  interface LoopDetails {
    token: Address;
    periodLength: number;
    percentPerPeriod: number;
    firstPeriodStart: bigint;
    currentPeriod: number;
    currentPeriodRegistrations: number;
    maxPayout: number;
  }

 
  


  const [loopDetails, setLoopDetails] = useState<LoopDetails | undefined>(undefined);
  const isLoading = isLoadingDetails || isLoadingCurrentPeriod || isLoadingCurrentPeriodData;

  useEffect(() => {
    const updateLoopDetails = () => {
      if (!readContractData) return;

      setLoopDetails({
        token: readContractData[0] as Address,
        periodLength: Number(readContractData[1]),
        percentPerPeriod: Number(readContractData[2]),
        firstPeriodStart: readContractData[3] as bigint,
        currentPeriod: Number(currentPeriod),
        currentPeriodRegistrations: currentPeriodData ? Number(currentPeriodData[0]) : 0,
        maxPayout: Number(currentPeriodData?.[1] ?? 0),
      });
    };

    updateLoopDetails();
  }, [readContractData, currentPeriod, currentPeriodData]);


  const getSecondsUntilNextPeriod = () => {
    const now = Math.floor(Date.now() / 1000);
    const timeSinceStart = now - Number(loopDetails?.firstPeriodStart);
    const secondsIntoCurrentPeriod = loopDetails?.periodLength !== undefined ? timeSinceStart % loopDetails.periodLength : 0;
    return (loopDetails?.periodLength ?? 0) - secondsIntoCurrentPeriod;
  };


  useEffect(() => {
    const delay = getSecondsUntilNextPeriod();
    const interval = setInterval(() => {
      refetch();
       refetchPeriod();
       refetchPeriodData();
    }, delay);

    return () => clearInterval(interval);
  }, []);

  return { loopDetails, isLoading };
};


