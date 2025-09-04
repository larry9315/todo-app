"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TodoList from "./components/TodoList";
import type { Todo } from "../types";

type Filter = "all" | "active" | "completed";
const STORAGE_KEY = "todos-v1";

const renumber = (list: Todo[]): Todo[] =>
  list.map((t, i) => ({ ...t, priority: i + 1 }));

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
    setTodos((prev) =>
      renumber([
        ...prev,
        {
          id: Date.now(),
          text,
          completed: false,
          priority: prev.length + 1,
          tags: [],
        },
      ])
    );
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const removeTodo = (id: number) => {
    setTodos((prev) => renumber(prev.filter((element) => element.id !== id)));
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const editTodo = (id: number, nextText: string) => {
    const text = nextText.trim();
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, text: text === "" ? t.text : text } : t
      )
    );
  };

  const addTag = (id: number, tag: string) => {
    const clean = tag.trim().toLowerCase();
    if (!clean) return;
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, tags: Array.from(new Set([...(t.tags ?? []), clean])) }
          : t
      )
    );
  };

  const removeTag = (id: number, tag: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, tags: (t.tags ?? []).filter((x) => x !== tag) }
          : t
      )
    );
  };

  const clearCompleted = () => {
    setTodos((prev) => renumber(prev.filter((t) => !t.completed)));
  };

  const hasCompleted = todos.some((t) => t.completed);
  const isEmptyInput = input.trim().length === 0;
  const remaining = todos.filter((t) => !t.completed).length;

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    todos.forEach((t) => (t.tags ?? []).forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, [todos]);

  const baseTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.completed);
      case "completed":
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const visibleTodos = useMemo(() => {
    const q = search.trim().toLowerCase();
    return baseTodos.filter((t) => {
      const matchesSearch =
        q.length === 0 ||
        t.text.toLowerCase().includes(q) ||
        (t.tags ?? []).some((tag) => tag.includes(q));

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => (t.tags ?? []).includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [todos, filter]);

  const toggleSelectedTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearTagFilters = () => setSelectedTags([]);

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-200 p-8">
      <div className="flex-auto max-w-2xl h-[70vh] bg-white space-y-4 border border-black rounded-2xl p-8 overflow-auto">
        <h1 className="text-4xl font-bold text-center mb-10">To-Do List</h1>

        <div className="flex w-[30rem] mx-auto gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a task..."
            className="flex-[9] p-2 border border-gray-300 rounded-lg"
          />

          {!isEmptyInput && (
            <button
              onClick={addTodo}
              disabled={isEmptyInput}
              className={`flex-[1] px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-600`}
            >
              Add
            </button>
          )}
        </div>

        <div className="flex w-[30rem] mx-auto items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks or tags..."
            className="flex-[9] p-2 border border-gray-300 rounded-lg"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-md flex-[1] px-4 py-2 rounded text-white bg-blue-600"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex w-3/5 mx-auto mt-[2em] justify-center rounded-md border border-gray-300 overflow-hidden">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-1 text-sm ${
              filter === "all" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`flex-1 py-1 text-sm border-l border-gray-300 ${
              filter === "active"
                ? "bg-gray-100 font-medium"
                : "hover:bg-gray-50"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`flex-1 py-1 text-sm border-l border-gray-300 ${
              filter === "completed"
                ? "bg-gray-100 font-medium"
                : "hover:bg-gray-50"
            }`}
          >
            Completed
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter} // <- change triggers exit/enter
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }} // tweak to taste
          >
            <TodoList
              todos={visibleTodos}
              onToggle={toggleTodo}
              onRemove={removeTodo}
              onEdit={editTodo}
            />
          </motion.div>
        </AnimatePresence>

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
            Clear Completed
          </button>
        </div>
      </div>
    </main>
  );
}
