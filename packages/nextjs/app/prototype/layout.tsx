"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowPathIcon, CheckCircleIcon, ClockIcon, LinkIcon, ShieldCheckIcon } from "@heroicons/react/20/solid";
import GyralisLogo from "~~/components/assets/GyralisLogo.svg";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

export default function GyralisUI() {
  // Countdown timer state and logic
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30,
  });

  // Button state logic
  const [buttonState, setButtonState] = useState("register"); // Possible states: register, claim, ok
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newSeconds = prevTime.seconds - 1;
        const newMinutes = newSeconds < 0 ? prevTime.minutes - 1 : prevTime.minutes;
        const newHours = newMinutes < 0 ? prevTime.hours - 1 : prevTime.hours;

        return {
          hours: newHours < 0 ? 0 : newHours,
          minutes: newMinutes < 0 ? 59 : newMinutes,
          seconds: newSeconds < 0 ? 59 : newSeconds,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Example condition: When timer reaches certain thresholds, change button state
  useEffect(() => {
    // This is just an example condition - you can replace with your actual logic
    if (timeLeft.hours === 0 && timeLeft.minutes < 45 && !isRegistered) {
      setButtonState("register");
    } else if (isRegistered && !hasClaimed && timeLeft.minutes < 30) {
      setButtonState("claim");
    } else if (hasClaimed) {
      setButtonState("ok");
    }
  }, [timeLeft, isRegistered, hasClaimed]);

  const handleButtonClick = () => {
    // Cycle through states when clicked
    if (buttonState === "register") {
      setButtonState("claim");
      setIsRegistered(true);
    } else if (buttonState === "claim") {
      setButtonState("ok");
      setHasClaimed(true);
    } else {
      // Reset the cycle
      setButtonState("register");
      setIsRegistered(false);
      setHasClaimed(false);
    }
  };

  // Get button text and style based on state
  const getButtonConfig = () => {
    switch (buttonState) {
      case "register":
        return {
          text: "Register",
          bgColor: "bg-[#f7cd6f]",
          textColor: "text-black",
        };
      case "claim":
        return {
          text: "Claim",
          bgColor: "bg-[#0065BD]",
          textColor: "text-white",
        };
      case "ok":
        return {
          text: "Ok",
          bgColor: "bg-[#16a34a]",
          textColor: "text-white",
        };
      default:
        return {
          text: "Register",
          bgColor: "bg-[#f7cd6f]",
          textColor: "text-black",
        };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="min-h-screen bg-white text-black relative ">
      {/* Navigation Bar */}
      <header className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 my-6 rounded-lg shadow-md">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
          <div className="flex items-center gap-2">
            <Image src={GyralisLogo} alt="Gyralis Logo" width={40} height={40} />
            <span className="text-2xl ">Gyralis</span>
          </div>

          <div className="block sm:hidden">
            <button className="text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <nav className="hidden sm:flex items-center justify-center ml-0 sm:ml-8 space-x-6 md:space-x-14 mt-4 sm:mt-0 w-full">
          <div className="relative font-medium text-gray-600 hover:text-black whitespace-nowrap">
            Custom Loops
            <span className="absolute -top-4 -right-8 text-xs bg-[#e2e8ed] px-1.5 py-0.5 rounded-full">Soon</span>
          </div>
          <div className="relative font-medium text-gray-600 hover:text-black whitespace-nowrap">
            Organizations Profile
            <span className="absolute -top-4 -right-8 text-xs bg-[#e2e8ed] px-1.5 py-0.5 rounded-full">Soon</span>
          </div>
          <div className="relative font-medium text-gray-600 hover:text-black whitespace-nowrap">
            Tokenomics
            <span className="absolute -top-4 -right-8 text-xs bg-[#e2e8ed] px-1.5 py-0.5 rounded-full">Soon</span>
          </div>
        </nav>

        <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end">
          <RainbowKitCustomConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-2 sm:p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6  ">
        {/* Left Section - 1HIVE LOOP */}
        <div className="bg-[#0065bd] text-white p-4 sm:p-8 rounded-xl  overflow-hidden">
          {/* <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=600')] opacity-10 bg-right-bottom bg-no-repeat"></div> */}
          <div className="relative z-10">
            <p className="text-[#f7cd6f] mb-1">CLAIM TOKENS EVERY DAY</p>
            <h1 className="text-[#f7cd6f] text-4xl sm:text-5xl font-bold mb-2 sm:mb-4">1HIVE LOOP</h1>

            <p className="mb-2 sm:mb-4 text-gray-100 text-sm sm:text-base">
              Join the 1Hive community in Gardens-V2 and earn{" "}
              <span className="bg-[#f7cd6f] text-black font-semibold px-2 py-0.5 rounded">HNY</span> tokens through
              consistent daily participation.
            </p>

            <div className="mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">To claim:</h3>

              <div className="space-y-4">
                <div className="bg-[#629fd3]/20 p-3 rounded-lg border-l-4 border-[#f7cd6f]">
                  <div className="flex items-start gap-3">
                    <ShieldCheckIcon className="h-14 w-14 text-[#f7cd6f] " />
                    <div>
                      <h4 className="font-semibold text-[#f7cd6f] mb-1">Pass Loop Shield - Be Eligible</h4>
                      <p className="text-sm text-gray-100">
                        Verify your identity with a Passport score of 15+ to qualify for registration. This anti-Sybil
                        ensures fair token distribution among genuine community members. Be sure to maintain your
                        eligibility by meeting the required criteria.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#629fd3]/20 p-3 rounded-lg border-l-4 border-[#f7cd6f]">
                  <div className="flex items-start gap-3">
                    <ClockIcon className="h-10 w-10 text-[#f7cd6f] " />
                    <div>
                      <h4 className="font-semibold text-[#f7cd6f] mb-1">Daily Claim</h4>
                      <p className="text-sm text-gray-100">
                        Sign a transaction once per distribution period (currently 24hs for demo). Each claim earns you
                        a share of the 10% token distribution for that period.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#629fd3]/20 p-3 rounded-lg border-l-4 border-[#f7cd6f]">
                  <div className="flex items-start gap-3">
                    <ArrowPathIcon className="h-10 w-10 text-[#f7cd6f] " />
                    <div>
                      <h4 className="font-semibold text-[#f7cd6f] mb-1">Maintain Eligibility</h4>
                      <p className="text-sm text-gray-100">
                        Never miss a claim period! If you fail to claim within any distribution period you'll need to
                        re-register to participate again. Stay as a 1hive member to claim your rewards!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Use apps to earn SUP */}
        <div className="bg-gray-100 rounded-xl p-4 sm:p-8 flex flex-col justify-between  sticky top-8">
          <div>
            <div className="max-w-md lg:max-w-lg mx-auto text-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-center">
                Use Gyralis in your organization
              </h2>
              <p className="text-center font-medium text-sm sm:text-base">
                Create custom Loops to reward your community and align incentives with your goals.
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <div className="bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                <span className="text-sm font-medium text-[#0065BD]">
                  Period length: <span className="text-[#f7cd6f]">3min</span>
                </span>
              </div>
              <div className="bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                <span className="text-sm font-medium text-[#0065BD]">
                  Period distribution: <span className="text-[#f7cd6f]">10%</span>
                </span>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="text-center mb-4">
            <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#0065BD]">800</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-medium text-[#f7cd6f]">HNY</div>
          </div>

          {/* Countdown Timer */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 mb-2">Next distribution in:</p>
            <div className="flex justify-center gap-2 sm:gap-4">
              <div className="bg-[#0065BD] text-white rounded-lg p-2 sm:p-3 w-16 sm:w-20">
                <div className="text-xl sm:text-2xl font-bold">{timeLeft.hours.toString().padStart(2, "0")}</div>
                <div className="text-xs text-gray-300">Hours</div>
              </div>
              <div className="bg-[#0065BD] text-white rounded-lg p-2 sm:p-3 w-16 sm:w-20">
                <div className="text-xl sm:text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, "0")}</div>
                <div className="text-xs text-gray-300">Minutes</div>
              </div>
              <div className="bg-[#0065BD] text-white rounded-lg p-2 sm:p-3 w-16 sm:w-20">
                <div className="text-xl sm:text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, "0")}</div>
                <div className="text-xs text-gray-300">Seconds</div>
              </div>
            </div>
          </div>

          {/* Status message based on button state */}
          {buttonState === "claim" && (
            <div className="text-center mb-4 text-sm text-[#0065BD] bg-[#0065BD]/10 p-2 rounded-lg">
              You are registered! You can now claim your tokens.
            </div>
          )}
          {buttonState === "ok" && (
            <div className="text-center mb-4 text-sm text-green-600 bg-green-100 p-2 rounded-lg">
              Tokens claimed successfully! Check back tomorrow.
            </div>
          )}

          <div className="mt-auto">
            <button
              onClick={handleButtonClick}
              className={`w-full ${buttonConfig.bgColor} ${buttonConfig.textColor} py-3 sm:py-4 rounded-full font-medium text-lg transition-all duration-300 text-center`}
            >
              {buttonConfig.text}
            </button>

            {/* Helper text */}
            <p className="text-xs text-center text-gray-500 mt-2">
              {buttonState === "register" && "Register to start claiming tokens"}
              {buttonState === "claim" && "Claim your tokens for this period"}
              {buttonState === "ok" && "You've claimed your tokens for today"}
            </p>
          </div>
        </div>

        {/* Bottom Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6  w-full">
          {/* LOOP SHIELD Card */}
          <div className="bg-[#0065BD] text-white p-4 sm:p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-4 left-4">
              <CheckCircleIcon className="h-6 w-6 text-[#f7cd6f]" />
            </div>
            <div className="text-center pt-8">
              <h3 className="text-xl sm:text-2xl font-bold text-[#f7cd6f] mb-4">LOOP SHIELD: GITCOIN PASSPORT</h3>
              <div className="space-y-2">
                <p className="text-gray-100">
                  Min score required: <span className="font-semibold text-white">15</span>
                </p>
                <p className="text-gray-100">
                  Your Score: <span className="font-semibold text-[#f7cd6f]">20</span>
                </p>
              </div>
            </div>
          </div>

          {/* ELIGIBILITY Card */}
          <div className="bg-[#0065BD] text-white p-4 sm:p-6 rounded-xl relative overflow-hidden">
            <div className="text-center py-8">
              <h3 className="text-xl sm:text-2xl font-bold text-[#f7cd6f] mb-6">ELIGIBILITY CRITERIA:</h3>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://app.gardens.fund/gardens/100/0x71850b7e9ee3f13ab46d67167341e4bdc905eef9/0xe2396fe2169ca026962971d3b2e373ba925b6257"
                className="inline-flex items-center gap-2 bg-[#f7cd6f]/20 hover:bg-[#f7cd6f]/30 text-[#f7cd6f] px-4 py-3 rounded-lg transition-colors"
              >
                1hive members eligibility criteria
                <LinkIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
