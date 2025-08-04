import React, { useRef, useState, useEffect } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    inputRef.current.value = null; // reset file input
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  useEffect(() => {
    // Clean up the object URL when component unmounts or image changes
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-center relative group cursor-pointer hover:bg-gray-300 transition duration-200">
          <LuUser className="w-12 h-12 text-gray-500" />
          <button
            type="button"
            onClick={onChooseFile}
            className="absolute bottom-0 right-0 bg-green-500 text-white p-1 rounded-full shadow hover:bg-green-600 transition"
            title="Upload Photo"
          >
            <LuUpload className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative w-24 h-24">
          <img
            src={previewUrl}
            alt="Profile Preview"
            className="w-full h-full rounded-full object-cover border border-gray-300 dark:border-gray-600"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            title="Remove Photo"
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition"
          >
            <LuTrash className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
