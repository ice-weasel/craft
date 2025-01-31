import React, { startTransition, useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useCallback, useRef, useState } from "react";
import { X } from "lucide-react";
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
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import RTools from "@/components/flowtabs/rtools";
import Prompts from "@/components/flowtabs/prompts";
import LLMs from "@/components/flowtabs/llm";
import DocuType from "@/components/flowtabs/documentype";
import VSTools from "@/components/flowtabs/vstools";
import Embeddings from "@/components/flowtabs/embeddings";
import { Panel } from "reactflow";
import SelfTab from "@/components/templates/self-reflex/self-tab";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineSaveAlt } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import Conditionals from "@/components/conditionals";
import { firedb } from "@/app/firebase";
import { getUserData } from "@/utils/authUtils";

export async function getServerSideProps(context: any) {
  return getUserData(context);
}

const getId = (() => {
  let id = 0;
  return () => `dndnode_${id++}`;
})();

const FlowWithPathExtractor = ({ user, uid }: { user: any; uid: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [compLoaded,setisCompLoaded] = useState(false);
  /*React Flow requisities*/
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedElements, setSelectedElements] = useState<{
    nodes: Node[];
    edges: Edge[];
  }>({ nodes: [], edges: [] });
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nonDeletableNodes, setnonDeleteableNodes] = useState([]);
  const [nonDeletableEdges, setnonDeleteableEdges] = useState([]);
  const [group1, setfirstGroup] = useState([]);
  const [group2, setSecondGroup] = useState([]);

  /*Right Tab requisites*/
  const [jsonData, setJsonData] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (jsonString: string) => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [option, setOption] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<string | null>(null);
  const [customtext, setCustomtext] = useState<string | null | undefined>(null);
  const [isVerbose, setIsVerbose] = useState(false);
  const [temperature, setTemperature] = useState<string | null>(null);
  const [selectedLLM, setSelectedLLM] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [embeddings, setEmbedding] = useState<string | null>(null);
  const [rtools, setRTools] = useState<string | null>(null);
  const [vstools, setVSTools] = useState<string | null>(null);

  const { setViewport } = useReactFlow();
  

  const router = useRouter();
  useEffect(() => {
    
    const loadTemplate = async () => {
      const { username, filename } = router.query;

      if (!router.isReady || !uid || !user.username || !filename) return;

      if (username == user.username) {
        try {

          setisCompLoaded(true);
          const projectsRef = collection(
            firedb,
            "Users",
            uid as string,
            "projects"
          );
          const q = query(projectsRef, where("filename", "==", filename));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const project = querySnapshot.docs[0].data();
            const flow = project.flow;

            startTransition (() => {         
              if (flow) {
                const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                setViewport({ x, y, zoom });
              }
              setOption(project.doc_type);
              setEmbedding(project.embeddings);
              setPrompts(project.prompts);
              setRTools(project.retriever_tools);
              setVSTools(project.vector_stores);
              setSelectedLLM(project.llm.llm_name);
            
              setIsVerbose(project.llm.config.isVerbose);
              setTemperature(project.llm.config.temperature);
            })

              console.log("State updated:", {
                doc_type: option,
                embeddings: embeddings,
                prompts: prompts,
                retriever_tools: rtools,
                vector_stores: vstools,
                llm: selectedLLM,
                
                isVerbose: isVerbose,
                temperature: temperature,
              });         
          }
        } catch (error) {
          console.error("Error loading template:", error);
        } finally {
          setIsLoading(false);
         
        }
      }
      else {
        try {
          
          const usersRef = collectionGroup(firedb,"projects");
          const q = query(usersRef,where("username","==",username));
          const querySnapshot = await getDocs(q);
          

          if(!querySnapshot.empty) {
            const project = querySnapshot.docs[0].data();
          
            const flow = project.flow;
         
            setisCompLoaded(true);
            
              if (flow) {
                const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                setViewport({ x, y, zoom });
              }

            setOption(project.doc_type || null);
            setEmbedding(project.embeddings || null);
            setPrompts(project.prompts || null);
            setRTools(project.retriever_tools || null);
            setVSTools(project.vector_stores || null);
            setSelectedLLM(project.llm?.llm_name || null);
            setIsVerbose(project.llm?.config?.isVerbose ?? null);
            setTemperature(project.llm?.config?.temperature ?? null);
              
           
          }
        }catch(error) 
        {
          console.log("Error fetching request",error)
        } finally{
          setIsLoading(false)
          
        }
      }
    };

    loadTemplate();
  }, [
    router.query,
    router.isReady,
  ]);

  console.log


  useEffect(() => {
    const allLoaded = [option, embeddings, prompts, rtools, vstools, selectedLLM, isVerbose, temperature].every(
      (value) => value !== null
    );
  
    if (allLoaded) {
     setisCompLoaded(false);
      console.log("State now:", { option, embeddings, prompts, rtools, vstools, selectedLLM, isVerbose, temperature });
    }
  }, [option, embeddings, prompts, rtools, vstools, selectedLLM, isVerbose, temperature]);
  


  const [showModal, setShowModal] = useState(false);
  const [pendingEdges, setPendingEdges] = useState<Edge[]>([]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) {
        console.error("Source or target is null.");
        return;
      }

      const sourceEdges = edges.filter((edge) => edge.source === params.source);
      const newEdge: Edge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        data: { condition: sourceEdges.length === 0 ? "if" : "else" },
        source: params.source, // Ensure these are not null
        target: params.target, // Ensure these are not null
      };

      if (sourceEdges.length < 2) {
        setEdges((prev) => addEdge(newEdge, prev));
      } else {
        setPendingEdges([...sourceEdges, newEdge]);
        setShowModal(true);
      }
    },
    [edges, setEdges]
  );

  const handleEdgeLabels = useCallback(
    (edgeLabels: { id: string; label: string }[]) => {
      setEdges((eds) =>
        eds.map((edge) => {
          const label = edgeLabels.find((l) => l.id === edge.id);
          return label ? { ...edge, data: { condition: label.label } } : edge;
        })
      );
      setShowModal(false);
    },
    [setEdges]
  );

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

  const canDeleteNode = (nodeId: string) =>
    !(nonDeletableNodes as string[]).includes(nodeId);
  const canDeleteEdge = (edgeId: string) =>
    !(nonDeletableEdges as string[]).includes(edgeId);
  const typedGroup1 = group1 as string[];
  const typedGroup2 = group2 as string[];

  const handleDelete = useCallback(() => {
    // Nodes: hallucination-checker, answer-checker, rewrite-node (9th)

    const deletableNodes = selectedElements.nodes.filter((node) =>
      canDeleteNode(node.id)
    );
    const deletableEdges = selectedElements.edges.filter((edge) =>
      canDeleteEdge(edge.id)
    );

    const deletableNodeIds = deletableNodes.map((node) => node.id);
    const newEdges = [...edges];

    // Check for Group 1 deletion
    if (typedGroup1.some((id) => deletableNodeIds.includes(id))) {
      // Remove Group 1 nodes
      setNodes((nds) => nds.filter((node) => !typedGroup1.includes(node.id)));

      // Remove edges related to Group 1
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            !typedGroup1.includes(edge.source) &&
            !typedGroup1.includes(edge.target)
        )
      );

      // Add a direct connection between Retrieve (id: '2') and Generate (id: '5')
      newEdges.push({ id: "2-5", source: "2", target: "5" });
    }

    // Check for Group 2 deletion
    if (typedGroup2.some((id) => deletableNodeIds.includes(id))) {
      // Remove Group 2 nodes
      setNodes((nds) => nds.filter((node) => !typedGroup2.includes(node.id)));

      // Remove edges related to Group 2
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            !typedGroup2.includes(edge.source) &&
            !typedGroup2.includes(edge.target)
        )
      );

      // Add a direct connection between Generate (id: '5') and Stop (id: '10')
      newEdges.push({ id: "5-10", source: "5", target: "10" });
    }

    // Handle regular deletable nodes and edges
    if (deletableNodes.length > 0 || deletableEdges.length > 0) {
      setNodes((nds) =>
        nds.filter((node) => !deletableNodeIds.includes(node.id))
      );

      setEdges((eds) =>
        eds.filter((edge) => !deletableEdges.map((e) => e.id).includes(edge.id))
      );
    }

    // Update the edges with the new connections
    setEdges((eds) => [...eds, ...newEdges]);

    // Reset selected elements
    setSelectedElements({ nodes: [], edges: [] });
  }, [
    canDeleteNode,
    typedGroup1,
    typedGroup2,
    canDeleteEdge,
    selectedElements,
    setNodes,
    setEdges,
    edges,
  ]);


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
    const visited = new Set();

    const processNode = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const nodeLabel = node.data.label || "Unnamed";

      // Initialize the node's paths
      if (!paths[nodeLabel]) {
        paths[nodeLabel] = {
          yes: null,
          no: null,
        };

        // Special case for rewrite node
        if (nodeLabel.toLowerCase().includes("rewrite")) {
          paths[nodeLabel]["yes"] = "Retrieve";
        }
      }

      // Find all edges from this node
      const connectedEdges = edges.filter((edge) => edge.source === nodeId);

      for (const edge of connectedEdges) {
        const targetNode = nodes.find((n) => n.id === edge.target);
        if (!targetNode) continue;

        const edgeLabel = edge.data?.label?.toLowerCase() || "yes";
        const targetLabel = targetNode.data.label;

        // Set the path based on edge label (yes/no), except for rewrite node
        if (
          (edgeLabel === "yes" || edgeLabel === "no") &&
          !nodeLabel.toLowerCase().includes("rewrite")
        ) {
          paths[nodeLabel][edgeLabel] = targetLabel;
        }

        // Process the target node
        processNode(edge.target);
      }
    };

    // Start from input nodes or all nodes if none are inputs
    const startNodes = nodes.filter((node) => node.type === "input");
    if (startNodes.length === 0) {
      console.warn("No input nodes found; using all nodes as starting points.");
      startNodes.push(...nodes);
    }

    startNodes.forEach((startNode) => {
      processNode(startNode.id);
    });

    console.log("Extracted paths:", paths);
    return paths;
  }, [nodes, edges]);

  const exportPathsAsJson = useCallback(async () => {
    const pathData = extractPaths();
    const { template } = router.query;
    // Include other relevant fields
    const exportData = {
      llm: {
        llm_name: selectedLLM || "groq",
        config: {
          apiKey: apiKey || "23423452342",
          temperature: temperature || "0.3",
          isVerbose: isVerbose || "false",
        },
      },
      doc_type: option || "pdf_type",
      embeddings: embeddings || "hugging_face_type_embeddings",
      retriever_tools: rtools || "multi-query",
      vector_stores: vstools || "chroma_store",
      prompts: prompts || "default",
      customtext: customtext || null,
      template: template || "custom-template",
      flowPaths: pathData, // Inject extracted paths here
    };
    const jsonString = JSON.stringify(exportData, null, 2);

    setJsonData(exportData);

    openModal(jsonString);

    // Create and trigger download
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

  const downloadJson = () => {
    const blob = new Blob([jsonData], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    link.download = "workflow-config.json"; // Changed filename to be more descriptive

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDocTypeChange = async (type: string | null) => {
    console.log("Document Type changed:", type);
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

  const handlePromptsChange = async (
    prompts: string | null,
    customContent?: string | null
  ) => {
    setPrompts(prompts);
    setCustomtext(customContent);
  };

  const rtoolsChange = async (rtools: string | null) => {
    setRTools(rtools);
  };

  const vsToolsChange = async (vstools: string | null) => {
    setVSTools(vstools);
  };

  const embeddingsChange = async (embeds: string | null) => {
    setEmbedding(embeds);
  };

  const handleLLMSelected = async (
    llm: string | null,
    temperature: string,
    isVerbose: boolean,
    apiKey: string
  ) => {
    setSelectedLLM(llm);
    setTemperature(temperature);
    setIsVerbose(isVerbose);
    setApiKey(apiKey);
  };

  const components = {
    "Document Type": <DocuType onDocTypeChange={handleDocTypeChange} currentValue={option} />,
    Prompts: <Prompts onpromptsChange={handlePromptsChange} currentprompts={prompts} />,
    Embeddings: <Embeddings onEmbeddingsChange={embeddingsChange} currentembeddings={embeddings} />,
    "Retriever Techniques": <RTools onRToolsChange={rtoolsChange} currentrtools={rtools} />,
    "Vector Store": <VSTools onVSToolsChange={vsToolsChange} currentvstools={vstools} />,
    LLMs: <LLMs onLLMSelected={handleLLMSelected} currentllm={selectedLLM} currenttemp={temperature} currentVerbose={isVerbose}/>,
  };

  //sidebar
  const [isExpanded1, setIsExpanded1] = useState(true);
  const [isExpanded2, setIsExpanded2] = useState(true);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-row h-screen  ">
      <div
        className={`
          w-1/5  bg-neutral flex flex-col shadow-xl border-1 border-black  transition-all duration-600 ease-in-out h-full
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
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center h-screen">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-bold mb-4">Preview: </h2>
            <div className="mb-6">
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
                {jsonData
                  ? JSON.stringify(jsonData, null, 2)
                  : "No data loaded"}
              </pre>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={downloadJson}
                className="px-3 py-2 bg-black text-white rounded-md hover:bg-neutral-700 transition-colors"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

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
  {compLoaded ? ( // Show loader while data is being fetched
    <div className="flex justify-center items-center h-40">
      <span className="text-gray-600">Loading components...</span>
    </div>
  ) : (
    Object.entries(components).map(([type, component], index) => (
      <div key={type} className="border-b rounded-md p-3 bg-violet-200">
        <button
          onClick={() => toggleAccordion(index)}
          className="w-full flex justify-between flex-row transition-transform duration-60 font-semibold text-black"
        >
          <div>{type}</div>
          <div>
            <IoIosArrowDown />
          </div>
        </button>
        <div
          ref={(el: any) => (contentRefs.current[index] = el)}
          style={{
            height: openIndices.includes(index)
              ? contentRefs.current[index]?.scrollHeight
              : 0,
          }}
          className="overflow-y-auto transition-[height] bg-violet-200 rounded-md duration-300 ease-in-out"
        >
          <div className="py-3">{component}</div>
        </div>
      </div>
    ))
  )}
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

const FlowApp = ({ user }: any) => (
  <ReactFlowProvider>
    <FlowWithPathExtractor user={user} uid={user.uid} />
  </ReactFlowProvider>
);

export default FlowApp;
