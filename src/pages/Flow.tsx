import { useCallback, useRef, useState } from 'react';
import "tailwindcss/tailwind.css";
import ReactFlow, { 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  ReactFlowProvider,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Tools from '../components/flowtabs/tools';

const getId = (() => {
  let id = 0;
  return () => `dndnode_${id++}`;
})();

export const toolNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 25 },
  },
  // ... other initial nodes
];

type NavigationButtonProps = {
  number: number;
  isActive: boolean;
  onClick: () => void;
};

type NextButtonProps = {
  text: string;
  onClick: () => void;
};


const NavigationButton: React.FC<NavigationButtonProps> = ({ number, isActive, onClick }) => (
  <p
    onClick={onClick}
    className={`p-2 min-w-[40px] transition-colors ${
      isActive 
        ? "bg-blue-600 text-white border-blue-700" 
        : "bg-white text-gray-700 hover:bg-gray-100"
    } border rounded-md`}
  >
    {number}
  </p>
);

const NextButton: React.FC<NextButtonProps> = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="bg-blue-600 text-white p-2 border rounded-md hover:bg-blue-700 transition-colors"
  >
    {text}
  </button>
);


const FlowWithPathExtractor = () => {

  const [activeTab, setActiveTab] = useState(0);
  const nextbutton = ["Enter prompt", "Select Tools", "Select LLMs"];

  const handleNext = () => {
    setActiveTab((prevTab) => (prevTab + 1) % nextbutton.length);
  }

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(toolNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onInit = useCallback((instance: any) => {
    setReactFlowInstance(instance);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (!type || !reactFlowBounds || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  return (
    <div className="flex flex-row">
      <div className="flex flex-col w-64 bg-gray-100 p-4">
      <Tools/>
      </div>

      <div className="flex-1 mt-12" style={{ height: '100vh' }}>
        <ReactFlowProvider>
          <div className="reactflow-wrapper w-full h-full" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={onInit}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
            >
              <Controls />
              <MiniMap />
              <Background />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default FlowWithPathExtractor;