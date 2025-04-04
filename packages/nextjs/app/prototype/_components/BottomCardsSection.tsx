import React from "react";
import { CheckCircleIcon, LinkIcon } from "@heroicons/react/20/solid";

const BottomCardsSection: React.FC = () => {
  return (
    <section>
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
    </section>
  );
};

export default BottomCardsSection;
