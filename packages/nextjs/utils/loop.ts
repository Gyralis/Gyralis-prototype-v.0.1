import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { useWalletClient } from "wagmi"; 
import * as deployedContracts  from "~~/contracts/deployedContracts";
import { useMemo } from "react";

const CONTRACT_ADDRESS = "0xED179b78D5781f93eb169730D8ad1bE7313123F4";
const CHAIN_ID = 31337 // Replace with your actual cont address

// const loopAbi = useMemo(() => {
//     return deployedContracts?.[chainId as keyof typeof deployedContracts]?.loop?.abi ?? [];
//   }, [chainId]);

export const THRESHOLD = 15

// export async function getNextPeriodStart() {
//     const [firstPeriodStart, periodLength, currentPeriod] = await Promise.all([
//       contract.read.firstPeriodStart(),
//       contract.read.periodLength(),
//       contract.read.getCurrentPeriod(),
//     ])
  
//     return firstPeriodStart + periodLength * (currentPeriod + 1n)
//   }


