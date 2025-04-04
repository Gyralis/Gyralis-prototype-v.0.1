"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useTransactionConfirmations, useWaitForTransactionReceipt } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";
import { useRegisteredUsers } from "~~/hooks/useRegisteredUsers";

const LOOP_ADDRESS = "0xED179b78D5781f93eb169730D8ad1bE7313123F4";
const CHAIN_ID = 31337;

export const ClaimAndRegister = () => {
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [buttonState, setButtonState] = useState("register");
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);

  const { address: connectedAccount } = useAccount();

  const {
    data: contractData,
    writeContractAsync: writeLoopContractAsync,
    isSuccess,
    status,
    reset
  } = useScaffoldWriteContract("loop");

  const { users } = useRegisteredUsers(LOOP_ADDRESS);

  console.log(users);

  const transactionConfirmation = useTransactionConfirmations({
    hash: contractData as `0x${string}` | undefined,
  });

  const Txresult = useWaitForTransactionReceipt({
    hash: contractData as `0x${string}` | undefined,
  });

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

  const claimAndRegister = async () => {
    if (!connectedAccount || !LOOP_ADDRESS || !CHAIN_ID) {
      console.error("Missing parameters...");
      return;
    }
    setIsOpen(true);
    try {
      const response = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAddress: connectedAccount,
          loopAddress: LOOP_ADDRESS,
          chainId: CHAIN_ID,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          writeInContract(data.signature);
        } else {
          console.error("Error:", data.error);
        }
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    if (connectedAccount) handleFetchScore();
  }, [connectedAccount]);

  const canClaim = connectedAccount && score !== null && score >= 15 && users.includes(connectedAccount);

  console.log(canClaim);

  const getButtonConfig = () => {
    switch (buttonState) {
      case "register":
        return { text: "Register", bgColor: "bg-[#f7cd6f]", textColor: "text-black" };
      case "claim":
        return { text: "Claim", bgColor: "bg-[#0065BD]", textColor: "text-white" };
      case "ok":
        return { text: "Ok", bgColor: "bg-[#16a34a]", textColor: "text-white" };
      default:
        return { text: "Register", bgColor: "bg-[#f7cd6f]", textColor: "text-black" };
    }
  };

  useEffect(() => {
   
    if (canClaim) {
      setButtonState("claim");
    }
    if (Txresult?.status === "success" && canClaim) {
      setButtonState("ok");
    }
    getButtonConfig();
  }, [canClaim, Txresult]);


  console.log(buttonState);

 
  const buttonConfig = getButtonConfig();

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <>
      <div className="p-4">
        {buttonState === "claim" && (
          <div className="text-center mb-4 text-sm text-[#0065BD] bg-[#0065BD]/10 p-2 rounded-lg">
            You are registered for next Period! You can now claim your tokens.
          </div>
        )}
        {buttonState === "ok" && (
          <div className="text-center mb-4 text-sm text-green-600 bg-green-100 p-2 rounded-lg">
            Tokens claimed successfully! Check back tomorrow.
          </div>
        )}
        <button
          onClick={buttonState === "ok" ? reset : claimAndRegister}
          className={`btn btn-primary w-full py-4 px-8 rounded-full text-center ${buttonConfig.bgColor} ${buttonConfig.textColor} font-semibold`}
        >
          {buttonConfig.text}
        </button>
      </div>
    </>
  );
};
