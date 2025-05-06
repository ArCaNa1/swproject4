import React, { useState } from "react";
import "./CardModal.css";

export default function CardModal({ card, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(card.title);
  const [dueDate, setDueDate] = useState(card.dueDate || "");
  const [description, setDescription] = useState(card.description || "");
  const [status, setStatus] = useState(card.status || "TODO");

  const handleSave = () => {
    const updatedCard = {
      ...card,
      title,
      dueDate,
      description,
      status,
    };
    onSave?.(updatedCard);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      onDelete?.(card.id);
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

        <div className="modal-actions mt-4">
          <button onClick={handleSave} className="bg-indigo-600 text-white px-4 py-2 rounded">
            저장
          </button>
          <button onClick={handleDelete} className="ml-2 bg-red-500 text-white px-4 py-2 rounded">
            삭제
          </button>
          <button onClick={onClose} className="ml-2 bg-gray-300 px-4 py-2 rounded">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
