import React, { useState } from "react";
import TaskCard from "./TaskCard";
import { Droppable, Draggable } from "react-beautiful-dnd";

export default function ListColumn({
  list,
  onAddCard,
  onCardClick,
  searchKeyword,
  statusFilter,
  onChangeListTitle,
  onDeleteList
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleConfirmAdd = () => {
    if (!newTitle.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    onAddCard(list.id, {
      id: crypto.randomUUID(),
      title: newTitle,
      dueDate: "",
      description: "",
    });
    setNewTitle("");
    setIsAdding(false);
  };

  const filteredCards = (list.cards || []).filter(
    (card) =>
      card &&
      card.title &&
      card.title.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      (statusFilter === "ALL" || card.status === statusFilter)
  );

  return (
    <div className="list-column">
      <input
        className="list-title-input"
        value={list.title}
        onChange={(e) => onChangeListTitle(list.id, e.target.value)}
        placeholder="리스트 제목 입력"
      />
      <button
        className="delete-list-btn"
        onClick={() => onDeleteList(list.id)}
        title="리스트 삭제"
      >
        ❌
      </button>

      <Droppable droppableId={list.id.toString()}>
        {(provided) => (
          <div
            className="card-stack"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {filteredCards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id.toString()} index={index}>
                {(provided) => (
                  <div
                    className="card"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onCardClick(card)}
                  >
                    <TaskCard card={card} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {isAdding ? (
        <div className="add-card-form">
          <input
            type="text"
            placeholder="카드 제목 입력"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <div className="btn-row">
            <button className="add" onClick={handleConfirmAdd}>
              추가
            </button>
            <button
              className="cancel"
              onClick={() => {
                setIsAdding(false);
                setNewTitle("");
              }}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <button className="add-card-btn" onClick={() => setIsAdding(true)}>
          + 카드 추가
        </button>
      )}
    </div>
  );
}
