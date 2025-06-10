import React, { useState } from "react";
import axios from "../utils/axiosInstance";

export default function TeamInvite({ teamId }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleInvite = async () => {
    if (!email.trim()) {
      setMessage("이메일을 입력하세요.");
      return;
    }

    try {
      await axios.post(`/teams/${teamId}/invite`, { email });
      setMessage("초대가 전송되었습니다!");
      setEmail("");
    } catch (err) {
      setMessage("초대 전송 실패: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow w-80">
      <h2 className="text-lg font-semibold mb-2">팀원 초대</h2>
      <input
        type="email"
        placeholder="이메일 입력"
        className="w-full border px-2 py-1 mb-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleInvite}
        className="w-full bg-blue-500 text-white px-3 py-1 rounded"
      >
        초대하기
      </button>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
