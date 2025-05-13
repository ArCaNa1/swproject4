import React, { useState } from "react";
import axios from "../utils/axiosInstance";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });
      const token = res.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("email", email);

      onLogin({ email });
    } catch (err) {
      alert("로그인 실패");
      console.error("❌ 로그인 에러:", err);
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <h2>로그인</h2>
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
  );
}
