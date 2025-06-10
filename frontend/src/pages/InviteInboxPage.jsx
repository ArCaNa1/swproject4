import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

export default function InviteInboxPage() {
  const [invites, setInvites] = useState([]);
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (email) {
      axios
        .get(`/invites?email=${email}`) // 🔧 /api 제거
        .then((res) => setInvites(res.data))
        .catch((err) => console.error("초대 목록 불러오기 실패", err));
    }
  }, [email]);

  const handleAccept = async (inviteId) => {
    try {
      await axios.post(`/invites/${inviteId}/accept`); // 🔧 /api 제거
      setInvites((prev) =>
        prev.map((inv) =>
          inv.id === inviteId ? { ...inv, status: "ACCEPTED" } : inv
        )
      );
    } catch (err) {
      console.error("초대 수락 실패", err);
    }
  };

  const handleReject = async (inviteId) => {
    try {
      await axios.post(`/invites/${inviteId}/reject`); // 🔧 /api 제거
      setInvites((prev) =>
        prev.map((inv) =>
          inv.id === inviteId ? { ...inv, status: "REJECTED" } : inv
        )
      );
    } catch (err) {
      console.error("초대 거절 실패", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📬 받은 초대 목록</h2>
      {invites.length === 0 ? (
        <p>받은 초대가 없습니다.</p>
      ) : (
        invites.map((invite) => (
          <div
            key={invite.id}
            className="border p-3 mb-3 rounded bg-white shadow"
          >
            <p className="mb-1">
              <strong>팀 ID:</strong> {invite.teamId}
            </p>
            <p className="mb-1">
              <strong>상태:</strong>{" "}
              {invite.status === "PENDING"
                ? "대기 중"
                : invite.status === "ACCEPTED"
                ? "수락됨"
                : "거절됨"}
            </p>
            {invite.status === "PENDING" && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleAccept(invite.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  수락
                </button>
                <button
                  onClick={() => handleReject(invite.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  거절
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
