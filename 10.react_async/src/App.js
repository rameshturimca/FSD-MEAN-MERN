// src/App.js
import React from "react";
import UserList from "./components/UserList";

const App = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>React Async/Await Example</h1>
      <UserList />
    </div>
  );
};

export default App;
