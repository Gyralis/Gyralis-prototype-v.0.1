"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRightIcon, Bars3Icon, BugAntIcon, HomeModernIcon, LifebuoyIcon } from "@heroicons/react/24/outline";
import GyralisLogo from "~~/components/assets/GyralisLogo.svg";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
    icon: <HomeModernIcon className="h-5 w-5" />,
  },
  {
    label: "Explore",
    href: "/prototype",
    icon: <LifebuoyIcon className="h-5 w-5" />,
  },
  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-5 w-5" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      {!isHomePage && (
        <>
          {menuLinks.map(({ label, href, icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  passHref
                  className={`${
                    isActive ? "bg-secondary shadow-none" : ""
                  } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full flex gap-2`}
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </>
      )}
    </>
  );
};

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <motion.header
      className={`border-b border-gray-800 z-50 backdrop-blur-md bg-[#121212]/80 ${isHomePage ? "sticky top-0" : "relative"}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="container mx-auto px-4 md:px-6 py-4 ">
        <div className="flex justify-between items-center ">
          <motion.a
            href="/"
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-300 flex items-center justify-center text-white font-bold relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#3182C8] to-blue-[#DDE7F0] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Image src={GyralisLogo} alt="Gyralis Logo" width={30} height={30} />
            </div>
            <span className="text-2xl font-bold text-blue-500">Gyralis</span>
          </motion.a>
          {isHomePage && (
            <nav className="hidden md:flex space-x-8">
              {["What is Gylaris", "Loops", "How it Works", "About us"].map((item, i) => (
                <motion.a
                  key={i}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-gray-300 hover:text-blue-500 transition-colors relative"
                  whileHover={{ scale: 1.1 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * i }}
                >
                  {item}
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}
            </nav>
          )}
          <div className=" flex items-center space-x-4">
            {!isHomePage ? (
              <>
                <RainbowKitCustomConnectButton />
              </>
            ) : (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={"/prototype/1hive"}
                  className="btn border-none text-black bg-[#3182C8]  relative overflow-hidden group"
                >
                  Go to Prototype
                </Link>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};
