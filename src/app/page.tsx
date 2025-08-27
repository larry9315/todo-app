"use client";

import { useState, useEffect, useMemo } from "react";
import TodoList from "./components/TodoList";
import type { Todo } from "../types";

type Filter = "all" | "active" | "completed";
const STORAGE_KEY = "todos-v1";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setTodos(JSON.parse(raw) as Todo[]);
      }
    } catch {
      alert("failed to load");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

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
  const remaining = todos.filter((t) => !t.completed).length;

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.completed);
      case "completed":
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

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

        <div className="flex w-1/2 mx-auto mt-[2em] justify-center rounded-md border border-gray-300 overflow-hidden">
          <button
            onClick={() => setFilter("all")}
            className={`flex-auto px-3 py-1 text-sm ${
              filter === "all" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`flex-auto px-3 py-1 text-sm border-l border-gray-300 ${
              filter === "active"
                ? "bg-gray-100 font-medium"
                : "hover:bg-gray-50"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`flex-auto px-3 py-1 text-sm border-l border-gray-300 ${
              filter === "completed"
                ? "bg-gray-100 font-medium"
                : "hover:bg-gray-50"
            }`}
          >
            Done
          </button>
        </div>

        <TodoList
          todos={visibleTodos}
          onToggle={toggleTodo}
          onRemove={removeTodo}
        />

        <div className="flex flex-row justify-around gap-3 pt-2">
          <span className="text-sm text-gray-600">
            {remaining} item{remaining !== 1 ? "s" : ""} left
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
