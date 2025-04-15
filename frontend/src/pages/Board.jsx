// src/pages/Board.jsx
import { useState } from "react";
import TaskCard from "../components/TaskCard";

const initialTasks = [];

export default function Board() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [filter, setFilter] = useState("ALL");

  const handleAddTask = () => {
    if (newTaskTitle.trim() === "") return;

    const newTask = {
      id: tasks.length + 1,
      title: newTaskTitle,
      status: "TODO",
      createdAt: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      dueDate: newTaskDueDate || "미정",
      comments: 0,
      checklist: "0/1",
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskDueDate("");
  };

  const filteredTasks =
    filter === "ALL" ? tasks : tasks.filter((task) => task.status === filter);

  const statusList = ["TODO", "DOING", "DONE"];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-screen-md mx-auto mb-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">📋 MyTaskBoard</h1>

        {/* 입력창 */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            type="text"
            className="flex-1 p-2 rounded border"
            placeholder="할 일 제목 입력"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <input
            type="date"
            className="p-2 rounded border"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
          />
          <button
            onClick={handleAddTask}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            + 추가
          </button>
        </div>

        {/* 필터 버튼 */}
        <div className="flex gap-3 mb-6">
          {["ALL", ...statusList].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded ${
                filter === s ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* 카드 리스트 */}
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} {...task} />
          ))}
        </div>
      </div>
    </div>
  );
}
