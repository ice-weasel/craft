import { useCallback, useRef, useState } from "react";
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
  OnSelectionChangeParams,
} from "reactflow";
import "reactflow/dist/style.css";
import RTools from "../components/flowtabs/rtools";
import Prompts from "@/components/flowtabs/prompts";
import LLMs from "@/components/flowtabs/llm";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import DocuType from "@/components/flowtabs/documentype";
import WSTools from "@/components/flowtabs/wstools";
import GTools from "@/components/flowtabs/gtools";
import Nodes from "@/components/left/nodes";
import Checkers from "@/components/left/checkers";

const getId = (() => {
  let id = 0;
  return () => `dndnode_${id++}`;
})();

export const toolNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Start" },

    position: { x: 250, y: 25 }

  },
  {
    id:"2",
    type:"default",
    data: { label: "Retrieve" },
    position: { x:250,y:100 }
  },
  {
    id:"3",
    type:"default",
    data: { label: "Generate" },
    position: { x:250,y:200 }
  }
  // ... other initial nodes
];

type NavigationButtonProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

type NextButtonProps = {
  text: string;
  onClick: () => void;
};

const NavigationButton: React.FC<NavigationButtonProps> = ({
  label,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2
      transition-all duration-200 ease-in-out rounded-sm
      ${
        isActive
          ? "bg-slate-300 text-white shadow-lg translate-x-2"
          : "bg-gray-400 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
      }
    `}
  >
    <Image src={label} width="50" height="50" alt="Navigation" />
  </button>
);

const NextButton: React.FC<NextButtonProps> = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="
      group flex items-center gap-2 px-6 py-3 w-full
      bg-white text-black rounded-xl border-2 border-blue-700
      hover:bg-blue-700 hover:text-white transition-all duration-200
      shadow-lg hover:shadow-xl
    "
  >
    <span className="font-medium">{text}</span>
    <ChevronRight
      size={20}
      className="transition-transform group-hover:translate-x-1"
    />
  </button>
);

const FlowWithPathExtractor = () => {
  const navigationItems = [

    { label: "DocuType", imageSrc: "" },
    { label: "Prompts", imageSrc: "" },
    { label: "R_tools", imageSrc: "/tools.png" },
    { label: "WS_tools", imageSrc: "" },
    { label: "G_tools", imageSrc: "" },
    { label: "LLMs", imageSrc: "/ai.png" },

    { label: "", imageSrc: "" },
    { label: "Tools", imageSrc: "/tools.png" },
    { label: "AI", imageSrc: "/ai.png" },

  ];

  const [activeTab, setActiveTab] = useState(0);
  const nextbutton = [
    "Select Document Type",
    "Enter prompt",
    "Select Tools",
    "Select LLMs",
    "Create Workflow",
  ];
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedElements, setSelectedElements] = useState<{
    nodes: Node[];
    edges: Edge[];
  }>({ nodes: [], edges: [] });
  const [nodes, setNodes, onNodesChange] = useNodesState(toolNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  const [option, setOption] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<string | null>(null);

  const [isVerbose, setIsVerbose] = useState(false);
  const [temperature, setTemperature] = useState('');
  const [selectedLLM, setSelectedLLM] = useState<string | null>(null);
  const [apiKey,setApiKey] = useState("");

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleDelete = useCallback(() => {
    const selectedNodeIds = selectedElements.nodes.map((node) => node.id);
    const selectedEdgeIds = selectedElements.edges.map((edge) => edge.id);

    setNodes((nds) => nds.filter((node) => !selectedNodeIds.includes(node.id)));
    setEdges((eds) => eds.filter((edge) => !selectedEdgeIds.includes(edge.id)));
    setSelectedElements({ nodes: [], edges: [] });
  }, [selectedElements, setNodes, setEdges]);

  const onSelectionChange = useCallback((elements: OnSelectionChangeParams) => {
    setSelectedElements({ nodes: elements.nodes, edges: elements.edges });
  }, []);

  const onInit = useCallback((instance: any) => {
    setReactFlowInstance(instance);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();

      const rawData = event.dataTransfer.getData("application/reactflow");
  
      if (!rawData || !reactFlowBounds || !reactFlowInstance) return;
  
      const { type, data } = JSON.parse(rawData);

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
  
      const newNode = {
        id: getId(),
        type, 
        position,
        data, // Applying the custom data to the node
      };
  
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );
  

  const extractPaths = useCallback(() => {
    const paths: any = [];
    const visited = new Set();
  
    const findPaths = (nodeId: any, currentPath: any) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

  
      const node = nodes.find(n => n.id === nodeId);
  
      if (node) {
        currentPath.push({
          id: nodeId,
          label: node.data.label || 'Unnamed',
          type: node.type,
        });
  
        if (node.type === 'default') {
          paths.push([...currentPath]);
        } else {
          const connectedEdges = edges.filter(edge => edge.source === nodeId);
          for (const edge of connectedEdges) {
            findPaths(edge.target, [...currentPath]);
          }



        }
      }
  
      visited.delete(nodeId);  // Allow revisiting nodes on different paths
    };

  
    // Start with 'input' nodes, or all nodes if none are inputs
    const startNodes = nodes.filter(node => node.type === 'input');
    if (startNodes.length === 0) {
      console.warn("No input nodes found; using all nodes as starting points.");
      startNodes.push(...nodes);  // Start from all nodes if no inputs
    }
  
    startNodes.forEach(startNode => {

      findPaths(startNode.id, []);
    });
  
    console.log('Extracted paths:', paths);  // Debugging to check paths content
    return paths.length > 0 ? paths : null;
  }, [nodes, edges]);
  

  const exportPathsAsJson = useCallback(() => {

    // Only export at specific tab
      const pathData = extractPaths();
      
      // Create a complete data object that includes all the information
      const exportData = {
        documentType: option,  // Include the selected document type
        prompts: prompts,      // Include the selected/entered prompts
        llms:selectedLLM,
        apiKey:apiKey,
        temperature:temperature,
        isVerbose:isVerbose,
        flowPaths: pathData,   // Include the original path data
      };
  
      const jsonString = JSON.stringify(exportData, null, 2);
  
      // Create and trigger download
      const blob = new Blob([jsonString], { type: 'application/json' });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      link.download = 'workflow-config.json';  // Changed filename to be more descriptive

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  
      // Optional: Log the exported data
      console.log('Exported workflow configuration:', exportData);
    
  }, [extractPaths, option, prompts,selectedLLM,temperature,isVerbose,apiKey]);  // Added option and prompts to dependencies  // Added option and prompts to dependencies
   // Added option and prompts to dependencies
  // Added option and prompts to dependencies

  // const handleNext = () => {
  //   setActiveTab((prevTab) => prevTab + 1);
  //   exportPathsAsJson();
  // };

  const handleDocTypeChange = (type: string | null) => {
    setOption(type);



  };

  const handlePromptsChange = (prompts: string | null) => {
    setPrompts(prompts);
    console.log("Prompt entered:", prompts);
  };



  const handleLLMSelected = (llm: string | null, temperature : string, isVerbose : boolean) => {
    setSelectedLLM(llm);
    setTemperature(temperature)
    setIsVerbose(isVerbose);
    setApiKey(apiKey);

  }

  return (
    <div className="flex  h-screen bg-[#F0F2F5]">
      <div className="min-w-[30vw] justify-between bg-white flex flex-col ">
        <Nodes />
        <Checkers />
      </div>

      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={onInit}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onSelectionChange={onSelectionChange}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background />
        </ReactFlow>
      </div>

      <div className="w-[20vw]  flex flex-row border-r border-gray-200 bg-white">
        <div className=" p-6">
          <h1 className="text-2xl font-bold text-black mb-6">Create</h1>
          <div className="flex flex-col gap-2 items-center justify-self-start pb-2">
            {navigationItems.map((item, index) => (
              <NavigationButton
                key={index}
                label={item.imageSrc}
                isActive={activeTab === index}
                onClick={() => setActiveTab(index)}
              />
            ))}
          </div>
        </div>


        <div className="bg-white flex flex-col items-center p-12 rounded-xl shadow-sm">
          {activeTab === 0 && (
            <DocuType onDocTypeChange={handleDocTypeChange} />
          )}
          {activeTab === 1 && <Prompts onpromptsChange={handlePromptsChange} />}
          {activeTab === 2 && <RTools />}
          {activeTab === 3 && <WSTools />}
          {activeTab === 4 && <GTools />}
          {activeTab === 5 && <LLMs onLLMSelected={handleLLMSelected} />}


          <button
            onClick={handleDelete}
            disabled={
              !selectedElements.nodes.length && !selectedElements.edges.length
            }
            style={{
              margin: "10px",
              padding: "10px 20px",
              backgroundColor: "#FF4D4F",
              color: "white",
              cursor: "pointer",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Delete
          </button>
        </div>

        <div className="p-6">
          <button
            onClick={exportPathsAsJson}
            className="
      group flex items-center gap-2 px-6 py-3 w-full
      bg-white text-black rounded-xl border-2 border-blue-700
      hover:bg-blue-700 hover:text-white transition-all duration-200
      shadow-lg hover:shadow-xl
    "
          >
            <span className="font-medium">Create Workflow</span>
            <ChevronRight
              size={20}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

const FlowApp = () => (
  <ReactFlowProvider>
    <FlowWithPathExtractor />
  </ReactFlowProvider>
);

export default FlowApp;
