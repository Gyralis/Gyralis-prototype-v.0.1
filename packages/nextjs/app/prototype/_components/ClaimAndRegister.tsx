"use client";

import React, { useEffect, useState } from "react";
import { Address, stringify } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import * as abis from "~~/contracts/deployedContracts";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { THRESHOLD } from "~~/utils/loop";

//test params
const LOOP_ADDRESS = "0xED179b78D5781f93eb169730D8ad1bE7313123F4";
const CHAIN_ID = 31337;

type SubmitPassportResponse = {
  data: any;
  error: boolean;
};

export const ClaimAndRegister: React.FC = () => {
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isEligible, setIsElegible] = useState<boolean>(false);
  const [signature, setSignature] = useState<string | null>(null);

  const { data, error, isPending, isError, writeContract } = useWriteContract();
  const { data: receipt, isLoading, isSuccess } = useWaitForTransactionReceipt({ hash: data });

  //
  const abi = abis?.default?.["31337"]?.loop?.abi;

  console.log(abi);
  //

  const { address } = useAccount();
  const { writeContractAsync: writeLoopContractAsync, isMining } = useScaffoldWriteContract("loop");

  // console.log(isMining, isSuccess);

  // console.log(isError && "Checking error...", error);

  // console.log("Threshold...", THRESHOLD);
  // console.log("Connected Address...", address);
  // console.log({ isSubmitting, hasSubmitted, isEligible });

  useEffect(() => {
    if (address) {
      handleFetchScore();
      //checkEligibility()
      //handleSubmitPassport(address);
    }
  }, [address]);



  const writeInContract = async (signature: `0x${string}` | undefined) => {
    try {
      await writeLoopContractAsync({
        functionName: "claimAndRegister",
        args: [signature],
      });
    } catch (e) {
      console.error("Error claim&Register:", e);
    }
  }

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
          setSignature(data.signature);
          
          writeInContract(data.signature);
          console.log(receipt);
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

      <br />
      <button className="btn btn-circle"  onClick={() => address && checkEligibility(address, LOOP_ADDRESS, CHAIN_ID)}>Check eligibility</button>
      <br />
      {/* <div>{hasSubmitted ? <p>You have already submitted your passport</p> : <p>submit fish!</p>}</div> */}
      <br />
      <div>
        <div>
          {/* <button
            disabled={isPending}
            className="btn btn-primary"
            onClick={() =>
              writeContract({
                address: LOOP_ADDRESS,
                abi: abi,
                functionName: "claimAndRegister",
                args: [(signature as `0x${string}`) || "0x"],
                chainId: CHAIN_ID,
              })
            }
          >
            Claim and Register 2
          </button> */}
        </div>
        {isPending && <div>Pending...</div>}
        {isSuccess && (
          <>
            Transaction Hash: {data}
            <div>
              Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
            </div>
          </>
        )}
        {isError && <div>{error?.message}</div>}
      </div>
      {/* <button
        className="btn btn-primary"
        onClick={async () => {
          try {
            await writeLoopContractAsync({
              functionName: "claimAndRegister",
              args: [
                signature as `0x${string}` || "0x",
              ],
            });
          } catch (e) {
            console.error("Error claim&Register:", e);
          }
        }}
      >
        claim & Register
      </button> */}
    </div>
  );
};
