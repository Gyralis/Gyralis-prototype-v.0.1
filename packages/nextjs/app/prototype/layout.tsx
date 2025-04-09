import Image from "next/image";
import GyralisLogo from "~~/components/assets/GyralisLogo.svg";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

export default function GyralisUI({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-black relative">
      {/* Navigation Bar */}
      <nav className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 my-6 rounded-lg shadow-md ">
        <div className="flex items-center gap-4 w-full justify-between">
          <div className="flex items-center gap-2 ">
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

        <div className="hidden md:flex items-center justify-center ml-0 sm:ml-8 space-x-6 md:space-x-14 mt-4 sm:mt-0 w-full ">
          <div className="relative font-medium text-gray-600 hover:text-black whitespace-nowrap text-sm">
            Custom Loops
            <span className="absolute -top-4 -right-8 text-xs bg-[#e2e8ed] px-1.5 py-0.5 rounded-full">Soon</span>
          </div>
          <div className="relative font-medium text-gray-600 hover:text-black whitespace-nowrap text-sm">
            Organizations Profile
            <span className="absolute -top-4 -right-8 text-xs bg-[#e2e8ed] px-1.5 py-0.5 rounded-full">Soon</span>
          </div>
          <div className="relative font-medium text-gray-600 hover:text-black whitespace-nowrap text-sm">
            Tokenomics
            <span className="absolute -top-4 -right-8 text-xs bg-[#e2e8ed] px-1.5 py-0.5 rounded-full">Soon</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full justify-center sm:justify-end">
          <RainbowKitCustomConnectButton />
          {/* <FaucetButton /> */}
        </div>
      </nav>
      {children}
    </div>
  );
}
