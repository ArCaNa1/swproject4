// 📁 src/pages/TeamDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function TeamDashboard({ user }) {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const navigate = useNavigate();

  const fetchTeams = async () => {
    try {
      const res = await axios.get(`/teams/user/${user.id}`);
      setTeams(res.data);
    } catch (err) {
      console.error("팀 불러오기 실패", err);
    }
  };

  const createTeam = async () => {
    try {
      await axios.post("/teams", { name: teamName, createdBy: user.id });
      setTeamName("");
      fetchTeams();
    } catch (err) {
      console.error("팀 생성 실패", err);
    }
  };

  const sendInvite = async () => {
    try {
      await axios.post("/team-invites", {
        teamId: selectedTeamId,
        email: inviteEmail,
        invitedBy: user.id,
      });
      setInviteEmail("");
      alert("초대장을 보냈습니다.");
    } catch (err) {
      console.error("초대 실패", err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎯 내 팀</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="팀 이름 입력"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={createTeam} className="bg-blue-500 text-white px-4 py-2">
          팀 생성
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl mb-2">📋 내 팀 목록</h2>
        <ul>
          {teams.map((team) => (
            <li key={team.id} className="mb-2">
              <span className="mr-2 font-semibold">{team.name}</span>
              <button
                onClick={() => navigate(`/teams/${team.id}/board`)}
                className="bg-green-500 text-white px-2 py-1 mr-2"
              >
                보드 이동
              </button>
              <button
                onClick={() => setSelectedTeamId(team.id)}
                className="bg-gray-300 px-2 py-1"
              >
                초대하기
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedTeamId && (
        <div className="mt-4">
          <h2 className="text-lg mb-2">📨 초대</h2>
          <input
            type="email"
            placeholder="이메일 입력"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="border p-2 mr-2"
          />
          <button onClick={sendInvite} className="bg-purple-500 text-white px-4 py-2">
            초대 보내기
          </button>
        </div>
      )}
    </div>
  );
}
