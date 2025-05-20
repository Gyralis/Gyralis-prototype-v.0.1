"use client";

import React, { useEffect, useState } from "react";
import { ModalAnimated } from "./ModalAnimated";
import { AnimatePresence, motion } from "framer-motion";
import { formatUnits } from "viem";
import { useAccount, useChainId, useTransactionConfirmations } from "wagmi";
import { ChevronLeftIcon, ChevronRightIcon, EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";
import { useRegisteredUsers } from "~~/hooks/useRegisteredUsers";

type ClaimAndRegisterProps = {
  refecthLoopBalance: () => void;
  score: number | null;
  currentPeriod: number | undefined;
};

type ButtonState = "register" | "claim" | "ok";

export const ClaimAndRegister = ({ refecthLoopBalance, score, currentPeriod }: ClaimAndRegisterProps) => {
  const [buttonState, setButtonState] = useState<ButtonState>("register");
  const [openModal, setOpenModal] = useState(false);
  const [checkEligibility, setCheckEligibility] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectPeriod, setSelectPeriod] = useState({
    period: 0n as bigint,
    title: "current",
  });

  const { address: connectedAccount } = useAccount();
  const chainId = useChainId();

  const contract = deployedContracts[chainId as keyof typeof deployedContracts]?.["loop"];

  const { data: claimerStatus, refetch: refetchClaimerStatus } = useScaffoldReadContract({
    contractName: "loop",
    functionName: "getClaimerStatus",
    args: [connectedAccount],
    watch: false,
  });

  const { users: registeredUsers, loading: loadingUsers } = useRegisteredUsers(contract?.address, selectPeriod?.period);
  const { users: registeredUsersNextPeriod, loading: loadingUsersNextPeriod } = useRegisteredUsers(
    contract?.address,
    1n,
  );

  const { data: claimAmount } = useScaffoldReadContract({
    contractName: "loop",
    functionName: "getPeriodIndividualPayout",
    args: [currentPeriod !== undefined ? BigInt(currentPeriod) : undefined],
    watch: false,
  });

  const {
    data: contractData,
    writeContractAsync: writeLoopContractAsync,
    status,
    reset,
  } = useScaffoldWriteContract("loop");

  useEffect(() => {
    let prevPeriod: number | undefined;

    if (currentPeriod !== undefined && prevPeriod !== currentPeriod) {
      refetchClaimerStatus();
    }
  }, [currentPeriod]);

  const { users } = useRegisteredUsers(contract?.address);

  const transactionConfirmation = useTransactionConfirmations({
    hash: contractData as `0x${string}` | undefined,
  });
  const transactionConfirmed = transactionConfirmation?.status === "success";

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
    if (!connectedAccount || !contract?.address || !chainId) {
      console.error("Missing parameters...");
      setErrorMessage("Missing connection or contract details.");
      return;
    }

    setCheckEligibility(true);
    setErrorMessage(null); // clear previous error

    try {
      const response = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAddress: connectedAccount,
          loopAddress: contract?.address,
          chainId: chainId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorText = data?.error || "You’re not a registered 1Hive member.";
        console.error("Eligibility error:", errorText);
        setErrorMessage(errorText);
        setCheckEligibility(false);
        return;
      }

      // ✅ Eligible — continue
      setCheckEligibility(false);
      writeInContract(data.signature);
    } catch (error) {
      console.error("Network error:", error);
      setErrorMessage("Network error. Please try again.");
      setCheckEligibility(false);
    }
  };

  const canClaim =
    connectedAccount && score !== null && score >= 15 && users.includes(connectedAccount) ? true : undefined;

  const hasClaimedInCurrentPeriod = connectedAccount && claimerStatus !== undefined ? claimerStatus?.[1] : undefined;
  // const isRegisteredInCurrentPeriod = connectedAccount && claimerStatus !== undefined ? claimerStatus?.[0] : undefined;

  const updateSelectPeriod = (period: bigint, title: string, callback?: () => void) => {
    setSelectPeriod({ period, title });
    if (callback) callback();
  };

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
    if (transactionConfirmed) {
      setButtonState("ok");
    } else if (canClaim) {
      setButtonState("claim");
    } else {
      setButtonState("register");
    }
  }, [transactionConfirmed, canClaim]);

  const handleButtonClick = () => {
    if (buttonState === "ok") {
      reset();
      refecthLoopBalance();
      refetchClaimerStatus();
      setButtonState("register");
    } else {
      claimAndRegister();
    }
  };

  const buttonConfig = getButtonConfig();

  const scoreNotPassThreshold = score !== null && score < 15;

  const isRegisteredForNextPeriod = connectedAccount && registeredUsersNextPeriod.includes(connectedAccount);

  return (
    <>
      <div className="p-4">
        {connectedAccount && (
          <ClaimStatusMessage
            state={buttonState}
            canClaim={canClaim ?? false}
            hasClaimed={hasClaimedInCurrentPeriod ?? false}
            claimAmount={claimAmount}
          />
        )}

        <button
          disabled={
            !connectedAccount || hasClaimedInCurrentPeriod || scoreNotPassThreshold || isRegisteredForNextPeriod
          }
          onClick={handleButtonClick}
          className={`border-none hover:opacity-90 w-full py-4 px-8 rounded-full text-center font-semibold first-letter:uppercase disabled:cursor-not-allowed disabled:bg-gray-300 ${buttonConfig.bgColor} ${buttonConfig.textColor} `}
        >
          {status === "pending" || checkEligibility ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            buttonConfig.text
          )}
        </button>
        {scoreNotPassThreshold && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 text-center">
              You need a score of 15 or more to register. Your score: {score}
            </p>
          </div>
        )}
        {connectedAccount && isRegisteredForNextPeriod && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 text-center">You are registered. Claim next period!</p>
          </div>
        )}
        {hasClaimedInCurrentPeriod && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 text-center">You already claimed in this period.</p>
          </div>
        )}
        {errorMessage && (
          <div className="text-center mt-4 text-red-500 bg-red-100 p-2 rounded-lg text-sm">{errorMessage}</div>
        )}
        <div className="absolute bottom-2 left-0 text-[#0065BD] gap-2 flex items-center justify-center w-full">
          {/* <p className="text-xs">Check out registered users: </p> */}
          <button onClick={() => setOpenModal(true)} className="flex items-center gap-1 text-sm hover:opacity-90">
            Check out registered users: <EyeIcon className="w-4 h-4" />
          </button>
          <ModalAnimated isOpen={openModal} setIsOpen={setOpenModal}>
            <div
              className="flex
              items-center justify-between text-xs font-semibold text-[#0065BD] mb-6"
            >
              <div className="flex items-center gap-1">
                <h4>Registered:</h4>
                <h4>{registeredUsers?.length || 0}</h4>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateSelectPeriod(-1n, "Previous")}
                    disabled={selectPeriod.period === -1n}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <h5>Period: {selectPeriod.title}</h5>
                  <button
                    onClick={() =>
                      updateSelectPeriod(selectPeriod.period + 1n, selectPeriod.period == -1n ? "Current" : "Next")
                    }
                    disabled={selectPeriod.period === 1n}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <button
              className="absolute top-2 right-2"
              onClick={() => updateSelectPeriod(0n, "Current", () => setOpenModal(false))}
            >
              <XMarkIcon className="w-5 h-5 text-white hover:opacity-60" />
            </button>
            <div className="flex flex-col gap-2">
              {loadingUsers ? (
                <p className="text-sm text-gray-500 text-center">Loading...</p>
              ) : (
                registeredUsers?.map((user, index) => (
                  <div key={index} className="flex justify-between items-center gap-4">
                    <Address address={user as `0x${string}`} size="sm" onlyEnsOrAddress={true} />
                  </div>
                ))
              )}
            </div>
          </ModalAnimated>
        </div>
      </div>
    </>
  );
};

