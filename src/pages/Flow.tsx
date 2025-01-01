import React, { useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
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
  ControlButton,
  NodeResizer,
  NodeResizeControl,
} from "reactflow";
import "reactflow/dist/style.css";
import RTools from "../components/flowtabs/rtools";
import Prompts from "@/components/flowtabs/prompts";
import LLMs from "@/components/flowtabs/llm";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import DocuType from "@/components/flowtabs/documentype";
import VSTools from "@/components/flowtabs/wstools";
import GTools from "@/components/flowtabs/embeddings";
import Nodes from "@/components/templates/self-reflex/nodes";
import Checkers from "@/components/templates/self-reflex/checkers";
import Embeddings from "@/components/flowtabs/embeddings";
import { Panel } from "reactflow";
import SelfTab from "@/components/templates/self-reflex/self-tab";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineSaveAlt } from "react-icons/md";

const getId = (() => {
  let id = 0;
  return () => `dndnode_${id++}`;
})();

export const toolNodes = [
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
    className: "",
    data: { label: "Generate" },
    position: { x: 250, y: 200 },
  },
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

// const NavigationButton: React.FC<NavigationButtonProps> = ({
//   label,
//   isActive,
//   onClick,
// }) => (
//   <button
//     onClick={onClick}
//     className={`
//       flex items-center gap-2 px-4 py-2
//       transition-all duration-200 ease-in-out rounded-sm
//       ${
//         isActive
//           ? "bg-slate-300 text-white shadow-lg translate-x-2"
//           : "bg-gray-400 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
//       }
//     `}
//   >
//     <Image src={label} width="50" height="50" alt="Navigation" />
//   </button>
// );

