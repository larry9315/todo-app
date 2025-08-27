"use client";

import { useState, useEffect, useMemo } from "react";
import TodoList from "./components/TodoList";
import type { Todo } from "../types";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: Date.now(), text, completed: false }]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const removeTodo = (id: number) => {
    setTodos((prev) => prev.filter((element) => element.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const hasCompleted = todos.some((t) => t.completed);
  const isEmptyInput = input.trim().length === 0;

  return (
    <main className="min-h-screen bg-gray-200 p-8">
      <div className="max-w-2xl bg-white mx-auto space-y-4 border-1 border-black rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-center mb-10">To-Do List</h1>

        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a task..."
            className="flex-[9] p-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={addTodo}
            disabled={isEmptyInput}
            className={`flex-[1] px-4 py-2 rounded text-white ${
              isEmptyInput
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Add
          </button>
        </div>

        <TodoList todos={todos} onToggle={toggleTodo} onRemove={removeTodo} />

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-600">
            {todos.length} item{todos.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={clearCompleted}
            disabled={!hasCompleted}
            className={`text-sm px-3 py-1 rounded ${
              hasCompleted
                ? "text-red-600 hover:bg-red-50"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            Clear completed
          </button>
        </div>
      </div>
    </main>
  );
}
