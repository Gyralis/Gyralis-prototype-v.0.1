import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import GyralisLogo from "~~/components/assets/GyralisLogo.svg";

export const Footer = () => {
  return (
    <footer className="py-6 bg-[#121212] text-gray-400 ">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 md:mb-0 flex items-center space-x-2">
            <Image src={GyralisLogo} alt="Gyralis Logo" width={30} height={30} />

            <p className="text-sm">Gyralis 2025 - All rights reserved.</p>
          </div>
          <div className="">
            <a href="https://x.com/gyralis82742" target="_blank" className="flex items-center space-x-2">
              <span className="text-sm">Follow us</span>
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
                <path
                  fill="white"
                  d="M 11 4 C 7.1456661 4 4 7.1456661 4 11 L 4 39 C 4 42.854334 7.1456661 46 11 46 L 39 46 C 42.854334 46 46 42.854334 46 39 L 46 11 C 46 7.1456661 42.854334 4 39 4 L 11 4 z M 11 6 L 39 6 C 41.773666 6 44 8.2263339 44 11 L 44 39 C 44 41.773666 41.773666 44 39 44 L 11 44 C 8.2263339 44 6 41.773666 6 39 L 6 11 C 6 8.2263339 8.2263339 6 11 6 z M 13.085938 13 L 22.308594 26.103516 L 13 37 L 15.5 37 L 23.4375 27.707031 L 29.976562 37 L 37.914062 37 L 27.789062 22.613281 L 36 13 L 33.5 13 L 26.660156 21.009766 L 21.023438 13 L 13.085938 13 z M 16.914062 15 L 19.978516 15 L 34.085938 35 L 31.021484 35 L 16.914062 15 z"
                />
              </svg>
            </a>
          </div>

          <div className="flex space-x-4 items-center justify-between text-sm">
            <motion.p
              className="text-gray-400 hover:text-blue-500 transition-colors text-sm"
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            ></motion.p>
            <div className="flex items-center gap-1">
              {" "}
              Prototype v.1.1 -{" "}
              <a href="https://x.com/1HiveOrg" target="_blank" className="underlined">
                {" "}
                Powered by 1Hive{" "}
              </a>{" "}
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
