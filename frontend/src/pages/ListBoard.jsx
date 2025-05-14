import React, { useState, useEffect } from "react";
import ListColumn from "../components/ListColumn";
import CardModal from "../components/CardModal";
import axios from "../utils/axiosInstance";
import { DragDropContext } from "react-beautiful-dnd";

export default function ListBoard({ user }) {
  const [lists, setLists] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchListsAndCards = async () => {
      try {
        const encodedEmail = encodeURIComponent(user.email);
        const [listsRes, cardsRes] = await Promise.all([
          axios.get(`/lists/${encodedEmail}`),
          axios.get(`/cards`),
        ]);

        const listMap = {};
        listsRes.data.forEach((list) => {
          listMap[list.id] = { ...list, cards: [] };
        });

        cardsRes.data.forEach((card) => {
          if (listMap[card.listId]) {
            listMap[card.listId].cards.push(card);
          }
        });

        setLists(Object.values(listMap));
      } catch (error) {
        console.error("❌ 리스트/카드 로딩 실패", error);
      }
    };

    if (user?.email) fetchListsAndCards();
  }, [user]);

  const createTask = async (listId, title) => {
    try {
      const response = await axios.post("/cards", {
        listId,
        title,
        status: "TODO",
        email: user.email,
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
      const response = await axios.put(`/cards/${updatedCard.id}`, updatedCard);
      const savedCard = response.data;
      setLists((prev) =>
        prev.map((list) => {
          const updatedCards = list.cards.map((card) =>
            card.id === savedCard.id ? savedCard : card
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
      await axios.delete(`/cards/${cardId}`);
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
      const response = await axios.post("/lists", {
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
    axios
      .put(`/lists/${listId}`, { title: newTitle })
      .catch((err) => {
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

  const handleDragEnd = async (result) => {
    handleDragEndLocal();
    const { source, destination } = result;
    if (!destination) return;

    const sourceList = lists.find((l) => l.id.toString() === source.droppableId);
    const destList = lists.find((l) => l.id.toString() === destination.droppableId);
    const movedCard = sourceList.cards[source.index];

    if (!movedCard) return;

    // 리스트 이동
    const updatedLists = lists.map((list) => {
      if (list.id === sourceList.id) {
        const newCards = [...list.cards];
        newCards.splice(source.index, 1);
        return { ...list, cards: newCards };
      } else if (list.id === destList.id) {
        const newCards = [...list.cards];
        newCards.splice(destination.index, 0, movedCard);
        return { ...list, cards: newCards };
      }
      return list;
    });

    setLists(updatedLists);

    try {
      await axios.put(`/cards/${movedCard.id}`, {
        ...movedCard,
        listId: destList.id,
        status: destList.title,
      });
    } catch (error) {
      console.error("❌ 카드 드래그 저장 실패", error);
    }
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
        <button className="add-list-btn" onClick={createList}>
          + 리스트 추가
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="list-row">
          {lists.map((list) => (
            <ListColumn
              key={list.id}
              list={list}
              onAddCard={handleAddCard}
              onCardClick={openModal}
              onChangeListTitle={handleChangeListTitle}
              searchKeyword={searchKeyword}
              statusFilter={statusFilter}
            />
          ))}
        </div>
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
