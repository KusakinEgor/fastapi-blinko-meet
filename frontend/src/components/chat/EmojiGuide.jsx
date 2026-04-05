import React from "react";
import { EMOJI_CATEGORIES } from "../../lib/chat/emojiMap";
import { useNavigate } from "react-router-dom";

export default function EmojiGuide({ onSelect }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] p-6 relative">
      <button
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-[#2a2a2a] shadow-md hover:bg-[#3a3a3a] transition-all duration-200 transform hover:scale-110"
        title="Back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="bg-[#1c1c1c] p-6 rounded-3xl shadow-2xl w-full max-w-5xl relative">
        <h2 className="text-3xl font-bold mb-4 text-center text-white">
          Emoji Guide
        </h2>
        <p className="text-gray-400 mb-6 text-center">
          Type{" "}
          <code className="bg-gray-800 px-1 py-0.5 rounded">:emoji_name:</code>{" "}
          in chat to insert an emoji.
        </p>

        {Object.entries(EMOJI_CATEGORIES).map(([categoryName, emojis]) => (
          <div key={categoryName} className="mb-8">
            <h3 className="text-white font-semibold mb-3 text-lg">
              {categoryName}
            </h3>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
              {Object.entries(emojis).map(([key, { src, alt }]) => (
                <div
                  key={key}
                  className="flex flex-col items-center cursor-pointer bg-[#2a2a2a] p-2 rounded-xl transition-transform duration-200 ease-in-out hover:scale-110 hover:shadow-lg active:scale-95 flex-shrink-0"
                  onClick={() => onSelect && onSelect(`:${key}:`)}
                  title={`:${key}:`}
                >
                  <img
                    src={src}
                    alt={alt}
                    className="w-12 h-12 object-contain mb-1"
                  />
                  <span className="text-gray-300 text-xs truncate text-center">
                    :{key}:
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
