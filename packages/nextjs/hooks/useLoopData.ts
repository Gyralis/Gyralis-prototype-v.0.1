import { truncate } from "fs";
import { useEffect, useState } from "react";
import { Address, formatUnits } from "viem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const useLoopData = () => {
  const {
    data: readContractData,
    isLoading: isLoadingDetails,
    refetch: refetchDetails,
  } = useScaffoldReadContract({
    
    contractName: "loop",
    functionName: "getLoopDetails",
    watch: true, // Disable auto-watch, we'll manually refetch
  });

  const {
    data: currentPeriod,
    isLoading: isLoadingCurrentPeriod,
    refetch: refetchPeriod,
  } = useScaffoldReadContract({
    contractName: "loop",
    functionName: "getCurrentPeriod",
    watch: false,
  });

  const {
    data: currentPeriodData,
    isLoading: isLoadingCurrentPeriodData,
    refetch: refetchPeriodData,
  } = useScaffoldReadContract({
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
        maxPayout: currentPeriodData ? Number(currentPeriodData[1]) : 0,
      });
    };

    updateLoopDetails();
  }, [readContractData, currentPeriod, currentPeriodData]);

  //Refetch every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchDetails();
      refetchPeriod();
      refetchPeriodData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { loopDetails, isLoading };
};
