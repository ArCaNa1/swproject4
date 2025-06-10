// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) {
      alert("로그인이 필요합니다.");
      return;
    }

    axios.get('/api/team/my', {
      params: { email }
    })
    .then((res) => setTeams(res.data))
    .catch((err) => {
      console.error('팀 목록 불러오기 실패:', err);
      alert('팀 목록을 불러오는 중 오류가 발생했습니다.');
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">내 보드 목록</h1>
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => navigate('/team/create')}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow"
        >
          + 새 보드 만들기
        </button>
        <button
          onClick={() => navigate('/invites')}
          className="px-4 py-2 bg-purple-500 text-white rounded shadow flex items-center gap-2"
        >
          📬 받은 초대 보기
        </button>
      </div>

      <ul className="space-y-4">
        {teams.map((team) => (
          <li
            key={team.id}
            className="flex items-center justify-between p-4 bg-white border rounded shadow hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate(`/team/${team.id}`)}
          >
            <span className="text-lg font-medium">📌 {team.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/team/${team.id}/invite`);
              }}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded"
            >
              팀원 초대하기
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
