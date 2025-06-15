
import React from 'react';

export const MapLegend = () => {
  return (
    <div className="absolute top-4 left-4 bg-white rounded-md shadow-lg p-3 z-10 border">
      <div className="text-xs font-semibold mb-2 text-gray-800">Légende</div>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 bg-green-500 rounded-full mr-2 border border-gray-300"></div>
        <span className="text-xs text-gray-700">Cueilleurs</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-blue-500 rounded-full mr-2 border border-gray-300"></div>
        <span className="text-xs text-gray-700">Propriétaires</span>
      </div>
    </div>
  );
};
