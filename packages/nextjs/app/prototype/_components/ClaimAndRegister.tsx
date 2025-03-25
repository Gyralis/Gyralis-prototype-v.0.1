"use client";

import React, { useEffect, useState } from "react";
import { Address, stringify, formatUnits } from "viem";
import { useAccount, useBalance, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import * as abis from "~~/contracts/deployedContracts";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";
import { THRESHOLD } from "~~/utils/loop";
import { useCurrentPeriodPayout } from "~~/utils/loop";

const LOOP_ADDRESS = "0xED179b78D5781f93eb169730D8ad1bE7313123F4";
const TOKEN_ADDRESS = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";
const CHAIN_ID = 31337;

export const ClaimAndRegister: React.FC = () => {
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const { address: connectedAccount } = useAccount();

  const { data: addressConnectedTokenBalance } = useBalance({
    address: connectedAccount,
    token: TOKEN_ADDRESS as `0x${string}` | undefined,
    chainId: CHAIN_ID,
  });

  const { data: loopTokenBalance } = useBalance({
    address: LOOP_ADDRESS,
    token: TOKEN_ADDRESS as `0x${string}` | undefined,
    chainId: CHAIN_ID,
  });


  const { writeContractAsync: writeLoopContractAsync, isMining } = useScaffoldWriteContract("loop");

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
  }, [connectedAccount]);

  if (loading) return <div className="p-4">Loading...</div>;

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
              Claim and Register
            </button>
          )}
          <div className="flex flex-col gap-1 mt-4">
            <p>Connected account: {connectedAccount}</p>
            <p>Connected account balance: {formatUnits(addressConnectedTokenBalance?.value || 0n, 18)}</p>
            <p>Loop token balance: {formatUnits(loopTokenBalance?.value || 0n, 18)}</p>
          </div>
        </div>
      )}
    </div>
  );
};
