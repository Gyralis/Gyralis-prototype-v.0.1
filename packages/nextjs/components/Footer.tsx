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
