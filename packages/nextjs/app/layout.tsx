import { Poppins } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = getMetadata({ title: "Gyralis App", description: "Web3 token distribution platform" });

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning lang="en" className={`${poppins.variable} bg-white mx-auto`}>
      <body className="min-h-screen font-poppins">
        {/* <ThemeProvider enableSystem> */}
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
