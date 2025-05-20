import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import "./CardModal.css";

export default function CardModal({ card,user, onClose, onDelete,onSave  }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [title, setTitle] = useState(card.title);
  const [dueDate, setDueDate] = useState(card.dueDate || "");
  const [description, setDescription] = useState(card.description || "");
  const [status, setStatus] = useState(card.status || "TODO");

  const handleSave = async () => {
    const updatedCard = {
      ...card,
      title,
      dueDate,
      description,
      status,
    };

    if (!card.id) {
      alert("수정할 카드 ID가 유효하지 않습니다.");
      console.error("card.id is missing:", card);
      return;
    }

    try {
      await axios.put(`/cards/${card.id}`, updatedCard); // ✅ cards로 수정됨
      alert("카드가 성공적으로 수정되었습니다.");
      onSave(updatedCard); 
      onClose();
    } catch (error) {
      console.error("카드 수정 실패:", error);
      alert("카드 수정 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    axios
      .get(`/cards/${card.id}/comments`)
      .then((res) => setComments(res.data))
      .catch((err) => console.error("댓글 불러오기 실패", err));
  }, [card]);

  const handleAddComment = async () => {
  if (!newComment.trim()) return;

  try {
    const res = await axios.post(`/cards/${card.id}/comments`, {
      userEmail: user.email,
      content: newComment,
    });

    setComments((prev) => [...prev, res.data]);
    setNewComment("");
  } catch (err) {
    console.error("댓글 추가 실패", err);
  }
};



  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      onDelete?.(card.id); // 삭제 요청은 부모 컴포넌트에서 실행
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          📝 카드: <span>{card.title}</span>
        </h2>

        <label className="modal-section">
          제목
          <input
            type="text"
            className="w-full border mt-1 px-2 py-1 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="modal-section">
          마감일
          <input
            type="date"
            className="w-full border mt-1 px-2 py-1 rounded"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>

        <label className="modal-section">
          설명
          <textarea
            className="w-full border mt-1 px-2 py-1 rounded"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label className="modal-section">
          상태
          <select
            className="w-full border mt-1 px-2 py-1 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="TODO">📝 TODO</option>
            <option value="DOING">🚧 DOING</option>
            <option value="DONE">✅ DONE</option>
            <option value="BLOCKED">⛔ BLOCKED</option>
            <option value="POSTPONED">🕓 POSTPONED</option>
            <option value="EXPIRED">⏰ EXPIRED</option>
            <option value="CANCELLED">❌ CANCELLED</option>
          </select>
        </label>

        <div className="modal-section">
        <h3>💬 댓글</h3>

        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c.id}>
              <strong>{c.userEmail}</strong>: {c.content}
              <br />
              <small>{new Date(c.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>

        <textarea
          className="w-full border mt-2 p-2 rounded"
          rows={3}
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
          onClick={handleAddComment}
        >
          댓글 작성
        </button>
      </div>


        <div className="modal-actions mt-4">
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            저장
          </button>
          <button
            onClick={handleDelete}
            className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
          >
            삭제
          </button>
          <button
            onClick={onClose}
            className="ml-2 bg-gray-300 px-4 py-2 rounded"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
