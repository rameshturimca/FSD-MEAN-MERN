// Example: Understanding async/await in one file

// A fake function that simulates fetching user data from a server
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching data for user ${userId}...`);
    setTimeout(() => {
      // simulate success or failure randomly
      if (Math.random() > 0.2) {
        resolve({ id: userId, name: "Alice", age: 25 });
      } else {
        reject("Failed to fetch user data.");
      }
    }, 2000);
  });
}

// Async function using await to handle the promise
async function showUserData() {
  console.log("Start");

  try {
    // Await pauses here until the promise resolves or rejects
    const user = await fetchUserData(101);
    console.log("User fetched successfully:", user);
  } catch (error) {
    console.error("Error:", error);
  }

  console.log("End");
}

// Run the example
showUserData();
