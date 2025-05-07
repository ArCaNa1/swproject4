// ✅ ListBoard.jsx (axios 경로 및 baseURL 정리 포함 전체 수정본)
import React, { useState, useEffect } from "react";
import ListColumn from "../components/ListColumn";
import CardModal from "../components/CardModal";
import axios from "../utils/axiosInstance";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function ListBoard({ user }) {
  const [lists, setLists] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchListsAndTasks = async () => {
      try {
        const encodedEmail = encodeURIComponent(user.email);
        const res = await axios.get(`/api/lists/${encodedEmail}`);
        setLists(res.data);
      } catch (error) {
        console.error("❌ 리스트 및 카드 로딩 실패", error);
      }
    };
    if (user?.email) fetchListsAndTasks();
  }, [user]);

  const createTask = async (listId, title) => {
    try {
      const response = await axios.post("/api/tasks", {
        listId,
        title,
        status: "TODO",
      });
      const newCard = response.data;
      setLists((prev) =>
        prev.map((list) =>
          list.id === listId ? { ...list, cards: [...list.cards, newCard] } : list
        )
      );
    } catch (error) {
      console.error("❌ 카드 생성 실패", error);
    }
  };

  const updateTask = async (updatedCard) => {
    try {
      await axios.put(`/api/tasks/${updatedCard.id}`, updatedCard);
      setLists((prev) =>
        prev.map((list) => {
          const updatedCards = list.cards.map((card) =>
            card.id === updatedCard.id ? updatedCard : card
          );
          return { ...list, cards: updatedCards };
        })
      );
    } catch (error) {
      console.error("❌ 카드 수정 실패", error);
    }
  };

  const deleteTask = async (cardId) => {
    try {
      await axios.delete(`/api/tasks/${cardId}`);
      setLists((prev) =>
        prev.map((list) => ({
          ...list,
          cards: list.cards.filter((card) => card.id !== cardId),
        }))
      );
    } catch (error) {
      console.error("❌ 카드 삭제 실패", error);
    }
  };

  const createList = async () => {
    try {
      const response = await axios.post("/api/lists", {
        email: user.email,
        title: "🆕 새 리스트",
      });
      setLists((prev) => [...prev, { ...response.data, cards: [] }]);
    } catch (error) {
      console.error("❌ 리스트 생성 실패", error);
    }
  };

  const handleAddCard = (listId, card) => {
    if (card?.title) createTask(listId, card.title);
  };

  const handleChangeListTitle = (listId, newTitle) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, title: newTitle } : list
      )
    );
    axios.put(`/api/lists/${listId}`, { title: newTitle }).catch((err) => {
      console.error("❌ 리스트 제목 수정 실패", err);
    });
  };

  const openModal = (card) => {
    if (!isDragging) setSelectedCard(card);
  };
  const closeModal = () => setSelectedCard(null);

  const handleSaveCard = (card) => {
    if (card.id && card.listId) updateTask(card);
    else createTask(card.listId, card.title);
    closeModal();
  };

  const handleDeleteCard = (cardId) => deleteTask(cardId);

  const handleDragStart = () => setIsDragging(true);
  const handleDragEndLocal = () => setTimeout(() => setIsDragging(false), 0);

  const handleDragEnd = (result) => {
    handleDragEndLocal();
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newLists = JSON.parse(JSON.stringify(lists));
    const sourceList = newLists.find((l) => l.id.toString() === source.droppableId);
    const destList = newLists.find((l) => l.id.toString() === destination.droppableId);
    const [movedCard] = sourceList.cards.splice(source.index, 1);
    movedCard.status = destList.title;
    movedCard.listId = destList.id;
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
        <button className="add-list-btn" onClick={createList}>+ 리스트 추가</button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <Droppable droppableId="board" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div className="list-row" ref={provided.innerRef} {...provided.droppableProps}>
              {lists.map((list, index) => (
                <Draggable draggableId={list.id.toString()} index={index} key={list.id}>
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
