// CustomNode.tsx
import React from 'react';
import { Handle, Position } from 'reactflow';

export default function CustomNode({ data }: any) {
  return (
    <div className="bg-slate-800 text-white rounded-lg p-2 border border-gray-700">
      {data.label}
      <Handle type="source" position={Position.Right} className="bg-gray-300" />
      <Handle type="target" position={Position.Left} className="bg-gray-300" />
    </div>
  );
}
