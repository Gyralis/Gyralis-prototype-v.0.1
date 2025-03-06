const API_URL = "http://localhost:3000/api/eligibility";
const TEST_CHAIN_ID = 100;
const TEST_USER_ADDRESS = "0xa25211B64D041F690C0c818183E32f28ba9647Dd";
const TEST_LOOP_ADDRESS = "0x39c3A55F68Bf9f2992776991F25Aac6813a4F1d0";

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
        loopAddress: TEST_LOOP_ADDRESS,
      }),
    });

    const data = await response.json();
    console.log("API Response:", data);

    if (data.success) {
      console.log(` User is eligible! Signature: ${data.signature}`);
    } else {
      console.log(`User is not eligible. Reason: ${data.error}`);
    }
  } catch (error) {
    console.error("Error testing eligibility API:", error);
  }
}

testEligibility();
