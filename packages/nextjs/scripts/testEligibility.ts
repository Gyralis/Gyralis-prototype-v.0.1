const API_URL = "http://localhost:3000/api/eligibility"; // Update if deployed
const TEST_CHAIN_ID = 100; // Example: Gnosis chainId
const TEST_USER_ADDRESS = "0x07ad02e0c1fa0b09fc945ff197e18e9c256838c6"; // Replace with a real address

async function testEligibility() {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chainId: TEST_CHAIN_ID,
        userAddress: TEST_USER_ADDRESS,
      }),
    });

    const data = await response.json();
    console.log("API Response:", data);
  } catch (error) {
    console.error("Error testing eligibility API:", error);
  }
}

testEligibility();
