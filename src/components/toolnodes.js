import { useCallback } from 'react';
import ReactFlow, { 
  useNodesState, 
  useEdgesState, 
  addEdge,
  MiniMap,
  Controls
} from 'reactflow';
import 'reactflow/dist/style.css';


const toolNodes = [
    {
      id: '1',
      type: 'input',
      data: { label: 'Start' },
      position: { x: 250, y: 25 },
    },
    {
      id: '2',
      data: { label: 'Tool 1' },
      position: { x: 100, y: 125 },
    },
    {
      id: '3',
      data: { label: 'Process 2' },
      position: { x: 400, y: 125 },
    },
    {
      id: '4',
      type: 'output',
      data: { label: 'End' },
      position: { x: 250, y: 250 },
    },
  ];
  
  export default toolNodes