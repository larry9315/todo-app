import type { Todo } from "../../types";

type Props = {
  todos: Todo[];
  onToggle: (id: number) => void;
  onRemove: (index: number) => void;
};

export default function TodoList({ todos, onToggle, onRemove }: Props) {
  if (todos.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center">
        No tasks yet. Add your first one above!
      </p>
    );
  }

  return (
    <ul className="max-w-lg mx-auto py-6 space-y-2">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="bg-white shadow-lg border border-gray-300 rounded p-3 flex justify-between items-center"
        >
          <label className="flex flex-1 items-center gap-3">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              className="h-4 w-4 accent-blue-600"
              aria-label={`Mark "${todo.text}" as ${
                todo.completed ? "active" : "completed"
              }`}
            />

            <span
              className={`break-words ${
                todo.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {todo.text}
            </span>
          </label>

          <button
            onClick={() => onRemove(todo.id)}
            className="ml-3 text-red-500 hover:text-red-700"
            aria-label={`Delete "${todo.text}"`}
            title="Delete"
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
}
