import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function TeamListPage({ user }) {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/users/${user.email}/teams`) // 백엔드에서 해당 유저가 속한 팀 리스트 반환
      .then((res) => setTeams(res.data))
      .catch((err) => console.error("팀 목록 로딩 실패", err));
  }, [user]);

  const goToTeam = (teamId) => {
    navigate(`/team/${teamId}`); // 해당 팀 메인 페이지로 이동
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📋 나의 팀 목록</h2>
      {teams.map((team) => (
        <div
          key={team.id}
          className="border p-3 mb-2 rounded cursor-pointer hover:bg-gray-100"
          onClick={() => goToTeam(team.id)}
        >
          <h3 className="font-semibold">{team.name}</h3>
        </div>
      ))}
    </div>
  );
}
