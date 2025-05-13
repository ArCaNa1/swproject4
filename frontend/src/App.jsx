// src/App.jsx
import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import ListBoard from "./pages/ListBoard";
import "./App.css";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setLoggedInUser({ email });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setLoggedInUser(null);
  };

  return (
    <div className="app-container">
      {loggedInUser ? (
        <>
          <header className="app-header">
            <h1 className="logo">📌 MyTaskBoard</h1>
            <div className="user-info">
              <span className="username">👤 {loggedInUser.email}님</span>
              <button className="logout-btn" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          </header>

          <main className="main-content">
            <ListBoard user={loggedInUser} />
          </main>
        </>
      ) : (
        <div className="login-screen">
          <LoginForm onLogin={setLoggedInUser} />
        </div>
      )}
    </div>
  );
}

export default App;
