// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard"; // 새로 만들기
import CreateTeam from "./pages/CreateTeam"; // 새로 만들기
import Board from "./pages/Board"; // 기존 보드 페이지
import InvitePage from './pages/InvitePage';
import InviteInboxPage from './pages/InviteInboxPage';
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
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1 className="logo">📌 MyTaskBoard</h1>
          {loggedInUser && (
            <div className="user-info">
              <span className="username">👤 {loggedInUser.email}님</span>
              <button className="logout-btn" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          )}
        </header>

        <main className="main-content">
          <Routes>
            {/* 로그인 안 되어 있으면 로그인 화면 */}
            {!loggedInUser && (
              <Route path="*" element={<LoginForm onLogin={setLoggedInUser} />} />
            )}

            {/* 로그인 되어 있으면 내부 라우팅 */}
            {loggedInUser && (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/team/create" element={<CreateTeam />} />
                <Route path="/team/:teamId" element={<Board />} />
                <Route path="/team/:teamId/invite" element={<InvitePage />} />
                <Route path="/invites" element={<InviteInboxPage />} />
                {/* 로그인 후 기본 경로를 대시보드로 리디렉션 */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
                <Route path="/invitations" element={<InviteInboxPage />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
