// src/api/userService.js

// Mock API call (simulate network delay)
export const fetchUsers = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
      ]);
    }, 1500); // 1.5 seconds delay
  });
};
