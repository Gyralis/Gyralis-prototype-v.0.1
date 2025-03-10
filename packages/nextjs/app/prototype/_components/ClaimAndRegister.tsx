"use client";

import React, { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";

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
  const [isEligible, setIsElegible] =  useState<boolean>(false);
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      handleFetchScore();
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
        setIsElegible(true)
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
          // If status is 400, handle as "no score" or malformed request
          console.log("No score available or invalid request.");
          setScore(0); // This is where you decide what to do with 400
          return;
        }
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      if (data.score) {
        setScore(data.score);
        setHasSubmitted(true); // Passport is submitted, so score is available
      } else {
        setScore(null); // No score found, need to submit
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleSubmitPassport = async (address: Address) => {
    try {
      const response = await fetch("/api/passport/submit-passport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        return {
          error: true,
          data: response,
        };
      }

      const data = await response.json();

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
      <h1>Claim and Register</h1>

      <div>
        <div>
          <p>Your score: {score}</p>
          {/* You can add your actions here now that the score is valid */}
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
    </div>
  );
};