type ClaimStatusMessageProps = {
  state: ButtonState;
  canClaim: boolean;
  hasClaimed: boolean;
  claimAmount: bigint | undefined;
};

export const ClaimStatusMessage = ({ state, canClaim, hasClaimed, claimAmount }: ClaimStatusMessageProps) => {
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
        text: ` ${!hasClaimed ? "🔥 Claim your rewards and stay in the Loop!" : " You’re still in the loop!. Loop continues — see you tomorrow."} `,
        className: "text-[#0065BD] bg-[#0065BD]/10",
      };
    }

    if (state === "ok") {
      if (canClaim) {
        return {
          key: "ok-claim",
          text: `✅ You succesfully claimed ${Number(formatUnits(claimAmount || 0n, 18)).toFixed(2)} HNY tokens!`,
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

//not delete
// type ButtonTabsProps = {
//   updateSelectPeriod: (period: bigint, text: string) => void;
// };
// const ButtonTabs = ({ updateSelectPeriod }: ButtonTabsProps) => {
//   const [selected, setSelected] = useState(periodSelectionButtons[0].text);

//   return (
//     <div className="flex items-center flex-wrap justify-between">
//       {periodSelectionButtons.map(btn => {
//         const isActive = selected === btn.text;
//         return (
//           <button
//             key={btn.text}
//             onClick={() => updateSelectPeriod(btn.period, btn.text)}
//             className={`${
//               isActive
//                 ? "text-black font-bold"
//                 : "text-slate-300 hover:text-slate-200 hover:bg-slate-700 hover:rounded-full"
//             } text-xs transition-colors px-2 py-0.5 relative`}
//           >
//             <span className="relative z-10">{btn.text}</span>
//             {isActive && (
//               <motion.span
//                 layoutId="pill-btn"
//                 transition={{ type: "spring", duration: 0.5 }}
//                 className="absolute inset-0 z-0 bg-[#f7cd6f] rounded-full text-xs text-black"
//               />
//             )}
//           </button>
//         );
//       })}
//     </div>
//   );
// };
