import React, { useState } from "react";
//import axios from "axios";
import axios from "../utils/axiosInstance";


export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });
      const token = res.data.token;

      // ✅ 토큰 저장
      localStorage.setItem("token", token);
      localStorage.setItem("email", email); // 사용자 식별용 이메일도 저장

      // 로그인 성공 후 상위 컴포넌트에 사용자 정보 전달
      onLogin({ email });

    } catch (err) {
      alert("로그인 실패");
      console.error("❌ 로그인 에러:", err);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" required />
      <button type="submit">로그인</button>
    </form>
  );
}
