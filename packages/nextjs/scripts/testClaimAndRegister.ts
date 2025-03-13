import { createWalletClient, getContract, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { localhost } from "viem/chains";

const API_URL = "http://localhost:3000/api/eligibility";
const TEST_CHAIN_ID = 100;
const TEST_USER_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const TEST_LOOP_ADDRESS = "0xED179b78D5781f93eb169730D8ad1bE7313123F4";
const USER_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

async function testFullFlow() {
  try {
    console.log("Step 1: Requesting eligibility signature");
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chainId: TEST_CHAIN_ID,
        userAddress: TEST_USER_ADDRESS,
        loopAddress: TEST_LOOP_ADDRESS,
      }),
    });

    const data = await response.json();
    console.log("Eligibility API Response:", data);

    if (!data.success) {
      console.log(`User is not eligible. Reason: ${data.error}`);
      return;
    }

    console.log(`User is eligible! Signature: ${data.signature}`);

    // Step 2: Call the claimAndRegister function on the Loop contract
    console.log("Step 2: Calling claimAndRegister on the contract...");

    const walletClient = createWalletClient({
      account: privateKeyToAccount(USER_PRIVATE_KEY),
      chain: localhost,
      transport: http(),
    });

    const loopContract = getContract({
      address: TEST_LOOP_ADDRESS,
      abi: parseAbi(["function claimAndRegister(bytes signature) external"]),
      client: walletClient,
    });

    const hash = await loopContract.write.claimAndRegister([data.signature]);

    console.log(`Transaction sent Hash: ${hash}`);
  } catch (error) {
    console.error("Error test:", error);
  }
}

testFullFlow();
