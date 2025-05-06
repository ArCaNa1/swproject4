// ListBoard.jsx
import React, { useState, useEffect } from "react";
import ListColumn from "../components/ListColumn";
import CardModal from "../components/CardModal";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function ListBoard({ user }) {
  const [lists, setLists] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const encodedEmail = encodeURIComponent(user.email);
        const response = await axios.get(`http://localhost:8080/api/tasks/${encodedEmail}`);
        const tasks = response.data;
        const grouped = ["TODO", "DOING", "DONE"].map((status) => ({
          id: status,
          title: getStatusTitle(status),
          cards: tasks.filter((t) => t.status === status),
        }));
        setLists(grouped);
      } catch (error) {
        console.error("❌ 작업 가져오기 실패", error);
      }
    };
    if (user?.email) fetchTasks();
  }, [user]);

  const getStatusTitle = (status) => {
    switch (status) {
      case "TODO": return "📝 TODO";
      case "DOING": return "🚧 DOING";
      case "DONE": return "✅ DONE";
      default: return status;
    }
  };

  const createTask = async (email, title, status) => {
    try {
      const response = await axios.post("http://localhost:8080/api/tasks", {
        email,
        title,
        status
      });
      const task = response.data;
      setLists((prev) =>
        prev.map((list) =>
          list.id === status ? { ...list, cards: [...list.cards, task] } : list
        )
      );
    } catch (error) {
      console.error("❌ 생성 오류", error);
    }
  };

  const updateTask = async (updatedCard) => {
    try {
      await axios.put(`http://localhost:8080/api/tasks/${updatedCard.id}`, updatedCard);
      setLists((prevLists) =>
        prevLists.map((list) => {
          const updatedCards = list.cards.map((card) =>
            card.id === updatedCard.id ? updatedCard : card
          );
          return { ...list, cards: updatedCards };
        })
      );
    } catch (error) {
      console.error("❌ 수정 오류", error);
    }
  };

  const deleteTask = async (cardId) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${cardId}`);
      setLists((prevLists) =>
        prevLists.map((list) => ({
          ...list,
          cards: list.cards.filter((card) => card.id !== cardId),
        }))
      );
    } catch (error) {
      console.error("❌ 삭제 오류", error);
    }
  };

  const handleAddCard = (listId, card) => {
    if (user?.email && card?.title) {
      createTask(user.email, card.title, listId);
    }
  };

  const handleChangeListTitle = (listId, newTitle) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, title: newTitle } : list
      )
    );
  };

  const openModal = (card) => {
    if (!isDragging) setSelectedCard(card);
  };
  const closeModal = () => setSelectedCard(null);
  const handleSaveCard = (updatedCard) => updateTask(updatedCard);
  const handleDeleteCard = (cardId) => deleteTask(cardId);

  const handleDragStart = () => setIsDragging(true);
  const handleDragEndLocal = () => setTimeout(() => setIsDragging(false), 0);

  const handleDragEnd = (result) => {
    handleDragEndLocal();
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newLists = JSON.parse(JSON.stringify(lists));
    const sourceList = newLists.find((l) => l.id === source.droppableId);
    const destList = newLists.find((l) => l.id === destination.droppableId);
    const [movedCard] = sourceList.cards.splice(source.index, 1);
    movedCard.status = destList.id;
    destList.cards.splice(destination.index, 0, movedCard);
    setLists(newLists);
    updateTask(movedCard);
  };

  return (
    <div className="board-container">
      <div className="header-controls">
        <input
          type="text"
          placeholder="🔍 제목 검색"
          className="input"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <select
          className="input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">전체</option>
          <option value="TODO">📝 TODO</option>
          <option value="DOING">🚧 DOING</option>
          <option value="DONE">✅ DONE</option>
        </select>
        <button
          className="add-list-btn"
          onClick={() => {
            const newId = `CUSTOM_${Date.now()}`;
            setLists((prev) => [
              ...prev,
              { id: newId, title: "🆕 새 리스트", cards: [] },
            ]);
          }}
        >
          + 리스트 추가
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <Droppable droppableId="board" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div className="list-row" ref={provided.innerRef} {...provided.droppableProps}>
              {lists.map((list, index) => (
                <Draggable draggableId={list.id} index={index} key={list.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ListColumn
                        list={list}
                        onAddCard={handleAddCard}
                        onCardClick={openModal}
                        onChangeListTitle={handleChangeListTitle}
                        searchKeyword={searchKeyword}
                        statusFilter={statusFilter}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={closeModal}
          onSave={handleSaveCard}
          onDelete={handleDeleteCard}
        />
      )}
    </div>
  );
}
