import { useEffect, useMemo, useState } from "react";
import { Address, parseAbiItem } from "viem";
import { useChainId, usePublicClient, useReadContract } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";


interface LoopDetails {
    token: Address;
    periodLength: number;
    percentPerPeriod: number;
    firstPeriodStart: bigint;
    // currentPeriod: number;
    // currentPeriodRegistrations: number;
    // maxPayout: number;
  }

export function useLoopDataGlobal(loopAddress: `0x${string}`) {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const [data, setData] = useState<LoopDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const loopAbi = useMemo(() => {
    return deployedContracts?.[chainId as keyof typeof deployedContracts]?.loop?.abi ?? [];
  }, [chainId]);

  const { data: currentPeriod } = useReadContract({
    address: loopAddress,
    abi: loopAbi,
    functionName: "getCurrentPeriod",
  });

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

        setData([{
            token: loopDetails[0],
            periodLength: Number(loopDetails[1]),
            percentPerPeriod: Number(loopDetails[2]),
            firstPeriodStart: loopDetails[3],
          }]);
      } catch (err) {
        console.error("Error fetching Register logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [publicClient, loopAddress, currentPeriod]);

  return { data, loading };
}
