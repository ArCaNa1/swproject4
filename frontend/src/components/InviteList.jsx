import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

export default function InviteList({ user }) {
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const res = await axios.get(`/invites?email=${user.email}`);
        setInvites(res.data);
      } catch (error) {
        console.error("초대 목록 로딩 실패", error);
      }
    };

    if (user?.email) fetchInvites();
  }, [user]);

  const respondToInvite = async (inviteId, accepted) => {
    try {
      await axios.post(`/invites/${inviteId}/respond`, { accepted });
      setInvites((prev) => prev.filter((i) => i.id !== inviteId));
      alert(accepted ? "초대를 수락했습니다." : "초대를 거절했습니다.");
    } catch (error) {
      console.error("응답 실패", error);
    }
  };

  return (
    <div>
      <h2>📨 받은 팀 초대</h2>
      {invites.length === 0 ? (
        <p>초대가 없습니다.</p>
      ) : (
        <ul>
          {invites.map((invite) => (
            <li key={invite.id}>
              <strong>팀 이름: {invite.teamName}</strong> <br />
              초대한 사람: {invite.invitedByName} <br />
              <button onClick={() => respondToInvite(invite.id, true)}>✅ 수락</button>
              <button onClick={() => respondToInvite(invite.id, false)}>❌ 거절</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
