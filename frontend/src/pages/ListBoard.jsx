import React, { useState } from "react";
import ListColumn from "../components/ListColumn";
import CardModal from "../components/CardModal";
import { v4 as uuidv4 } from "uuid";

export default function ListBoard() {
  const [lists, setLists] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const handleAddList = () => {
    const newList = {
      id: uuidv4(),
      title: "",
      cards: [],
    };
    setLists((prev) => [...prev, newList]);
  };

  const handleAddCard = (listId, card) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, cards: [...list.cards, { ...card, id: uuidv4() }] }
          : list
      )
    );
  };

  const openModal = (card) => {
    setSelectedCard(card);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  const handleSaveCard = (updatedCard) => {
    setLists((prevLists) =>
      prevLists.map((list) => {
        const hasCard = list.cards.some((card) => card.id === updatedCard.id);
        if (!hasCard) return list;

        const updatedCards = list.cards.map((card) =>
          card.id === updatedCard.id ? updatedCard : card
        );

        return { ...list, cards: updatedCards };
      })
    );
  };

  const getFilteredCards = (cards) => {
    return cards.filter((card) => {
      const matchKeyword = card.title.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchStatus = statusFilter === "ALL" || card.status === statusFilter;
      return matchKeyword && matchStatus;
    });
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

        <button className="add-list-btn" onClick={handleAddList}>
          + 리스트 추가
        </button>
      </div>

      <div className="list-row">
        {lists.map((list) => {
          const filteredCards = getFilteredCards(list.cards);
          return (
            <ListColumn
              key={list.id}
              list={{ ...list, cards: filteredCards }}
              onAddCard={handleAddCard}
              onCardClick={openModal}
            />
          );
        })}
      </div>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={closeModal}
          onSave={handleSaveCard}
        />
      )}
    </div>
  );
}
