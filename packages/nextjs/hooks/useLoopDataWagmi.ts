import { useEffect, useMemo, useState } from "react";
import { useChainId, usePublicClient, useReadContract } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";


interface LoopData {
  // token: Address;
  periodLength: number;
  distributionPerPeriod: number;
  // firstPeriodStart: bigint;
  // currentPeriod: number;
  // currentPeriodRegistrations: number;
  // maxPayout: number;
}

// useLoopDataWagmi
export function useLoopDataWagmi(loopAddress: `0x${string}`) {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const [loopData, setLoopData] = useState<LoopData[]>([]);
  

  const loopAbi = useMemo(() => {
    return deployedContracts?.[chainId as keyof typeof deployedContracts]?.loop?.abi ?? [];
  }, [chainId]);

  const { data: getCurrentPeriodData, isLoading } = useReadContract({
    address: loopAddress,
    abi: loopAbi,
    chainId: chainId,
    functionName: "getLoopDetails",

  });

  useEffect(() => {
    const updateLoopDetails = () => {
      if (!getCurrentPeriodData) return;
      
      setLoopData([
        {
          periodLength: Number(getCurrentPeriodData[1]),
          distributionPerPeriod: Number(getCurrentPeriodData[2]),
        },
      ]);
    };

    updateLoopDetails();
  }, []);

  return { loopData, isLoading };
}
