import { useScaffoldContract } from "~~/hooks/scaffold-eth"; // Adjust import according to your project
import { useWalletClient } from "wagmi"; // Import necessary hooks from wagmi

// Function to get User Status
// export function useUserStatus(fid: number) {
//   // Destructure the contract using useScaffoldContract hook
//   const { data: contract } = useScaffoldContract({
//     contractName: "YourContract", // Replace with your actual contract name
//   });

//   const { data: walletClient } = useWalletClient(); // Get walletClient for transactions, if needed

//   const getUserStatus = async () => {
//     if (!contract) return;

//     const [currentPeriod, [registeredClaimPeriod, latestClaimPeriod]] = await Promise.all([
//       contract.read.getCurrentPeriod(),
//       contract.read.claimers([BigInt(fid)]),
//     ]);

//     const registeredNextPeriod = registeredClaimPeriod === currentPeriod + 1n;

//     return {
//       canClaim: latestClaimPeriod < currentPeriod && registeredClaimPeriod === currentPeriod,
//       registeredNextPeriod: registeredNextPeriod,
//     };
//   };

//   return { getUserStatus };
// }

// Function to get the Next Period Start


// Function to get the Current Period Payout
// export function useCurrentPeriodPayout() {
//   const { data: contract } = useScaffoldContract({
//     contractName: "loop", // Replace with your actual contract name
//   });

//   const getCurrentPeriodPayout = async () => {
//     if (!contract) return;

//     const currentPeriod = await contract.read.getCurrentPeriod();

//     return contract.read.getPeriodIndividualPayout([currentPeriod]);
//   };

//   return { getCurrentPeriodPayout };
// }
