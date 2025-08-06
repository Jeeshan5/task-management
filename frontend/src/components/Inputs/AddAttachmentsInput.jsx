import React, { useState } from 'react';
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";

const AddAttachmentsInput = ({ attachments, setAttachments }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    const trimmed = option.trim();
    if (trimmed) {
      setAttachments([...attachments, trimmed]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedArr = attachments.filter((_, idx) => idx !== index);
    setAttachments(updatedArr);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAddOption();
  };

  return (
    <div className="space-y-4">
      {/* Attachment List */}
      {attachments.map((item, index) => (
        <div
          key={item + index}
          className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-md shadow-sm"
        >
          <div className="flex items-center gap-3 text-gray-800 dark:text-gray-200">
            <LuPaperclip className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <p className="break-all">{item}</p>
          </div>
          <button
            onClick={() => handleDeleteOption(index)}
            className="text-red-500 hover:text-red-700 transition"
            aria-label={`Delete attachment ${index + 1}`}
          >
            <HiOutlineTrash className="w-5 h-5" />
          </button>
        </div>
      ))}

      {/* Add Attachment */}
      <div className="flex items-center gap-3">
        <div className="flex items-center flex-1 gap-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white">
          <LuPaperclip className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Add file link"
            value={option}
            onChange={(e) => setOption(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent outline-none"
          />
        </div>
        <button
          onClick={handleAddOption}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <HiMiniPlus className="w-5 h-5" />
          Add
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentsInput;
