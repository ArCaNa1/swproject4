import React, { useState } from "react";
import ListColumn from "../components/ListColumn";
import CardModal from "../components/CardModal";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function ListBoard() {
  const [lists, setLists] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDragging, setIsDragging] = useState(false);

  const handleAddList = () => {
    const newList = {
      id: uuidv4(),
      title: "새 리스트",
      cards: [],
    };
    setLists((prev) => [...prev, newList]);
  };

  const handleChangeListTitle = (listId, newTitle) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, title: newTitle } : list
      )
    );
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
    if (!isDragging) {
      setSelectedCard(card);
    }
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

  const handleDragStart = () => setIsDragging(true);
  const handleDragEndLocal = () => setTimeout(() => setIsDragging(false), 0);

  const handleDragEnd = (result) => {
    handleDragEndLocal();
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "COLUMN") {
      const reordered = Array.from(lists);
      const [movedList] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, movedList);
      setLists(reordered);
    } else {
      setLists((prevLists) => {
        const sourceListIndex = prevLists.findIndex((l) => l.id === source.droppableId);
        const destListIndex = prevLists.findIndex((l) => l.id === destination.droppableId);

        const newLists = JSON.parse(JSON.stringify(prevLists));

        const sourceCards = newLists[sourceListIndex].cards;
        const destCards = newLists[destListIndex].cards;

        const [movedCard] = sourceCards.splice(source.index, 1);
        destCards.splice(destination.index, 0, movedCard);

        return newLists;
      });
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

        <button className="add-list-btn" onClick={handleAddList}>
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
                        searchKeyword={searchKeyword}
                        statusFilter={statusFilter}
                        onChangeListTitle={handleChangeListTitle}
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
        />
      )}
    </div>
  );
}
