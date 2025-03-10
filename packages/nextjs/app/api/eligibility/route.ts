// api/eligibility/
import { NextResponse } from "next/server";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Chain, createWalletClient, encodePacked, getContract, http, keccak256, parseAbi, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import * as chains from "viem/chains";

// Backend private key to sign eligibility messages
const TRUSTED_BACKEND_SIGNER_PK = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"; //process.env.TRUSTED_BACKEND_SIGNER_PK ?? "";
const GITCOIN_PASSPORT_API_KEY = process.env.GITCOIN_PASSPORT_API_KEY ?? "";
console.log("***** GITCOIN_PASSPORT_API_KEY *****", GITCOIN_PASSPORT_API_KEY);
const SCORER_ID = process.env.SCORER_ID ?? "";
const SUBGRAPH_URL = "https://api.studio.thegraph.com/query/102093/gardens-v2---gnosis/0.1.12";

/**
 * Gets the Viem chain configuration for a given chain ID
 * @param chainId The chain ID to look up
 * @returns The Chain configuration object
 * @throws Error if chain ID is not found
 */
export function getViemChain(chainId: string | number): Chain {
  for (const chain of Object.values(chains)) {
    if ("id" in chain && chain.id == chainId) {
      return chain;
    }
  }
  throw new Error(`Chain with id ${chainId} not found`);
}

const getApolloClient = (chainId: number) => {
  if (!SUBGRAPH_URL) {
    throw new Error(`No subgraph URL configured for chainId ${chainId}`);
  }
  return new ApolloClient({
    uri: SUBGRAPH_URL,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: "no-cache" },
      query: { fetchPolicy: "no-cache" },
    },
  });
};

/**
 * Fetches the Gitcoin Passport score for a user.
 * @param userAddress The Ethereum address of the user
 * @returns The passport score (number) or an error
 */
async function fetchPassportScore(userAddress: string): Promise<number> {
  if (!GITCOIN_PASSPORT_API_KEY) {
    throw new Error("Gitcoin Passport API key is missing");
  }

  const endpoint = `https://api.scorer.gitcoin.co/registry/score/${SCORER_ID}/${userAddress}`;
  console.log("***** endpoint *****", endpoint);
  console.info("Making request to Gitcoin Passport API:", endpoint);

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "X-API-KEY": GITCOIN_PASSPORT_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.info("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.info("Error data:", errorData);
      throw new Error(errorData.message || "Failed to fetch passport score");
    }

    const data = await response.json();
    return data.score;
  } catch (error) {
    console.error("Error fetching passport score:", error);
    throw new Error("Internal server error while fetching passport score");
  }
}

/**
 * Fetches the current period from the Loop contract.
 * @param chainId The blockchain network ID
 * @param loopAddress The address of the Loop contract
 * @returns The current period number (incremented by 1 for nextPeriod)
 */
async function fetchNextPeriod(chainId: number, loopAddress: string): Promise<bigint> {
  try {
    const viemChain = getViemChain(chains.localhost.id);
    const walletClient = createWalletClient({
      account: privateKeyToAccount(TRUSTED_BACKEND_SIGNER_PK as `0x${string}`),
      chain: viemChain,
      transport: http(),
    });

    const loopContract = getContract({
      address: loopAddress as `0x${string}`,
      abi: parseAbi(["function getCurrentPeriod() public view returns (uint256)"]),
      client: walletClient,
    });

    const currentPeriod: bigint = await loopContract.read.getCurrentPeriod();
    return currentPeriod + BigInt(1);
  } catch (error) {
    console.error("Error fetching current period:", error);
    throw new Error("Failed to fetch current period");
  }
}

export async function POST(req: Request) {
  try {
    const { userAddress, loopAddress, chainId } = await req.json();

    if (!userAddress || !loopAddress || !chainId) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    // Check Passport API score
    let passportScore: number;
    try {
      passportScore = await fetchPassportScore(userAddress);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" },
        { status: 500 },
      );
    }

    if (passportScore <= 20) {
      return NextResponse.json(
        { success: false, error: "User does not meet passport score requirement" },
        { status: 403 },
      );
    }

    // Query the subgraph for membership
    const apolloClient = getApolloClient(chainId);
    const { data, errors } = await apolloClient.query({
      query: gql`
        query CheckMembership($userAddress: String!) {
          memberCommunities(
            where: { registryCommunity: "0xe2396fe2169ca026962971d3b2e373ba925b6257", memberAddress: $userAddress }
          ) {
            memberAddress
          }
        }
      `,
      variables: { userAddress: userAddress.toLowerCase() },
    });

    if (errors || !data?.memberCommunities?.length) {
      return NextResponse.json(
        { success: false, error: "User is not a member of the required community" },
        { status: 403 },
      );
    }

    // Fetch next period number from Loop contract
    let nextPeriod: bigint;
    try {
      nextPeriod = await fetchNextPeriod(chainId, loopAddress);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch current period from Loop contract" },
        { status: 500 },
      );
    }

    // Correct eligibility message hashing
    const eligibilityMessageHash = keccak256(
      encodePacked(["address", "uint256", "address"], [userAddress, nextPeriod, loopAddress]),
    );

    // Sign the message with the trusted backend signer
    const walletClient = createWalletClient({
      account: privateKeyToAccount(TRUSTED_BACKEND_SIGNER_PK as `0x${string}`),
      chain: getViemChain(chainId),
      transport: http(),
    });

    const backendSignature = await walletClient.signMessage({
      account: privateKeyToAccount(TRUSTED_BACKEND_SIGNER_PK as `0x${string}`),
      message: toHex(eligibilityMessageHash), // Convert to hex format
    });

    return NextResponse.json({
      success: true,
      signature: backendSignature,
      message: "User is eligible and signature has been generated",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
