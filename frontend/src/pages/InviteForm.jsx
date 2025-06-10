import React, { useState } from "react";
import axios from "../utils/axiosInstance";

export default function InviteForm({ teamId }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleInvite = async () => {
    try {
      await axios.post(`/teams/${teamId}/invite`, { email });
      setMessage("✅ 초대장이 전송되었습니다.");
      setEmail("");
    } catch (err) {
      console.error("초대 실패", err);
      setMessage("❌ 초대 실패: 유효한 이메일을 확인하세요.");
    }
  };

  return (
    <div className="invite-box">
      <h3>📨 팀원 초대</h3>
      <input
        type="email"
        placeholder="이메일 입력"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-2 py-1 rounded w-64"
      />
      <button
        onClick={handleInvite}
        className="ml-2 bg-blue-500 text-white px-4 py-1 rounded"
      >
        초대
      </button>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
