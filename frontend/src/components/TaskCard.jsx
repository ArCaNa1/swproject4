// src/components/TaskCard.jsx
import React from "react";
import "../App.css";

export default function TaskCard({ card, onClick }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const isOverdue = (due) => {
    return new Date(due) < new Date();
  };

  return (
    <div className="card" onClick={onClick}>
      {/* 카드 제목 표시 */}
      <div className="card-title">{card.title}</div>

      {/* 마감일이 있을 경우 뱃지 표시 */}
      {card.dueDate && (
        <span className={isOverdue(card.dueDate) ? "badge red" : "badge yellow"}>
          🕓 {formatDate(card.dueDate)}
        </span>
      )}
    </div>
  );
}
