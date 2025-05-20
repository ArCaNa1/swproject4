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

  const titleToStatus = {
  "📝 TODO": "TODO",
  "🚧 DOING": "DOING",
  "✅ DONE": "DONE",
  "⛔ BLOCKED": "BLOCKED",
  "🕓 POSTPONED": "POSTPONED",
  "⏰ EXPIRED": "EXPIRED",
  "❌ CANCELLED": "CANCELLED",
};


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
          listMap[list.id] = {
            ...list,
            status: list.status,
            cards: [],
          };
        });

        cardsRes.data.forEach((card) => {
          if (listMap[card.listId]) {
            listMap[card.listId].cards.push(card);
          }
        });

        Object.values(listMap).forEach((list) => {
          list.cards.sort((a, b) => a.position - b.position);
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

    // 💡 상태 업데이트: 모든 리스트에서 삭제하고, 해당 리스트에만 삽입
    setLists((prevLists) =>
      prevLists.map((list) => {
        let newCards = list.cards.filter((card) => card.id !== savedCard.id);

        if (list.id === savedCard.listId) {
          newCards.push(savedCard); // 또는 정렬해서 삽입도 가능
        }

        return { ...list, cards: newCards };
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

  
  const updateCardPositions = async (cards) => {
    try {
      await Promise.all(
        cards.map((card, index) =>
          axios.put(`/cards/${card.id}`, {
            ...card,
            position: index, // ✅ 새 순서를 서버에 저장
          })
        )
      );
    } catch (error) {
      console.error("❌ 카드 순서 저장 실패:", error);
    }
  };

  const handleDragEnd = async (result) => {
  handleDragEndLocal();
  const { source, destination } = result;
  if (!destination) return;

  const sourceListId = parseInt(source.droppableId);
  const destListId = parseInt(destination.droppableId);

  const sourceList = lists.find((l) => l.id === sourceListId);
  const destList = lists.find((l) => l.id === destListId);
  const movedCard = sourceList.cards[source.index];

  if (!movedCard) return;

  try {
    // 서버에 카드 위치 업데이트 요청
    const response = await axios.put(`/cards/${movedCard.id}`, {
      ...movedCard,
      listId: destListId,
      status: movedCard.status,
    });

    const updatedCard = response.data;
    console.log("✅ 업데이트된 카드:", updatedCard);

    // 상태 업데이트 (한 번만)
    setLists((prevLists) =>
      prevLists.map((list) => {
        // 해당 카드 제거
        let newCards = list.cards.filter((card) => card.id !== movedCard.id);

        // 대상 리스트에 삽입
        if (list.id === destListId) {
          newCards.splice(destination.index, 0, updatedCard);
          updateCardPositions(newCards);
        }

        return { ...list, cards: newCards };
      })
    );
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
          user={user}
          onClose={closeModal}
          onSave={handleSaveCard}
          onDelete={handleDeleteCard}
        />
      )}
    </div>
  );
}
