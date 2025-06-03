// src/pages/CreateTeam.jsx
import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

function CreateTeam() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ 로컬스토리지에서 email 꺼내기 (예: 로그인 시 저장해 둔 값)
    const email = localStorage.getItem('email');

    if (!email) {
      alert("로그인 정보가 없습니다. 다시 로그인 해주세요.");
      return;
    }

    try {
      await axios.post('/api/team', { name, email }); // ✅ email도 함께 전송
      navigate('/dashboard');
    } catch (err) {
      console.error("팀 생성 실패:", err);
      alert("팀 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>보드 이름 입력</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="보드 이름"
      />
      <button type="submit">생성</button>
    </form>
  );
}

export default CreateTeam;
