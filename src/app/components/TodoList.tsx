import { useEffect, useState, useRef } from "react";
import type { Todo } from "../../types";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  todos: Todo[];
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
  onEdit: (id: number, nextText: string) => void;
};

export default function TodoList({ todos, onToggle, onRemove, onEdit }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editingId !== null) inputRef.current?.focus();
  }, [editingId]);

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setDraft(todo.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft("");
  };

  const commitEdit = () => {
    if (editingId === null) return;
    onEdit(editingId, draft);
    setEditingId(null);
    setDraft("");
  };

  return (
    <>
      <motion.ul className="max-w-lg mx-auto py-6 space-y-2" role="list">
        <AnimatePresence>
          {todos.map((todo) => {
            const isEditing = editingId === todo.id;
            return (
              <motion.li
                key={todo.id}
                layout // smooth position changes for all items
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: 8,
                  height: 0,
                  marginTop: 0,
                  marginBottom: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                  borderWidth: 0,
                }}
                transition={{ duration: 0.3 }}
                className="bg-white shadow-lg border border-gray-300 rounded p-3 flex justify-between items-center"
              >
                <div className="flex flex-1 items-center gap-3">
                  <span className="inline-flex w-6 h-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
                    {todo.priority}
                  </span>

                  {!isEditing ? (
                    <>
                      <span
                        onDoubleClick={() => startEdit(todo)}
                        title="Double-click to edit"
                        className={`break-words ${
                          todo.completed
                            ? "line-through text-gray-400"
                            : "cursor-pointer"
                        }`}
                      >
                        {todo.text}
                      </span>

                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => onToggle(todo.id)}
                        className="h-4 w-4 accent-blue-600"
                        aria-label={`Mark "${todo.text}" as ${
                          todo.completed ? "active" : "completed"
                        }`}
                      />
                    </>
                  ) : (
                    <input
                      ref={inputRef}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onBlur={commitEdit} // save on blur
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className="flex-none min-w-0 rounded border border-gray-300 px-2 py-1 text-sm"
                      aria-label={`Edit "${todo.text}"`}
                    />
                  )}
                </div>

                <button
                  onClick={() => onRemove(todo.id)}
                  className="ml-3 text-red-500 hover:text-red-700"
                  aria-label={`Delete "${todo.text}"`}
                  title="Delete"
                >
                  ❌
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      {todos.length === 0 && (
        <p className="text-sm text-gray-500 text-center mt-[-30]">No tasks.</p>
      )}
    </>
  );
}
