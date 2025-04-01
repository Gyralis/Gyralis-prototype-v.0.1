"use client";

import React, { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useBalance, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import * as abis from "~~/contracts/deployedContracts";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";
import { useLoopDataGlobal } from "~~/hooks/useLoopDataGlobal";
import { useRegisteredUsers } from "~~/hooks/useRegisteredUsers";
import { THRESHOLD } from "~~/utils/loop";

const LOOP_ADDRESS = "0xED179b78D5781f93eb169730D8ad1bE7313123F4";
const TOKEN_ADDRESS = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";
const CHAIN_ID = 31337;

export const ClaimAndRegister: React.FC = () => {
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const { address: connectedAccount } = useAccount();

  const { data: conectedAccountBalance } = useBalance({
    address: connectedAccount,
    token: TOKEN_ADDRESS as `0x${string}` | undefined,
    chainId: CHAIN_ID,
  });

  const { data: loopBalance, refetch: fetchLoopBalance } = useBalance({
    address: LOOP_ADDRESS,
    token: TOKEN_ADDRESS as `0x${string}` | undefined,
    chainId: CHAIN_ID,
  });

  const { writeContractAsync: writeLoopContractAsync, isMining, status, isSuccess  } = useScaffoldWriteContract("loop");

  console.log("status", status);

  console.log(isSuccess);

  console.log("isMining", isMining);

  const { users: registeredUsers, loading: usersLoading } = useRegisteredUsers(LOOP_ADDRESS);

  // const {data} = useLoopDataGlobal(LOOP_ADDRESS);

  // console.log("latestHookData", data );

  console.log("registeredUsers:", registeredUsers);

  const handleFetchScore = async () => {
    setLoading(true);
    if (!connectedAccount) return;

    try {
      const response = await fetch(`/api/passport/${connectedAccount.toLowerCase()}`, { method: "GET" });
      if (!response.ok) {
        if (response.status === 400) {
          setHasSubmitted(false);
        } else {
          throw new Error("Failed to fetch score");
        }
      } else {
        const data = await response.json();
        const numericScore = Number(data.score);
        if (numericScore > 0) {
          setScore(numericScore);
          setHasSubmitted(true);
        } else {
          setScore(0);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
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
      if (!response.ok) throw new Error("Submission failed");

      setHasSubmitted(true);
      handleFetchScore();
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  //onst currentPeriodPayout = useCurrentPeriodPayout();

  const writeInContract = async (signature: `0x${string}` | undefined) => {
    try {
      await writeLoopContractAsync({
        functionName: "claimAndRegister",
        args: [signature],
      });
    } catch (e) {
      console.error("Error claim&Register:", e);
    }
  };

  const claimAndRegister = async (userAddress: string, loopAddress: string, chainId: number) => {
    if (!userAddress || !loopAddress || !chainId) {
      console.error("Missing parameters...");
      return;
    }
    //First: we need to check if the user is eligible to claim or register
    try {
      const response = await fetch("/api/eligibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAddress,
          loopAddress,
          chainId,
        }),
      });

      // Check if the response is ok
      if (response.ok) {
        const data = await response.json();
        console.log("Eligibility check successful:", data);

        if (data.success) {
          console.log("Signature:", data.signature);
          writeInContract(data.signature);
        } else {
          console.error("Error:", data.error);
          // Show error message if eligibility check fails
        }
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        // Handle any error responses from the server
      }
    } catch (error) {
      console.error("Network error:", error);
      // Handle any network-related errors
    }
  };

  useEffect(() => {
    if (connectedAccount) handleFetchScore();
    fetchLoopBalance();
  }, [connectedAccount]);

  if (loading) return <div className="p-4">Loading...</div>;

  const canClaim = connectedAccount && registeredUsers.includes(connectedAccount);

  console.log("im rendering...");

  return (
    <div className="container p-6 mt-2 flex gap-2 flex-col shadow-md">
      <h2 className="text-xl py-1">Passport and Claim & Register</h2>

      {!hasSubmitted ? (
        <div>
          <p>Submit your passport to continue.</p>
          <button className="btn btn-secondary" onClick={handleSubmitPassport} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Passport"}
          </button>
        </div>
      ) : (
        <div>
          <p>
            Your score: <span className="font-bold">{score}</span>
          </p>
          {score !== null && score < THRESHOLD ? (
            <p className="text-red-500">Your score is too low to proceed.</p>
          ) : (
            <button
              className="btn btn-primary mt-2"
              onClick={() => connectedAccount && claimAndRegister(connectedAccount, LOOP_ADDRESS, CHAIN_ID)}
            >
              {canClaim ? "Claim" : "Register"}
            </button>
          )}
            <div>
          <h4>Transaction message to user:</h4>
            {isSuccess && canClaim && "You successfully claimed! X hny tokens and already registered for next period"} 
            {isSuccess && !canClaim && "Registered for next period!!"}
            {status === "error" && "Error in transaction"}
        </div>
          <div className="flex flex-col gap-1 mt-4">
            <p>Connected account: {connectedAccount}</p>
            <p>Connected account balance: {formatUnits(conectedAccountBalance?.value || 0n, 18)}</p>
            <p>Loop token balance: {formatUnits(loopBalance?.value || 0n, 18)}</p>
          </div>
        </div>
      )}
      <div>
        <h3 className="text-lg">Registered Users</h3>
        {usersLoading ? (
          <p>Loading registered users...</p>
        ) : (
          <ul className="list-disc pl-6">
            {registeredUsers.map((user, index) => (
              <li key={index} className="py-1">
                <Address address={user} onlyEnsOrAddress />
              </li>
            ))}
          </ul>
        )}
      
      </div>
    </div>
  );
};
