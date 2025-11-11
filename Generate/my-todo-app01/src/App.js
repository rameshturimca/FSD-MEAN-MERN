import React, { useState } from 'react';
import './App.css';
import Todo from './Todo';
import Login from './Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <>
          <h1>Todo Application</h1>
          <Todo />
        </>
      )}
    </div>
  );
}

export default App;
