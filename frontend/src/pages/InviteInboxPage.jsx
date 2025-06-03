import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

function InviteInboxPage() {
  const [invites, setInvites] = useState([]);
  const email = localStorage.getItem('email');

  const fetchInvites = async () => {
    try {
      const res = await axios.get('/api/team/received-invites', {
        params: { email }
      });
      setInvites(res.data);
    } catch (err) {
      console.error('초대 목록 조회 실패:', err);
    }
  };

  const handleAccept = async (teamId) => {
    try {
      await axios.post(`/api/team/${teamId}/accept`, { email });
      alert('초대를 수락했습니다.');
      fetchInvites(); // 새로고침
    } catch (err) {
      alert('수락 실패');
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  return (
    <div>
      <h2>받은 초대 목록</h2>
      {invites.length === 0 ? (
        <p>받은 초대가 없습니다.</p>
      ) : (
        <ul>
          {invites.map((invite) => (
            <li key={invite.id}>
              팀 ID: {invite.teamId} / 보낸 사람: {invite.invitedBy}
              <button onClick={() => handleAccept(invite.teamId)}>수락</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InviteInboxPage;
