import { useEffect, useMemo, useState } from "react";
import { parseAbiItem } from "viem";
import { useChainId, usePublicClient, useReadContract } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";

const registerEventAbiItem = parseAbiItem("event Register(address indexed sender, uint256 indexed periodNumber)");

export function useRegisteredUsers(loopAddress: `0x${string}`) {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const [users, setUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loopAbi = useMemo(() => {
    return deployedContracts?.[chainId as keyof typeof deployedContracts]?.loop?.abi ?? [];
  }, [chainId]);

  const { data: currentPeriod} = useReadContract({
    address: loopAddress,
    abi: loopAbi,
    functionName: "getCurrentPeriod",  
  });

  useEffect(() => {
    if (!publicClient || currentPeriod === undefined) return;

    const fetchLogs = async () => {
      setLoading(true);
      try {
        const logs = await publicClient.getLogs({
          address: loopAddress,
          event: registerEventAbiItem,
          args: {
            periodNumber: currentPeriod,
          },
          fromBlock: 0n,
          toBlock: "latest",
        });

        const registered = logs.map(log => log.args?.sender as string);
        setUsers([...new Set(registered)]);
      } catch (err) {
        console.error("Error fetching Register logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [publicClient, loopAddress, currentPeriod]);

  return { users, loading };
}
