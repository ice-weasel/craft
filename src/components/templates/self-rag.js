import { useCallback } from 'react';
import ReactFlow, { 
  useNodesState, 
  useEdgesState, 
  addEdge,
  MiniMap,
  Controls
} from 'reactflow';
import 'reactflow/dist/style.css';


const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Start" },
    position: { x: 250, y: 25 },
  },
  {
    id: "2",
    type: "default",
    data: { label: "Retrieve" },
    size: { height: 100, width: 100 },
    position: { x: 250, y: 100 },
  },
 
  {
    id: "3",
    type: "default",
    data: { label : "grade-documents"},
    position: { x:250, y:175 }
  },
  {
    id: "4",
    type: "conditional",
    data: { label: "relevancy-checker" },
    position: { x:250, y:250 },
  },{
    id:"5",
    type:"default",
    data: { label: "Generate" },
    position: { x:250, y:325 },
   },
  {
    id: "6",
    type: "default",
    data: { label: "hallucination-checker" },
    position: { x: 250, y: 400 },
  },
  {
    id: "7",
    type:"default",
    data: { label: "answer-checker" },
    position: {x: 250, y:475}
  },
  {
    id:"8",
    type:"default",
    data : { label: "rewrite-node" },
    position: { x:50, y:250 }
  },
  {
    id: "9",
    type:"default",
    data: { label: "rewrite-node" },
    position: { x:500,y:250 }
  },
  {
    id:"10",
    type:"output",
    data: { label: "Stop" },
    position: { x:250,y:550 }
  }
  ];

  const initialEdges = [
    {
      id:'1-2',
      source:'1',
      target:'2'
    },
    {
      id:'2-3',
      source:'2',
      target:'3'
    },
    {
      id:'3-4',
      source:'3',
      target:'4',
    },
    {
      id:'4-5',
      source:'4',
      target:'5',
      data: { label: 'yes' }
    },
    {
      id:'4-8',
      source:'4',
      target:'8',
      data: { label: 'no' }
    },
    {
      id:'5-6',
      source:'5',
      target:'6'
    },
    {
      id:'6-7',
      source:'6',
      target:'7'
    },
    {
      id:'7-9',
      source:'7',
      target:'9',
      data: { label: 'no' }
    },
    {
      id:'8-2',
      source:'8',
      target:'2'
    },
    {
      id:'9-2',
      source:'9',
      target:'2'
    },
    {
      id:'7-10',
      source:'7',
      target:'10',
      data: { label: 'yes' }
    }

  ]

  // Define which nodes cannot be deleted
const nonDeletableNodes = ['1', '2', '3', '4', '5', '6', '7', '10'];
// Define which edges cannot be deleted
const nonDeletableEdges = ['1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-10'];



export  {initialNodes,initialEdges,nonDeletableNodes,nonDeletableEdges}