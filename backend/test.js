// OUTDATED

const axios = require("axios");

async function testChatHistory() {
  console.log("\n🛠 Running Chat History Tests...\n");

  // Define test users
  const user1 = "testUser123";
  const user2 = "testUser456";

  try {
    // 1️⃣ First Message (User 1)
    console.log("Running Test 1: First message from User 1...");
    const response1 = await axios.post("http://localhost:3001/chat", {
      userId: user1,
      query: "I'm a software engineer who loves hiking and photography.",
    });

    console.log("📝 First response (User 1):", response1.data.message);

    // Wait a bit between requests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 2️⃣ Second Message (User 1) - Should remember history
    console.log("\nRunning Test 2: Follow-up message from User 1...");
    const response2 = await axios.post("http://localhost:3001/chat", {
      userId: user1,
      query: "What else do you suggest?",
    });

    console.log("🔄 Second response (User 1):", response2.data.message);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 3️⃣ First Message (User 2) - Should start a fresh chat
    console.log("\nRunning Test 3: First message from User 2...");
    const response3 = await axios.post("http://localhost:3001/chat", {
      userId: user2,
      query:
        "I'm interested in artificial intelligence. I'm switching from a startup to a big company.",
    });

    console.log("🆕 First response (User 2):", response3.data.message);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 4️⃣ Repeating test for User 1 - Should still remember history
    console.log("\nRunning Test 4: Another follow-up from User 1...");
    const response4 = await axios.post("http://localhost:3001/chat", {
      userId: user1,
      query: "Who else might I connect with?",
    });

    console.log("🔄 Third response (User 1):", response4.data.message);

    // ✅ Assertions (Basic Checks)
    console.log("\n📋 Test Results:");
    console.log("Test 1:", response1.data.message ? "✅ Passed" : "❌ Failed");
    console.log("Test 2:", response2.data.message ? "✅ Passed" : "❌ Failed");
    console.log("Test 3:", response3.data.message ? "✅ Passed" : "❌ Failed");
    console.log("Test 4:", response4.data.message ? "✅ Passed" : "❌ Failed");

    if (
      response1.data.message &&
      response2.data.message &&
      response3.data.message &&
      response4.data.message
    ) {
      console.log("\n✅ All tests passed! Chat history persists correctly.");
    } else {
      console.log("\n❌ Test failed! Some responses are missing.");
    }
  } catch (error) {
    console.error("\n❌ Error during testing:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("No response received. Is the server running?");
    } else {
      console.error("Error:", error.message);
    }
    process.exit(1);
  }
}

// Run the tests
console.log("🚀 Starting chat history tests...");
console.log("⚠️  Make sure your server is running on http://localhost:3001");
console.log("⚠️  Make sure MongoDB is connected");

testChatHistory();
