import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [option, setOption] = useState("");

  // Add task
  const handleAddOption = () => {
    const trimmed = option.trim();
    if (trimmed) {
      setTodoList([...todoList, trimmed]);
      setOption("");
    }
  };

  // Delete task
  const handleDeleteOption = (index) => {
    setTodoList(todoList.filter((_, idx) => idx !== index));
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAddOption();
  };

  return (
    <div className="space-y-4">
      {/* Task List */}
      {todoList.map((item, index) => (
        <div
          key={item}
          className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-md shadow-sm"
        >
          <p className="text-gray-800 dark:text-gray-200 font-medium flex items-center gap-2">
            <span className="text-sm font-semibold text-primary">
              {index < 9 ? `0${index + 1}` : index + 1}.
            </span>
            {item}
          </p>
          <button
            onClick={() => handleDeleteOption(index)}
            className="text-red-500 hover:text-red-700 transition"
            aria-label={`Delete task ${index + 1}`}
          >
            <HiOutlineTrash className="w-5 h-5" />
          </button>
        </div>
      ))}

      {/* Add Task */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Enter task"
          value={option}
          onChange={(e) => setOption(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
          />
             <button
             onClick={handleAddOption}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              aria-label="Add task">
               <HiMiniPlus className="w-5 h-5" />
                Add
              </button>

      </div>
    </div>
  );
};

export default TodoListInput;
