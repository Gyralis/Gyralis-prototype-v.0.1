import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainId, usePublicClient, useReadContract } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";

export function useNextPeriodStart(loopAddress: `0x${string}`) {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const [nextPeriodStart, setNextPeriodStart] = useState<bigint | undefined>();
  const [loading, setLoading] = useState(true);

  const loopAbi = useMemo(() => {
    return deployedContracts?.[chainId as keyof typeof deployedContracts]?.loop?.abi ?? [];
  }, [chainId]);

  const { data: currentPeriod } = useReadContract({
    address: loopAddress,
    abi: loopAbi,
    functionName: "getCurrentPeriod",
  });

  // Function to calculate the next period start timestamp
  const calculateNextPeriodStart = useCallback((loopDetails: any, currentPeriod: bigint) => {
    // Assuming loopDetails[3] is the base timestamp and loopDetails[1] is the period duration
    return BigInt(loopDetails[3]) + BigInt(loopDetails[1]) * (currentPeriod + 1n);
  }, []);

  useEffect(() => {
    if (!publicClient || currentPeriod === undefined) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const loopDetails = await publicClient.readContract({
          address: loopAddress,
          abi: loopAbi,
          functionName: "getLoopDetails",
        });

        const nextStart = calculateNextPeriodStart(loopDetails, currentPeriod);
        setNextPeriodStart(nextStart);
      } catch (err) {
        console.error("Error fetching Register logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [publicClient, loopAddress, currentPeriod, loopAbi, calculateNextPeriodStart]);

  return { nextPeriodStart, loading };
}