// const NextButton: React.FC<NextButtonProps> = ({ text, onClick }) => (
//   <button
//     onClick={onClick}
//     className="
//       group flex items-center gap-2 px-6 py-3 w-full
//       bg-white text-black rounded-xl border-2 border-blue-700
//       hover:bg-blue-700 hover:text-white transition-all duration-200
//       shadow-lg hover:shadow-xl
//     "
//   >
//     <span className="font-medium">{text}</span>
//     <ChevronRight
//       size={20}
//       className="transition-transform group-hover:translate-x-1"
//     />
//   </button>
// );

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
  const [temperature, setTemperature] = useState("");
  const [selectedLLM, setSelectedLLM] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [embeddings, setEmbedding] = useState<string | null>(null);
  const [rtools, setRTools] = useState<string | null>(null);
  const [vstools, setVSTools] = useState<string | null>(null);

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

      const node = nodes.find((n) => n.id === nodeId);

      if (node) {
        currentPath.push({
          id: nodeId,
          label: node.data.label || "Unnamed",
          type: node.type,
        });

        if (node.type === "default") {
          paths.push([...currentPath]);
        } else {
          const connectedEdges = edges.filter((edge) => edge.source === nodeId);
          for (const edge of connectedEdges) {
            findPaths(edge.target, [...currentPath]);
          }
        }
      }

      visited.delete(nodeId); // Allow revisiting nodes on different paths
    };

    // Start with 'input' nodes, or all nodes if none are inputs
    const startNodes = nodes.filter((node) => node.type === "input");
    if (startNodes.length === 0) {
      console.warn("No input nodes found; using all nodes as starting points.");
      startNodes.push(...nodes); // Start from all nodes if no inputs
    }

    startNodes.forEach((startNode) => {
      findPaths(startNode.id, []);
    });

    console.log("Extracted paths:", paths); // Debugging to check paths content
    return paths.length > 0 ? paths : null;
  }, [nodes, edges]);

  const exportPathsAsJson = useCallback(() => {
    // Only export at specific tab
    const pathData = extractPaths();

    // Create a complete data object that includes all the information
    const exportData = {
      llm: selectedLLM,
      doc_type: option,
      embeddings: embeddings,
      retriever_tools: rtools,
      vector_stores: vstools, // Include the selected document type
      prompts: prompts, // Include the selected/entered prompts
      apiKey: apiKey,
      temperature: temperature,
      isVerbose: isVerbose,
      flowPaths: pathData, // Include the original path data
    };

    const jsonString = JSON.stringify(exportData, null, 2);

    // Create and trigger download
    const blob = new Blob([jsonString], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    link.download = "workflow-config.json"; // Changed filename to be more descriptive

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Optional: Log the exported data
    console.log("Exported workflow configuration:", exportData);
  }, [
    extractPaths,
    option,
    prompts,
    selectedLLM,
    temperature,
    isVerbose,
    apiKey,
    embeddings,
    rtools,
    vstools,
  ]); // Added option and prompts to dependencies  // Added option and prompts to dependencies
  // Added option and prompts to dependencies
  // Added option and prompts to dependencies

  // const handleNext = () => {
  //   setActiveTab((prevTab) => prevTab + 1);
  //   exportPathsAsJson();
  // };

  const handleDocTypeChange = (type: string | null) => {
    setOption(type);
  };

  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const minusSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
    <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
  </svg>`;
  // SVG for Plus icon
  const plusSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
    <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
  </svg>`;

  const toggleAccordion = (index: any) => {
    setOpenIndices((prev: any) =>
      prev.includes(index)
        ? prev.filter((i: any) => i !== index)
        : [...prev, index]
    );
  };

  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handlePromptsChange = (prompts: string | null) => {
    setPrompts(prompts);
    console.log("Prompt entered:", prompts);
  };

  const rtoolsChange = (rtools: string | null) => {
    setRTools(rtools);
  };

  const vsToolsChange = (vstools: string | null) => {
    setVSTools(vstools);
  };

  const embeddingsChange = (embeds: string | null) => {
    setEmbedding(embeds);
  };

  const handleLLMSelected = (
    llm: string | null,
    temperature: string,
    isVerbose: boolean
  ) => {
    setSelectedLLM(llm);
    setTemperature(temperature);
    setIsVerbose(isVerbose);
    setApiKey(apiKey);
  };

  const components = {
    "Document Type": <DocuType onDocTypeChange={handleDocTypeChange} />,
    Prompts: <Prompts onpromptsChange={handlePromptsChange} />,
    Embeddings: <Embeddings onEmbeddingsChange={embeddingsChange} />,
    "Retriever Tools": <RTools onRToolsChange={rtoolsChange} />,
    "Vector Store": <VSTools onVSToolsChange={vsToolsChange} />,
    LLMs: <LLMs onLLMSelected={handleLLMSelected} />,
  };

  //sidebar
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex flex-row h-screen  ">
      <div
        className={`
          w-1/5  bg-neutral flex flex-col shadow-xl border-1 border-black  transition-all duration-300 ease-in-out
          ${isExpanded ? "w-1/5" : "w-14"}
        `}
      >
        {isExpanded && <SelfTab />}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`absolute bottom-5 left-2 p-2 rounded-full hover:bg-gray-200 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          <IoIosArrowForward />
        </button>
        {/* <div className="p-3 self-center">
          <p className="self-start font-bold text-1xl">Element Properties :</p>
          <button
            onClick={handleDelete}
            disabled={
              !selectedElements.nodes.length && !selectedElements.edges.length
            }
            className="p-2 rounded-lg   mt-3  bg-red-500 "
          >
            <FaRegTrashAlt />
          </button>
        </div> */}
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
          <Panel
            position="top-center"
            className="bg-white shadow-md rounded-lg p-1 m-2 flex gap-3"
          >
            <button
              onClick={handleDelete}
              disabled={
                !selectedElements.nodes.length && !selectedElements.edges.length
              }
              className="p-2 rounded-lg bg-red-500 text-white disabled:bg-gray-300 hover:bg-red-600 transition-colors"
            >
              <FaRegTrashAlt />
            </button>
            <button
              onClick={exportPathsAsJson}
              className="flex items-center gap-2 px-2 py-1 bg-black text-white rounded-lg hover:bg-violet-500 transition-colors"
            >
              <MdOutlineSaveAlt size={20} />
            </button>
          </Panel>
          <Controls />
          <MiniMap />
          <Background />
        </ReactFlow>
      </div>

      <div className="w-1/5 flex flex-col  bg-indigo-100">
        <div className="p-6 flex flex-col space-y-4 transition-transform duration-600 overflow-y-auto">
          {Object.entries(components).map(([type, component], index) => (
            <div
              key={type}
              className="border-b shadow-md rounded-lg px-7 bg-violet-300 "
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between transition-transform duration-60 font-medium items-center py-5 text-black"
              >
                <span>{type}</span>
                <span
                  id={`icon-${index}`}
                  className="transition-transform duration-300"
                  dangerouslySetInnerHTML={{
                    __html: openIndices.includes(index) ? minusSVG : plusSVG,
                  }}
                />
              </button>
              <div
                ref={(el: any) => (contentRefs.current[index] = el)}
                style={{
                  height: openIndices.includes(index)
                    ? contentRefs.current[index]?.scrollHeight
                    : 0,
                }}
                className="overflow-hidden transition-[height] bg-violet-300 rounded-md duration-300 ease-in-out"
              >
                <div className="py-3">{component}</div>
              </div>
            </div>
          ))}
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
