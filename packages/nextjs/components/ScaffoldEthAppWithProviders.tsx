"use client";

import { useEffect, useState } from "react";
//  import { ApolloClient, ApolloProvider, InMemoryCache } from "apollo/client";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { Footer } from "~~/components/Footer";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();


  const background =
    "linear-gradient(to bottom,  rgba(0,101,189,1)  50%, rgba(21,24,25,1) 100%)";
  return (
    <>
     
        {/* <Header /> */}
        <main className="relative flex flex-col flex-1 px-4">
          
          {children}
        </main>
        {/* <Footer /> */}
     
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";
// const apolloClient = new ApolloClient({
//   uri: subgraphUri,
//   cache: new InMemoryCache(),
// });

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {/* <ProgressBar height="3px" color="#2299dd" /> */}
        <RainbowKitProvider
          avatar={BlockieAvatar}
          theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
        >
          {/* <ApolloProvider client={apolloClient}> */}
          <ScaffoldEthApp>{children}</ScaffoldEthApp>
          {/* </ApolloProvider> */}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
