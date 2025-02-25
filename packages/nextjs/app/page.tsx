"use client";

import Link from "next/link";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col gap-2 flex-grow pt-10">
        <h3>Gyralis</h3>
        <Link href={`${"/prototype"}`} className="hover:underline">
          Go to prototype
        </Link>
        {/* Landing page here */}
      </div>
    </>
  );
};

export default Home;
