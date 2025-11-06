// src/components/UserList.js
import React, { useState, useEffect } from "react";
import { fetchUsers } from "../api/userService";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Async function inside useEffect
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers(); // Await API response
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h2>User List (Async/Await Demo)</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
