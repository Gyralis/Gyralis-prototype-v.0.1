import { useEffect, useState } from "react";
import { Address } from "viem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface LoopDetails {
  token: Address;
  periodLength: number;
  percentPerPeriod: number;
  firstPeriodStart: bigint;
  currentPeriod: number;
}

export const useLoopData = () => {
  const {
    data: readContractData,
    isLoading: isLoadingDetails,
    refetch: refetchDetails,
  } = useScaffoldReadContract({
    contractName: "loop",
    functionName: "getLoopDetails",
    watch: false,
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

  const [loopDetails, setLoopDetails] = useState<LoopDetails | undefined>(undefined);
  const isLoading = isLoadingDetails || isLoadingCurrentPeriod || isLoadingCurrentPeriodData;

  useEffect(() => {
    if (!readContractData || !currentPeriod) return;

    setLoopDetails({
      token: readContractData[0] as Address,
      periodLength: Number(readContractData[1]),
      percentPerPeriod: Number(readContractData[2]),
      firstPeriodStart: readContractData[3] as bigint,
      currentPeriod: Number(currentPeriod),
    });
  }, [readContractData, currentPeriod]);

  useEffect(() => {
    if (!loopDetails) return;

    let timeout: NodeJS.Timeout;

    const scheduleNextUpdate = () => {
      const now = Math.floor(Date.now() / 1000);
      const timeSinceStart = now - Number(loopDetails.firstPeriodStart);
      const secondsIntoCurrentPeriod = timeSinceStart % loopDetails.periodLength;
      const secondsUntilNextPeriod = loopDetails.periodLength - secondsIntoCurrentPeriod;

      timeout = setTimeout(async () => {
        await Promise.all([refetchDetails(), refetchPeriod(), refetchPeriodData()]);
        scheduleNextUpdate(); // reschedule after refetch
      }, secondsUntilNextPeriod * 1000);
    };

    scheduleNextUpdate();

    return () => clearTimeout(timeout);
  }, [loopDetails]);

  return { loopDetails, isLoading };
};
