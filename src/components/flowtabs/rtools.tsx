// Tools.tsx
import React from 'react';

const RTools = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div>
      <div 
        className="p-2 border rounded mb-2 cursor-move bg-white"
        onDragStart={(e) => onDragStart(e, 'default')}
        draggable
      >
        Text extractor
      </div>
      <div 
        className="p-2 border rounded mb-2 cursor-move bg-white"
        onDragStart={(e) => onDragStart(e, 'input')}
        draggable
      >
        Image extractor
      </div>
      <div 
        className="p-2 border rounded mb-2 cursor-move bg-white"
        onDragStart={(e) => onDragStart(e, 'output')}
        draggable
      >
        OCR 
      </div>
    </div>
  );
};

export default RTools;