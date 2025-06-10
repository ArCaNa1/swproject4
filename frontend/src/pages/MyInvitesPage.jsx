// src/pages/MyInvitesPage.jsx
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

export default function MyInvitesPage() {
  const [invites, setInvites] = useState([]);
  const email = localStorage.getItem("email");

  useEffect(() => {
    axios.get(`/invites/me?email=${email}`).then((res) => setInvites(res.data));
  }, []);

  const handleAccept = async (inviteId) => {
    await axios.post(`/invites/${inviteId}/accept`);
    setInvites(invites.filter((i) => i.id !== inviteId));
  };

  const handleReject = async (inviteId) => {
    await axios.delete(`/invites/${inviteId}`); // 수락/거절은 API에 따라
    setInvites(invites.filter((i) => i.id !== inviteId));
  };

  return (
    <div>
      <h2>📩 받은 초대 목록</h2>
      {invites.map((inv) => (
        <div key={inv.id}>
          <p>{inv.email} - 팀 ID: {inv.teamId}</p>
          <button onClick={() => handleAccept(inv.id)}>수락</button>
          <button onClick={() => handleReject(inv.id)}>거절</button>
        </div>
      ))}
    </div>
  );
}
