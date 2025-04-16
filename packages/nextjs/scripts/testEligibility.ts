const API_URL = "http://localhost:3000/api/eligibility";
const TEST_CHAIN_ID = 31337;
const TEST_USER_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const TEST_LOOP_ADDRESS = "0xED179b78D5781f93eb169730D8ad1bE7313123F4";

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
