"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAccount, useTransactionConfirmations, useWaitForTransactionReceipt } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";
import { useRegisteredUsers } from "~~/hooks/useRegisteredUsers";

const LOOP_ADDRESS = "0xED179b78D5781f93eb169730D8ad1bE7313123F4";
const CHAIN_ID = 31337;

type ClaimAndRegisterProps = {
  refecthLoopBalance: () => void;
  score: number | null;
};

type ButtonState = "register" | "claim" | "ok";

export const ClaimAndRegister = ({ refecthLoopBalance, score }: ClaimAndRegisterProps) => {
  const [buttonState, setButtonState] = useState<ButtonState>("register");
  const [checkEligibility, setCheckEligibility] = useState(false);

  const { address: connectedAccount } = useAccount();

  const { data: checkClaimer, isLoading: isLoadingDetails } = useScaffoldReadContract({
    contractName: "loop",
    functionName: "getClaimerStatus",
    args: [connectedAccount], // Disable auto-watch, we'll manually refetch
    watch: false,
  });
  const { data } = useScaffoldReadContract({
    contractName: "loop",
    functionName: "isUserRegisteredForCurrentPeriod",
    args: [connectedAccount],   
  });
 



  console.log("isRegistered:", data);


  const {
    data: contractData,
    writeContractAsync: writeLoopContractAsync,
    status,
    reset,
  } = useScaffoldWriteContract("loop");

  const { users } = useRegisteredUsers(LOOP_ADDRESS);


  const transactionConfirmation = useTransactionConfirmations({
    hash: contractData as `0x${string}` | undefined,
  });

  const { data: Txresult, status: waitTransactionStatus } = useWaitForTransactionReceipt({
    hash: contractData as `0x${string}` | undefined,
  });

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
    setCheckEligibility(true);
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
          setCheckEligibility(false);
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

  const canClaim =
    connectedAccount && score !== null && score >= 15 && users.includes(connectedAccount) ? true : undefined;

  const getButtonConfig = () => {
    switch (buttonState) {
      case "register":
        return { text: "register", bgColor: "bg-[#f7cd6f]", textColor: "text-black" };
      case "claim":
        return { text: "claim", bgColor: "bg-[#0065BD]", textColor: "text-white" };
      case "ok":
        return { text: "Ok", bgColor: "bg-[#16a34a]", textColor: "text-white" };
      default:
        return { text: "register", bgColor: "bg-[#f7cd6f]", textColor: "text-black" };
    }
  };

  useEffect(() => {
    if (Txresult?.status === "success") {
      setButtonState("ok");
    } else if (canClaim) {
      setButtonState("claim");
    } else {
      setButtonState("register");
    }
  }, [Txresult, canClaim]);

  const handleButtonClick = () => {
    if (buttonState === "ok") {
      reset();
      refecthLoopBalance();
      setButtonState("register"); // optional: force fallback
    } else {
      claimAndRegister();
    }
  };

  const buttonConfig = getButtonConfig();

  // if (loading) return <div className="p-4 text-center">Loading data...</div>;

  return (
    <>
      <div className="p-4">
        {connectedAccount && <ClaimStatusMessage state={buttonState} canClaim={canClaim ?? false} />}

        <button
          disabled={!connectedAccount || score === null || score < 15}
          onClick={handleButtonClick}
          className={`border-none hover:opacity-90 w-full py-4 px-8 rounded-full text-center font-semibold first-letter:uppercase disabled:cursor-not-allowed disabled:bg-gray-500 ${buttonConfig.bgColor} ${buttonConfig.textColor} `}
        >
          {status === "pending" || checkEligibility ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            buttonConfig.text
          )}
        </button>
      </div>
    </>
  );
};

type ClaimStatusMessageProps = {
  state: ButtonState;
  canClaim: boolean;
};

export const ClaimStatusMessage = ({ state, canClaim }: ClaimStatusMessageProps) => {
  const getMessage = () => {
    if (state === "register") {
      return {
        key: "register",
        // text: "🚀 You’re not in the loop yet. Register now and start your daily claiming!",
        text: "🚀 Register now and start your daily claiming!",
        className: "text-yellow-700 bg-yellow-100",
      };
    }

    if (state === "claim") {
      return {
        key: "claim",
        text: "🔥 You’re in the loop! Your tokens are ready to claim.",
        className: "text-[#0065BD] bg-[#0065BD]/10",
      };
    }

    if (state === "ok") {
      if (canClaim) {
        return {
          key: "ok-claim",
          text: "✅ Claimed! You’re still in the loop. Come back tomorrow for more tokens.",
          className: "text-green-600 bg-green-100",
        };
      } else {
        return {
          key: "ok-done",
          text: "✅ You’re locked in for the next period!. Loop continues — see you tomorrow.",
          className: "text-green-600 bg-green-100",
        };
      }
    }

    return null;
  };

  const message = getMessage();

  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          key={message.key}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className={`text-center mb-4 text-sm p-2 rounded-lg ${message.className}`}
        >
          <span className="first-letter:uppercase text-sm">{message.text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
