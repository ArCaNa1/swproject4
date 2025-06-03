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
    <div>
      <h1>내 보드 목록</h1>
      <button onClick={() => navigate('/team/create')}>+ 새 보드 만들기</button>
      <ul>
        {teams.map((team) => (
          <li
            key={team.id}
            onClick={() => navigate(`/team/${team.id}`)}
            style={{ cursor: 'pointer', margin: '10px 0' }}
          >
            {team.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
