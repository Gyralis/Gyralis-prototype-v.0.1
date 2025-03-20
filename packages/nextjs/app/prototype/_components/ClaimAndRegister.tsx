"use client";

import React, { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";
import { THRESHOLD } from "~~/utils/loop";

//test params
const LOOP_ADDRESS = "0xED179b78D5781f93eb169730D8ad1bE7313123F4";
const CHAIN_ID = 100;

type SubmitPassportResponse = {
  data: any;
  error: boolean;
};

export const ClaimAndRegister: React.FC = () => {
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isEligible, setIsElegible] = useState<boolean>(false);

  const { address } = useAccount();
  const {
    writeContractAsync: writeLoopContractAsync,
    isMining,
    isSuccess,
    error,
    isError,
  } = useScaffoldWriteContract("loop");

  console.log(isMining, isSuccess);

  console.log(isError && "Checking error...",  error);

  console.log("Threshold...", THRESHOLD);
  console.log("Connected Address...", address);
  console.log({ isSubmitting, hasSubmitted, isEligible });

  useEffect(() => {
    if (address) {
      handleFetchScore();
      //   checkEligibility()
      //handleSubmitPassport(address);
    }
  }, [address]);

  const checkEligibility = async (userAddress: string, loopAddress: string, chainId: number) => {
    if (!userAddress || !loopAddress || !chainId) {
      console.error("Missing parameters...");
      return;
    }
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

      if (response.ok) {
        const data = await response.json();
        setIsElegible(true);
        console.log("Eligibility check successful:", data);

        if (data.success) {
          console.log("Signature:", data.signature);
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

  const handleFetchScore = async () => {
    if (!address) {
      console.error("No wallet connected");
      return;
    }

    try {
      const response = await fetch(`/api/passport/${address.toLowerCase()}`, {
        method: "GET",
      });

      if (!response.ok) {
        if (response.status === 400) {
          console.log("No score available or invalid request.");
          setScore(0);
          setHasSubmitted(false);
          return;
        }
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      if (data.score !== undefined && data.score !== null) {
        const numericScore = Number(data.score); // Ensure it's a proper number
        if (numericScore <= 0) {
          // Includes 0, 0E-9, and negatives
          console.log("No score available");
          setScore(0);
        } else {
          console.log(`Score: ${numericScore}`);
          setScore(numericScore);
        }
        setHasSubmitted(true);
      } else {
        setScore(null); // No score found, need to submit
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleSubmitPassport = async (address: Address) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submit-passport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        setIsSubmitting(false);
        setHasSubmitted(false);
        return {
          error: true,
          data: response,
        };
      }
      //cuando el usuario hace submit y no tiene score - me devuelve un 400
      //score 0
      const data = await response.json();
      setHasSubmitted(true);
      setIsSubmitting(false);
      return { error: false, data };
    } catch (err) {
      return {
        error: true,
        data: err,
      };
    }
  };

  return (
    <div>
      {/* Pr */}
      <h2>Claim and Register</h2>

      <div>
        <div>
          {/* Primer render  */}
          <p>Your score: {score}</p>
        </div>

        <div>
          <br />
          <button onClick={() => address && handleSubmitPassport(address)} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Passport"}
          </button>
        </div>
      </div>
      <br />
      <button onClick={() => address && checkEligibility(address, LOOP_ADDRESS, CHAIN_ID)}>Check eligibility</button>
      <br />
      {/* <div>{hasSubmitted ? <p>You have already submitted your passport</p> : <p>submit fish!</p>}</div> */}
      <br />
      <button
        className="btn btn-primary"
        onClick={async () => {
          try {
            await writeLoopContractAsync({
              functionName: "claimAndRegister",
              args: [
                "0x34edb21f1f18b3ef7123c7475244be860f7f5e1944e0643136392e5c3c1748ad028742a9bdc3d5e542d7923130fb0eec54713241dda2f583cc695ab22d5548491b",
              ],
            });
          } catch (e) {
            console.error("Error claim&Register:", e);
          }
        }}
      >
        claim & Register
      </button>
    </div>
  );
};
