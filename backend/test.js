const axios = require("axios");

async function testBackend() {
  try {
    const response = await axios.post("http://localhost:3001/chat", {
      query: "I'm a 30-year-old software engineer interested in web development and cloud computing",
    });

    console.log("Response:", response.data);

    // Test if the response exists
    if (response.data) {
      console.log("\nTest passed! ✅");
      console.log("Response received successfully");
    } else {
      console.log("\nTest failed! ❌");
      console.log("No response data received");
    }
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
}

testBackend();
