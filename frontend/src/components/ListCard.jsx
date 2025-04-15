// src/pages/ListBoard.jsx
import React, { useState } from "react";
import ListColumn from "../components/ListColumn";
import { v4 as uuidv4 } from "uuid";

export default function ListBoard() {
  const [lists, setLists] = useState([
    {
      id: uuidv4(),
      title: "회의록",
      cards: [
        { id: uuidv4(), title: "03/24(월)", dueDate: "2025-03-25", description: "" },
        { id: uuidv4(), title: "4월", dueDate: "2025-04-15", description: "" },
      ],
    },
  ]);

  const handleAddCard = (listId, card) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, cards: [...list.cards, { ...card, id: uuidv4() }] }
          : list
      )
    );
  };

  const handleAddList = () => {
    const newList = {
      id: uuidv4(),
      title: `새 리스트`,
      cards: [],
    };
    setLists([...lists, newList]);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-8 flex justify-center items-center gap-2">
        <img src="/icon.png" alt="icon" className="w-8 h-8" /> MyTaskBoard
      </h1>

      <div className="flex flex-col items-center gap-6">
        {lists.map((list) => (
          <ListColumn
            key={list.id}
            list={list}
            onAddCard={handleAddCard}
            onCardClick={(card) => console.log("Open modal:", card)}
          />
        ))}

        {/* 리스트 아래쪽에 리스트 추가 버튼 */}
        <button
          onClick={handleAddList}
          className="bg-blue-100 border-2 border-dashed w-72 p-3 rounded-lg text-center hover:bg-blue-200"
        >
          + 리스트 추가
        </button>
      </div>
    </div>
  );
}
