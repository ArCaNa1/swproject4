import React, { useState } from "react";
import TaskCard from "./TaskCard";

export default function ListColumn({ list, onAddCard, onCardClick }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleConfirmAdd = () => {
    if (!newTitle.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    onAddCard(list.id, {
      title: newTitle,
      dueDate: "",
      description: "",
    });
    setNewTitle("");
    setIsAdding(false);
  };

  return (
    <div className="list-column">
      <div className="card-stack">
        {list.cards.map((card) => (
          <div
            key={card.id}
            onClick={() => onCardClick(card)}
            className="bg-gray-100 rounded p-2 cursor-pointer hover:bg-gray-200"
          >
            <TaskCard card={card} />
          </div>
        ))}

{isAdding ? (
  <div className="add-card-form">
    <input
      type="text"
      placeholder="카드 제목 입력"
      value={newTitle}
      onChange={(e) => setNewTitle(e.target.value)}
    />
    <div className="btn-row">
      <button className="add" onClick={handleConfirmAdd}>추가</button>
      <button className="cancel" onClick={() => {
        setIsAdding(false);
        setNewTitle("");
      }}>취소</button>
    </div>
  </div>
) : (
  <button className="add-card-btn" onClick={() => setIsAdding(true)}>
    + 카드 추가
  </button>
)}

      </div>
    </div>
  );
}
