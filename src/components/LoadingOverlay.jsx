// src/components/LoadingOverlay.jsx
import React from "react";

const LoadingOverlay = () => {
  return (
    <div className="absolute inset-0 bg-gray-500/40 flex items-center justify-center z-50 rounded-t-2xl">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-red-800 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingOverlay;
