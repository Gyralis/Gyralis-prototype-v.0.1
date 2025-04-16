import React from "react";
import { ArrowPathIcon, ClockIcon, ShieldCheckIcon } from "@heroicons/react/20/solid";

const InfoSection: React.FC = () => {
  return (
    <section className="bg-[#0065bd] text-white p-4 sm:p-8 rounded-xl overflow-hidden">
      {/* <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=600')] opacity-10 bg-right-bottom bg-no-repeat"></div> */}
      <div className="relative z-10">
        <p className="text-[#f7cd6f] mb-1">CLAIM TOKENS EVERY DAY</p>
        <h1 className="text-[#f7cd6f] text-4xl sm:text-5xl font-bold mb-2 sm:mb-4">1HIVE LOOP</h1>

        <p className="mb-2 sm:mb-4 text-gray-100 text-sm sm:text-base">
          Join the 1Hive community in Gardens-V2 and earn{" "}
          <span className="bg-[#f7cd6f] text-black font-semibold px-2 py-0.5 rounded">HNY</span> tokens through
          consistent daily participation.
        </p>

        <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">To claim:</h3>

        <div className="space-y-4">
          <div className="bg-[#629fd3]/20 p-3 rounded-lg border-l-4 border-[#f7cd6f]">
            <div className="flex items-start gap-3">
              <ShieldCheckIcon className="h-10 w-10 text-[#f7cd6f] " />
              <div>
                <h4 className="font-semibold text-[#f7cd6f] mb-1">Pass Loop Shield And Be Eligible</h4>
                <p className="text-sm text-gray-100">
                  Verify your identity with a Passport score of 15+ to qualify for registration. Additionally, maintain
                  active membership in the 1Hive community within Gardens V2 to qualify for daily claims.​
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
                  Sign a transaction once per distribution period (currently 24hs for demo). Each claim earns you a
                  share of the 10% token distribution for that period.
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
                  Consistent participation is key. Missing a claim during any distribution period will require
                  re-registration to resume participation. Ensure your ongoing status as a 1Hive member to continue
                  claiming rewards
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
