// src/pages/TeamBoardPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import Board from './Board';

export default function TeamBoardPage() {
  const { teamId } = useParams();
  const [inviteEmail, setInviteEmail] = useState('');
  const [message, setMessage] = useState('');
  const [members, setMembers] = useState([]);
  const [creatorEmail, setCreatorEmail] = useState('');
  const currentUserEmail = localStorage.getItem('email');

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`/api/teams/${teamId}/members`);
      setMembers(res.data);
    } catch (err) {
      console.error('팀 멤버 목록 불러오기 실패', err);
    }
  };

  const fetchTeamInfo = async () => {
    try {
      const res = await axios.get(`/api/team/${teamId}`);
      setCreatorEmail(res.data.createdByEmail);
    } catch (err) {
      console.error('팀 정보 불러오기 실패', err);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchTeamInfo();
  }, [teamId]);

  const handleInvite = async () => {
    if (!inviteEmail) return;

    try {
      await axios.post(`/api/teams/${teamId}/invite`, { email: inviteEmail });
      setMessage(`✅ ${inviteEmail} 님을 초대했습니다.`);
      setInviteEmail('');
      fetchMembers();
    } catch (err) {
      console.error("초대 실패", err);
      setMessage("❌ 초대 실패: 이미 초대한 사용자일 수 있습니다.");
    }
  };

  const handleKick = async (userId) => {
  if (!window.confirm('정말 이 멤버를 강퇴하시겠습니까?')) return;

  try {
    await axios.delete(`/api/teams/${teamId}/kick/${userId}`, {
      data: { requesterEmail: currentUserEmail }, // ✅ 추가
    });
    setMessage("✅ 강퇴 완료");
    fetchMembers();
  } catch (err) {
    console.error("강퇴 실패", err);
    setMessage("❌ 강퇴 실패");
  }
};


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">👥 팀 메인 페이지</h2>

      {/* 초대 폼 */}
      <div className="mb-6">
        <h3 className="font-semibold">팀원 초대하기</h3>
        <input
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="초대할 이메일 입력"
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={handleInvite}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          초대
        </button>
        {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
      </div>

      {/* 멤버 목록 */}
      <div className="mb-6">
        <h3 className="font-semibold">현재 팀원</h3>
        <ul>
          {members.map((m) => (
            <li key={m.id} className="mb-2">
              {m.email}
              {creatorEmail === currentUserEmail && m.email !== currentUserEmail && (
                <button
                  onClick={() => handleKick(m.id)}
                  className="ml-3 bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  강퇴
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <Board />
    </div>
  );
}
