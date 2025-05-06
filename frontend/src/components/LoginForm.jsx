import React, { useState } from "react";
import axios from "axios";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password },
        { withCredentials: true } // ✅ CORS 인증 포함
      );

      const user = response.data;
      onLogin(user); // App에 유저 정보 전달
    } catch (error) {
      setErrorMsg("❌ 로그인 실패: 이메일 또는 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 로그인</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">로그인</button>
      </form>
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
    </div>
  );
}
