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
import RTools from "@/components/flowtabs/rtools";
import Prompts from "@/components/flowtabs/prompts";
import LLMs from "@/components/flowtabs/llm";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import DocuType from "@/components/flowtabs/documentype";
import VSTools from "@/components/flowtabs/vstools";
import GTools from "@/components/flowtabs/embeddings";
import Nodes from "@/components/templates/self-reflex/nodes";
import Checkers from "@/components/templates/self-reflex/checkers";
import Embeddings from "@/components/flowtabs/embeddings";
import { Panel } from "reactflow";
import SelfTab from "@/components/templates/self-reflex/self-tab";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineSaveAlt } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { initialEdges, initialNodes } from "@/components/templates/self-rag";
import { useRouter } from "next/router";
import Conditionals from "@/components/conditionals";






const getId = (() => {
  let id = 0;
  return () => `dndnode_${id++}`;
})();


const FlowWithPathExtractor = () => {
    /*React Flow requisities*/
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedElements, setSelectedElements] = useState<{
    nodes: Node[];
    edges: Edge[];
  }>({ nodes: [], edges: [] });
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nonDeletableNodes,setnonDeleteableNodes] = useState([])
  const [nonDeletableEdges,setnonDeleteableEdges] = useState([])


  /*Right Tab requisites*/
  const [option, setOption] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<string | null>(null);
  const [isVerbose, setIsVerbose] = useState(false);
  const [temperature, setTemperature] = useState("");
  const [selectedLLM, setSelectedLLM] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [embeddings, setEmbedding] = useState<string | null>(null);
  const [rtools, setRTools] = useState<string | null>(null);
  const [vstools, setVSTools] = useState<string | null>(null);



 const router = useRouter();
 useEffect(() => {
    const loadTemplate = async () => {
      const { template } = router.query; // Assume `template` is the template name
      if (template) {
        try {
          const { initialNodes, initialEdges, nonDeletableNodes, nonDeletableEdges } = await import(`@/components/templates/${template}.js`);
          setNodes(initialNodes);
          setEdges(initialEdges);
          setnonDeleteableNodes(nonDeletableNodes);
          setnonDeleteableEdges(nonDeletableEdges);
        } catch (error) {
          console.error('Error loading template:', error);
        }
      } else {
        // Load a generic or empty template if no template is selected
        setNodes([]);
        setEdges([]);
        setnonDeleteableNodes([]);
        setnonDeleteableEdges([]);
      }
    };

    loadTemplate();
  },[setEdges,setNodes,router.query]);

  const [showModal, setShowModal] = useState(false);
  const [pendingEdges, setPendingEdges] = useState<Edge[]>([]);


  const onConnect = useCallback((params: Connection) => {
    if (!params.source || !params.target) {
      console.error("Source or target is null.");
      return;
    }
  
    const sourceEdges = edges.filter(edge => edge.source === params.source);
    const newEdge: Edge = {
      ...params,
      id: `e${params.source}-${params.target}`,
      data: { condition: sourceEdges.length === 0 ? 'if' : 'else' },
      source: params.source, // Ensure these are not null
      target: params.target  // Ensure these are not null
    };
  
    if (sourceEdges.length < 2) {
      setEdges(prev => addEdge(newEdge, prev));
    } else {
      setPendingEdges([...sourceEdges, newEdge]);
      setShowModal(true);
    }
  }, [edges, setEdges]);
  

  const handleEdgeLabels = useCallback((edgeLabels: { id: string; label: string }[]) => {
    setEdges(eds => eds.map(edge => {
      const label = edgeLabels.find(l => l.id === edge.id);
      return label ? { ...edge, data: { condition: label.label } } : edge;
    }));
    setShowModal(false);
  }, [setEdges]);
 
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


    const canDeleteNode = (nodeId:string) => !(nonDeletableNodes as string[]).includes(nodeId);
    const canDeleteEdge = (edgeId:string) => !(nonDeletableEdges as string[]).includes(edgeId);


  const handleDelete = useCallback(() => {
    const deletableNodes = selectedElements.nodes.filter(node => canDeleteNode(node.id));
    const deletableEdges = selectedElements.edges.filter(edge => canDeleteEdge(edge.id));
  
    if (deletableNodes.length > 0 || deletableEdges.length > 0) {
      setNodes((nds) => nds.filter((node) => 
        !deletableNodes.map(n => n.id).includes(node.id)

      ));
      
      setEdges((eds) => eds.filter((edge) => 
        !deletableEdges.map(e => e.id).includes(edge.id)
      ));
    }
  
    setSelectedElements({ nodes: [], edges: [] });
  }, [canDeleteNode,canDeleteEdge,selectedElements, setNodes, setEdges]);
  

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
    const paths: any = {};
    let counter = 1; // Counter for numerical keys
  
    const visited = new Set();
  
    const findPaths = (nodeId: string, parentPath: any) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
  
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        const nodeKey = counter++; // Increment key for each node
  
        // Initialize the node path with its label
        const nodeLabel = node.data.label || "Unnamed";
  
        if (node.type === "conditional") {
          parentPath[nodeKey] = { [nodeLabel]: {} }; // Create object for conditional node
        } else {
          parentPath[nodeKey] = nodeLabel;
        }
  
        const connectedEdges = edges.filter((edge) => edge.source === nodeId);
        for (const edge of connectedEdges) {
          const edgeLabel = edge.data?.label || "unnamed";
          const targetPath =
            node.type === "conditional" ? parentPath[nodeKey][nodeLabel] : parentPath;
  
          findPaths(edge.target, targetPath[edgeLabel] ? targetPath : targetPath[edgeLabel] = {});
        }
      }
    };
  
    // Start from input nodes or all nodes if none are inputs
    const startNodes = nodes.filter((node) => node.type === "input");
    if (startNodes.length === 0) {
      console.warn("No input nodes found; using all nodes as starting points.");
      startNodes.push(...nodes); // Fallback to all nodes
    }
  
    startNodes.forEach((startNode) => {
      findPaths(startNode.id, paths);
    });
  
    console.log("Extracted paths:", paths); // Debugging
    return paths;
  }, [nodes, edges]);
  
  const exportPathsAsJson = useCallback(() => {
    const pathData = extractPaths();
  
    // Include other relevant fields
    const exportData = {
      llm: selectedLLM,
      doc_type: option,
      embeddings: embeddings,
      retriever_tools: rtools,
      vector_stores: vstools,
      prompts: prompts,
      apiKey: apiKey,
      temperature: temperature,
      isVerbose: isVerbose,
      flowPaths: pathData, // Inject extracted paths here
    };
  
    const jsonString = JSON.stringify(exportData, null, 2);
  
    // Create and trigger download
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "workflow-config.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  
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
  ]);
  
  
 

  const handleDocTypeChange = (type: string | null) => {
    setOption(type);
  };

  const [openIndices, setOpenIndices] = useState<number[]>([]);

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
    "Retriever Techniques": <RTools onRToolsChange={rtoolsChange} />,
    "Vector Store": <VSTools onVSToolsChange={vsToolsChange} />,
    LLMs: <LLMs onLLMSelected={handleLLMSelected} />,
  };

  //sidebar
  const [isExpanded1, setIsExpanded1] = useState(true);
  const [isExpanded2, setIsExpanded2] = useState(true);
  return (
    <div className="flex flex-row h-screen  ">
      <div
        className={`
          w-1/5  bg-neutral flex flex-col shadow-xl border-1 border-black  transition-all duration-600 ease-in-out
          ${isExpanded1 ? "w-1/5" : "w-14 bg-indigo-100"}
        `}
      >

        {/* I want to do freaky shit on template change so that when it loads up correct thingy on selftab */}
        {isExpanded1 && <SelfTab />}
        <button
          onClick={() => setIsExpanded1(!isExpanded1)}
          className="absolute bottom-5 left-2 p-2 rounded-full hover:bg-gray-200 transition-transform duration-300 ease-in-out"
        >
          {isExpanded1 ? <IoIosArrowBack /> : <IoIosArrowForward />}
        </button>
     
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
        <Conditionals
        isOpen={showModal}
        edges={pendingEdges}
        onClose={() => setShowModal(false)}
        onSave={handleEdgeLabels}
        />
      </div>

      <div
        className={` w-1/5  bg-neutral flex flex-col shadow-xl border-1 border-black  transition-all duration-600 ease-in-out ${
          isExpanded2 ? "w-1/5" : "w-14 bg-violet-200"
        }`}
      >
        {isExpanded2 && (
          <div>
            {" "}
            <div className="p-5">
              <h1 className="text-lg font-semibold text-right">Components</h1>
              <hr className="h-[1.5px] my-3 bg-black border-0 " />
            </div>
            <div className="p-5 flex flex-col space-y-2 transition-transform duration-600 overflow-y-auto">
              {Object.entries(components).map(([type, component], index) => (
                <div
                  key={type}
                  className="border-b rounded-md p-3 bg-violet-200 "
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex justify-between flex-row transition-transform duration-60 font-semibold text-black"
                  >
                    <div>{type}</div>
                    <div>
                      <IoIosArrowDown />
                    </div>
                    {/* <span
                  id={`icon-${index}`}
                  className="transition-transform duration-300"
                  dangerouslySetInnerHTML={{
                    __html: openIndices.includes(index) ? minusSVG : plusSVG,
                  }}
                />*/}
                  </button>
                  <div
                    ref={(el: any) => (contentRefs.current[index] = el)}
                    style={{
                      height: openIndices.includes(index)
                        ? contentRefs.current[index]?.scrollHeight
                        : 0,
                    }}
                    className="overflow-hidden transition-[height] bg-violet-200 rounded-md duration-300 ease-in-out"
                  >
                    <div className="py-3">{component}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={() => setIsExpanded2(!isExpanded2)}
          className="absolute bottom-5 right-2 p-2 rounded-full hover:bg-gray-200 transition-transform duration-300 ease-in-out"
        >
          {isExpanded2 ? <IoIosArrowForward /> : <IoIosArrowBack />}
        </button>
      </div>
    </div>
  );
};

const FlowApp = () => (
  <ReactFlowProvider>
    <FlowWithPathExtractor  />
  </ReactFlowProvider>
);

export default FlowApp;
