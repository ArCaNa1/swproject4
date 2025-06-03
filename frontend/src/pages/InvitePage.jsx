import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { useParams } from 'react-router-dom';

function InvitePage() {
  const { teamId } = useParams();
  const [email, setEmail] = useState('');
  const [members, setMembers] = useState([]);
  const inviterEmail = localStorage.getItem('email');
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    fetchMembers();
    fetchInvites();
    }, []);



  const fetchMembers = async () => {
    try {
      const res = await axios.get(`/api/team/${teamId}/members`);
      setMembers(res.data);
    } catch (err) {
      console.error('멤버 불러오기 실패:', err);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/team/${teamId}/invite`, {
        email,
        inviterEmail
      });
      alert('초대가 완료되었습니다.');
      setEmail('');
      fetchMembers(); // 멤버 다시 불러오기
    } catch (err) {
      console.error('초대 실패:', err);
      alert('초대에 실패했습니다.');
    }
  };

  const fetchInvites = async () => {
  try {
    const res = await axios.get(`/api/team/${teamId}/invites`);
    setInvites(res.data);
  } catch (err) {
    console.error('초대 목록 불러오기 실패:', err);
  }
};

const handleCancel = async (email) => {
  try {
    await axios.delete(`/api/team/${teamId}/invite`, {
      params: { email }
    });
    alert('취소 완료');
    fetchInvites(); // 갱신
  } catch (err) {
    alert('취소 실패');
  }
};


  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div>
      <h2>팀 멤버 초대</h2>
      <form onSubmit={handleInvite}>
        <input
          type="email"
          placeholder="초대할 이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">초대하기</button>
      </form>

      <h3>현재 멤버</h3>
      <ul>
        {members.map((member) => (
          <li key={member.id}>{member.email}</li>
        ))}
      </ul>

      <h3>보낸 초대</h3>
        <ul>
        {invites.map((invite) => (
            <li key={invite.id}>
            {invite.email} ({invite.status})
            {invite.status === "PENDING" && (
                <button onClick={() => handleCancel(invite.email)}>취소</button>
            )}
            </li>
        ))}
        </ul>

    </div>
  );
}

export default InvitePage;
