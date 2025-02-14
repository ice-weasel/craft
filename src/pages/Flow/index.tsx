import React from "react";
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
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineSaveAlt } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { FiUploadCloud } from "react-icons/fi";
import Conditionals from "@/components/conditionals";
import { collection, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { firedb } from "@/app/firebase";
import { ReactFlowInstance } from "reactflow";
import { getUserData } from "@/utils/authUtils";
import { RiShareForwardLine } from "react-icons/ri";
import { ChatGroq } from "@langchain/groq";
import "@/styles/styles.css";
//Cookie verification
export async function getServerSideProps(context: any) {
  return getUserData(context);
}

const getId = (() => {
  let id = 0;
  return () => `dndnode_${id++}`;
})();

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Start" },
    position: { x: 250, y: 25 },
    className: "custom-node",
  },
  {
    id: "10",
    type: "output",
    data: { label: "Stop" },
    position: { x: 250, y: 175 },
    className: "custom-node",
  },
];

const FlowWithPathExtractor = ({ user, uid }: { user: any; uid: string }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [jsonData, setJsonData] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<
    ReactFlowInstance | any
  >(null);

  const [selectedElements, setSelectedElements] = useState<{
    nodes: Node[];
    edges: Edge[];
  }>({ nodes: [], edges: [] });

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [filename, setFileName] = useState("");
  const [ispublic, setIsPublic] = useState(true);

  const openSaveModal = () => setSaveModalOpen(true);
  const closeSaveModal = () => setSaveModalOpen(false);

  const [option, setOption] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<string | null>(null);
  const [isVerbose, setIsVerbose] = useState(false);
  const [temperature, setTemperature] = useState("");
  const [selectedLLM, setSelectedLLM] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [embeddings, setEmbedding] = useState<string | null>(null);
  const [rtools, setRTools] = useState<string | null>(null);
  const [vstools, setVSTools] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const openModal = (jsonString: string) => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingEdges, setPendingEdges] = useState<Edge[]>([]);
  const [customtext, setCustomtext] = useState<string | null | undefined>(null);

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

  const handleDelete = useCallback(() => {
    const selectedNodeIds = selectedElements.nodes.map((node) => node.id);
    const selectedEdgeIds = selectedElements.edges.map((edge) => edge.id);

    setNodes((nds) => nds.filter((node) => !selectedNodeIds.includes(node.id)));
    setEdges((eds) => eds.filter((edge) => !selectedEdgeIds.includes(edge.id)));
    setSelectedElements({ nodes: [], edges: [] });
  }, [selectedElements, setNodes, setEdges]);

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

  const onInit = useCallback((instance: ReactFlowInstance) => {
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
        className: "custom-node",
        data, // Applying the custom data to the node
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const router = useRouter();

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

  const exportPathsAsJson = useCallback(() => {
    // Only export at specific tab
    const pathData = extractPaths();
    const { template } = router.query;
    // Create a complete data object that includes all the information
    const exportData = {
      llm: {
        llm_name: selectedLLM || "groq",
        config: {
          apiKey:
            apiKey ||
            "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",
          temperature: temperature || "0.3",
          isVerbose: isVerbose || "false",
        },
      },
      doc_type: option || "pdf_type",
      embeddings: embeddings || "hugging_face",
      retriever_tools: rtools || "multi_query",
      vector_stores: vstools || "chroma_store",
      prompts: prompts || "default",
      customtext: customtext || null,
      template: template || "custom-template",
      flowPaths: pathData, // Inject extracted paths here
    };

    const jsonString = JSON.stringify(exportData, null, 2);

    setJsonData(exportData);

    openModal(jsonString);
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

  const saveFile = async (
    jsonData: any,
    filename: string,
    ispublic: boolean
  ) => {
    try {
      // Get the current date and format it as "dd-month-yyyy"

      const flow = reactFlowInstance.toObject();
      console.log("This is toFlow", flow);

      const today = new Date();
      const formattedDate = today.toLocaleString("default", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      // Reference to the "projects" subcollection under the current user
      const fileDocRef = doc(
        collection(firedb, "Users", uid as string, "projects")
      );

      // Prepare the data to be saved
      const projectData = {
        username: user.username,
        filename, // Project file name
        isPublic: ispublic, // Visibility of the project
        createdAt: formattedDate, // Formatted creation date
        llm: {
          llm_name: selectedLLM || "Groq",
          config: {
            apiKey:
              apiKey ||
              "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",
            temperature: temperature || "0.3",
            isVerbose: isVerbose || "false",
          },
        },
        doc_type: option || "PDF",
        embeddings: embeddings || "hugging_face",
        retriever_tools: rtools || "Multi_Query",
        vector_stores: vstools || "Chroma_store",
        prompts: prompts || "default",
        customtext: customtext || null,
        flow: flow, // Save flow as stringified JSON
      };

      // Save the document to Firestore
      await setDoc(fileDocRef, projectData);

      console.log("File saved successfully!");
      closeModal();
      closeSaveModal();
    } catch (error) {
      console.error("Error saving file to Firestore:", error);
    }
  };

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
    isVerbose: boolean,
    apiKey: string
  ) => {
    setSelectedLLM(llm);
    setTemperature(temperature);
    setIsVerbose(isVerbose);
    setApiKey(apiKey);
  };

  const components = {
    "Document Type": (
      <DocuType onDocTypeChange={handleDocTypeChange} currentValue={option} />
    ),
    Prompts: (
      <Prompts onpromptsChange={handlePromptsChange} currentprompts={prompts} />
    ),
    Embeddings: (
      <Embeddings
        onEmbeddingsChange={embeddingsChange}
        currentembeddings={embeddings}
      />
    ),
    "Retriever Techniques": (
      <RTools onRToolsChange={rtoolsChange} currentrtools={rtools} />
    ),
    "Vector Store": (
      <VSTools onVSToolsChange={vsToolsChange} currentvstools={vstools} />
    ),
    LLMs: (
      <LLMs
        onLLMSelected={handleLLMSelected}
        currentllm={selectedLLM}
        currenttemp={temperature}
        currentVerbose={isVerbose}
      />
    ),
  };

  //sidebar
  const [isExpanded1, setIsExpanded1] = useState(true);
  const [isExpanded2, setIsExpanded2] = useState(true);

  //

  return (
    <div className="flex flex-row min-h-[100vh]  ">
      <div
        className={`
          w-1/5   bg-zinc-900 flex flex-col shadow-xl border-2 border-black max-h-[100vh] overflow-auto  transition-all duration-600 ease-in-out
          ${isExpanded1 ? "w-1/5" : "w-14 bg-indigo-100"}
        `}
      >
        {isExpanded1 && <SelfTab />}
        <button
          onClick={() => setIsExpanded1(!isExpanded1)}
          className="absolute bottom-5 left-2 p-2 rounded-full bg-indigo-500 hover:bg-gray-200 transition-transform duration-300 ease-in-out"
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
            className="bg-zinc-900 shadow-md rounded-lg p-1.5 m-2 flex gap-3"
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
              //onClick={openModal}
              className="flex items-center gap-2 px-2 py-1 bg-zinc-800 text-white rounded-lg hover:bg-indigo-400 transition-colors"
            >
              <MdOutlineSaveAlt size={20} />
            </button>
            <button
              onClick={() => {
                openSaveModal();
                exportPathsAsJson();
              }}
              className="flex items-center gap-2 px-2 py-1 bg-zinc-800 text-white rounded-lg hover:bg-indigo-400 transition-colors"
            >
              <FiUploadCloud size={20} />
            </button>
            <button className="flex items-center gap-2 px-2 py-1 bg-zinc-800 text-white rounded-lg hover:bg-green-600 transition-colors group">
              <RiShareForwardLine size={20} />
              <span className="invisible group-hover:visible absolute bg-gray-100 text-black p-2  text-xs mt-16 ml-6 rounded-md">
                Host
              </span>
            </button>
          </Panel>
          <Controls />

          <Background className="bg-zinc-800" />
        </ReactFlow>
        <Conditionals
          isOpen={showModal}
          edges={pendingEdges}
          onClose={() => setShowModal(false)}
          onSave={handleEdgeLabels}
        />
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
      {saveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                closeModal();
                closeSaveModal();
              }}
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
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent page reload
                saveFile(jsonData, filename, ispublic); // Pass the latest jsonData value
              }}
            >
              <input
                type="text"
                onChange={(e) => setFileName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                required
                placeholder="Enter File Name"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="active:bg-violet-500 focus:ring-violet-500"
                />
                <label className="font-medium ">Make your project public</label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-3 py-2 mt-3  bg-black text-white rounded-md hover:bg-neutral-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div
        className={` w-1/5  bg-zinc-900 flex flex-col shadow-xl border-1 border-black  transition-all duration-600 ease-in-out ${
          isExpanded2 ? "w-1/5" : "w-14 bg-violet-200"
        }`}
      >
        {isExpanded2 && (
          <div className="p-5">
            {" "}
            <div className=" bg-zinc-900 p-5">
              <h1 className="text-lg  text-white font-semibold text-right">
                Components
              </h1>
              <hr className="h-[1.5px] my-3 bg-indigo-500 border-0 " />
            </div>
            <div className="p-5 flex flex-col bg-zinc-800 rounded-lg space-y-3 transition-transform duration-600 overflow-y-auto max-h-[90vh]">
              {Object.entries(components).map(([type, component], index) => (
                <div
                  key={type}
                  className="border-1 border-indigo-300 rounded-md p-3 bg-indigo-300 "
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex justify-between flex-row transition-transform duration-60 font-semibold text-black"
                  >
                    <div>{type}</div>
                    <div>
                      <IoIosArrowDown />
                    </div>

                    <div className="p-5 flex flex-col bg-zinc-800 rounded-lg space-y-3 transition-transform duration-600 overflow-y-auto max-h-[80vh]">
                      {Object.entries(components).map(([type, component], index) => (
                        <div
                          key={type}
                          className="border-1 border-indigo-400 rounded-md p-3 bg-indigo-400 "
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
                    className="overflow-y-auto transition-[height] bg-indigo-300 rounded-md duration-300 ease-in-out"
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
          className="absolute bottom-5 right-2 p-2 rounded-full bg-indigo-500 hover:bg-gray-200 transition-transform duration-300 ease-in-out"
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
