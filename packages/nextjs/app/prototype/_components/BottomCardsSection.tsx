"use client";

import React from "react";
import { CheckCircleIcon, LinkIcon } from "@heroicons/react/20/solid";

type BottomCardsSectionProps = {
  score: number | null;
  hasSubmitted: boolean;
  loadingScore: boolean;
  isSubmitting: boolean;
  handleSubmit: () => void;
};

const BottomCardsSection = ({ score, hasSubmitted, loadingScore, handleSubmit, isSubmitting }: BottomCardsSectionProps) => {
  return (
    <section>
      <div className="flex flex-col gap-4 sm:gap-6  w-full">
        {/* LOOP SHIELD Card */}
        <div className="bg-[#0065BD] text-white px-4 sm:py-6 rounded-xl relative overflow-hidden">
          {/* <div className="absolute top-4 left-4">
            <CheckCircleIcon className="h-6 w-6 text-[#f7cd6f]" />
          </div> */}
          <div className="">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-bold text-[#f7cd6f] mb-4">LOOP SHIELD:</h3>
              <h3 className="text-xl sm:text-xl font-bold text-[#f7cd6f] mb-4">GITCOIN PASSPORT</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-100 flex items-center gap-2">
                Min score required: <span className="font-semibold text-white text-lg">15</span>
              </p>
              {hasSubmitted ? (
                <p className="text-gray-100 flex items-center gap-2">
                  Your Score: <span className="font-semibold text-[#f7cd6f] text-lg">{score ?? "no score"}</span>
                </p>
              ) : (
                <p className="text-gray-100 flex items-center gap-2">
                 
                Your score:
                <button className={`${isSubmitting ? "loading loading-spinner" : "border-none hover:opacity-90 w-fit py-2 px-4 rounded-full text-center font-semibold text-sm text-black first-letter:uppercase disabled:cursor-not-allowed disabled:bg-gray-500 bg-[#f7cd6f]"} `} onClick={(handleSubmit)}>submit score</button>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ELIGIBILITY Card */}
        <div className="bg-[#0065BD] text-white px-4 sm:py-6 rounded-xl relative overflow-hidden">
          <div className="">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-bold text-[#f7cd6f] mb-4">ELIGIBILITY:</h3>
              <h3 className="text-xl sm:text-xl font-bold text-[#f7cd6f] mb-4">1HIVE MEMBER</h3>
            </div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.gardens.fund/gardens/100/0x71850b7e9ee3f13ab46d67167341e4bdc905eef9/0xe2396fe2169ca026962971d3b2e373ba925b6257"
              className="inline-flex items-center gap-2 bg-[#f7cd6f]/20 hover:bg-[#f7cd6f]/30 text-[#f7cd6f] px-4 py-3 rounded-lg transition-colors"
            >
              Register in 1hive Gardens V2
              <LinkIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BottomCardsSection;
