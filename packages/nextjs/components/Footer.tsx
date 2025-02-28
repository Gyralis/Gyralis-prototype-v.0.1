import React from "react";

export const Footer = () => {

  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div>
        <div className="fixed flex justify-center items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-noxs">
       
            <p className="text-xs">
            {`${new Date().getFullYear()} Gyralis. All rights reserved - Powered by 1hive`}
            </p>
        </div>
      </div>
    </div>
  );
};
