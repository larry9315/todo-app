import type { Todo } from "../../types";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  todos: Todo[];
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
};

export default function TodoList({ todos, onToggle, onRemove }: Props) {
  // if (todos.length === 0) {
  //   return (
  //     <p className="text-sm text-gray-500 text-center">
  //       No tasks yet. Add your first one above!
  //     </p>
  //   );
  // }

  return (
    <>
      <motion.ul className="max-w-lg mx-auto py-6 space-y-2" role="list">
        <AnimatePresence>
          {todos.map((todo) => (
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
              <label className="flex flex-1 items-center gap-3">
                <span className="inline-flex w-6 h-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
                  {todo.priority}
                </span>

                <span
                  className={`break-words ${
                    todo.completed ? "line-through text-gray-400" : ""
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
              </label>

              <button
                onClick={() => onRemove(todo.id)}
                className="ml-3 text-red-500 hover:text-red-700"
                aria-label={`Delete "${todo.text}"`}
                title="Delete"
              >
                ❌
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {todos.length === 0 && (
        <p className="text-sm text-gray-500 text-center mt-[-30]">No tasks.</p>
      )}
    </>
  );
}
