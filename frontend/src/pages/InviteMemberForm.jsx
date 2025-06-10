import React, { useState } from "react";
import axios from "../utils/axiosInstance";

export default function InviteMemberForm({ teamId, invitedByEmail }) {
  const [inviteEmail, setInviteEmail] = useState("");

  const handleInvite = async () => {
    try {
      await axios.post("/team-invites", {
        teamId,
        email: inviteEmail,
        invitedBy: invitedByEmail,
        status: "PENDING",
      });
      alert("초대 성공!");
    } catch (error) {
      console.error("초대 실패", error);
    }
  };

  return (
    <div>
      <input
        type="email"
        value={inviteEmail}
        onChange={(e) => setInviteEmail(e.target.value)}
        placeholder="초대할 이메일"
      />
      <button onClick={handleInvite}>초대하기</button>
    </div>
  );
}
