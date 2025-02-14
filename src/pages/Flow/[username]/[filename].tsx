import React, {
  startTransition,
  useEffect,
  useCallback,
  useRef,
  useState,
  ChangeEventHandler,
} from "react";
import { useRouter } from "next/router";
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
  Panel,
} from "reactflow";

import { TbCameraDown } from "react-icons/tb";

import { ColorMode } from "@xyflow/react";
import "reactflow/dist/style.css";
import html2canvas from "html2canvas";
import { MdOutlineSaveAlt } from "react-icons/md";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowBack,
} from "react-icons/io";
import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  query,
  updateDoc,
  setDoc,
  where,
  getDoc,
} from "firebase/firestore";
import { firedb } from "@/app/firebase";
import RTools from "@/components/flowtabs/rtools";
import Prompts from "@/components/flowtabs/prompts";
import LLMs from "@/components/flowtabs/llm";
import DocuType from "@/components/flowtabs/documentype";
import VSTools from "@/components/flowtabs/vstools";
import Embeddings from "@/components/flowtabs/embeddings";
import Conditionals from "@/components/conditionals";
import SelfTab from "@/components/templates/self-reflex/self-tab";
import { FaRegTrashAlt } from "react-icons/fa";
import { getUserData } from "@/utils/authUtils";
import { FiUploadCloud } from "react-icons/fi";
import { X } from "lucide-react";
import Toast from "@/components/toast";
import CustomNode from "@/components/darkreactflow";

import { RiRobot3Line } from "react-icons/ri";
import { RiShareForwardLine } from "react-icons/ri";
import { MdOutlineDownloading } from "react-icons/md";
import { SiStreamlit } from "react-icons/si";

import "@/styles/styles.css";

export async function getServerSideProps(context: any) {
  return getUserData(context, true);
}

const nodeTypes = {
  custom: CustomNode,
};

const getId = (() => {
  let id = 0;
  return () => `dndnode_${id++}`;
})();

const FlowWithPathExtractor = ({ user, uid }: { user: any; uid: string }) => {
  const [flowRestored, setFlowRestored] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [compLoaded, setisCompLoaded] = useState(false);

  /*React Flow requisities*/
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [colorMode, setColorMode] = useState<ColorMode>("dark");
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
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isExpanded1, setIsExpanded1] = useState(true);
  const [isExpanded2, setIsExpanded2] = useState(true);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [projectname, setProjectname] = useState("");
  const [filename, setFileName] = useState(projectname);
  const [isExistingProject, setIsExistingProject] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  /*Right Tab requisites*/
  const [jsonData, setJsonData] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [ispublic, setIsPublic] = useState(false);

  const openModal = (jsonString: string) => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const openSaveModal = () => setSaveModalOpen(true);
  const closeSaveModal = () => setSaveModalOpen(false);
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
  const [error, setError] = useState<string>("");
  const { setViewport } = useReactFlow();

  const router = useRouter();

  const { username } = router.query;

  useEffect(() => {
    const loadTemplate = async () => {
      const { username, filename } = router.query;

      if (!router.isReady || !filename) return;

      if (username == user?.username) {
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
            setProjectname(project.filename);
            setIsPublic(project.isPublic);
            const flow = project.flow;

            startTransition(() => {
              if (flow) {
                const { x = 0, y = 0, zoom = 1 } = flow.viewport;

                const restoredNodes = flow.nodes.map((node: any) => ({
                  ...node,
                  className: "custom-node", // Add the custom class here
                }));

                setNodes(restoredNodes || []);
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
            });

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
          setFlowRestored(true);
          setIsLoading(false);
        }
      } else {
        try {
          const usersRef = collectionGroup(firedb, "projects");
          const q = query(usersRef, where("username", "==", username));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const project = querySnapshot.docs[0].data();
            setProjectname(project.filename);
            setIsPublic(project.isPublic);
            const flow = project.flow;

            setisCompLoaded(true);

            if (flow) {
              const { x = 0, y = 0, zoom = 1 } = flow.viewport;
              const restoredNodes = flow.nodes.map((node: any) => ({
                ...node,
                className: "custom-node", // Add the custom class here
              }));

              setNodes(restoredNodes || []);
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
        } catch (error) {
          console.log("Error fetching request", error);
        } finally {
          setFlowRestored(true);
          setIsLoading(false);
        }
      }
    };

    loadTemplate();
  }, [router.query, router.isReady]);

  useEffect(() => {
    const allLoaded = [
      option,
      embeddings,
      prompts,
      rtools,
      vstools,
      selectedLLM,
      isVerbose,
      temperature,
    ].every((value) => value !== null);

    if (allLoaded) {
      setisCompLoaded(false);
    }

    setFileName(projectname);

    const checkIfProjectExists = async () => {
      if (!uid || !filename) return;

      const fileDocRef = doc(firedb, "Users", uid, "projects", filename);
      const docSnap = await getDoc(fileDocRef);

      setIsExistingProject(docSnap.exists()); // true if project exists, false otherwise
    };

    checkIfProjectExists();
  }, [
    option,
    embeddings,
    prompts,
    rtools,
    vstools,
    selectedLLM,
    isVerbose,
    temperature,
    projectname,
    uid,
    filename,
  ]);

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
    const deletableNodes = selectedElements.nodes.filter((node) =>
      canDeleteNode(node.id)
    );
    const deletableEdges = selectedElements.edges.filter((edge) =>
      canDeleteEdge(edge.id)
    );

    const deletableNodeIds = deletableNodes.map((node) => node.id);

    // Filter out deletable nodes and edges
    setNodes((nds) =>
      nds.filter((node) => !deletableNodeIds.includes(node.id))
    );

    setEdges((eds) =>
      eds.filter((edge) => !deletableEdges.map((e) => e.id).includes(edge.id))
    );

    // Handle Group 1 deletion
    if (typedGroup1.some((id) => deletableNodeIds.includes(id))) {
      setNodes((nds) => nds.filter((node) => !typedGroup1.includes(node.id)));
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            !typedGroup1.includes(edge.source) &&
            !typedGroup1.includes(edge.target)
        )
      );

      // Avoid duplicate edges
      setEdges((eds) =>
        eds.some((e) => e.id === "2-5")
          ? eds
          : [...eds, { id: "2-5", source: "2", target: "5" }]
      );
    }

    // Handle Group 2 deletion
    if (typedGroup2.some((id) => deletableNodeIds.includes(id))) {
      setNodes((nds) => nds.filter((node) => !typedGroup2.includes(node.id)));
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            !typedGroup2.includes(edge.source) &&
            !typedGroup2.includes(edge.target)
        )
      );

      setEdges((eds) =>
        eds.some((e) => e.id === "5-10")
          ? eds
          : [...eds, { id: "5-10", source: "5", target: "10" }]
      );
    }

    // Reset selection
    setSelectedElements({ nodes: [], edges: [] });
  }, [
    canDeleteNode,
    typedGroup1,
    typedGroup2,
    canDeleteEdge,
    selectedElements,
    setNodes,
    setEdges,
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
        className: "custom-node",
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
      if (!uid) {
        return <Toast message="Create an account to save your flow" />;
      }

      // Ensure filename is valid (prevent empty strings or special characters)
      if (!filename || filename.trim() === "") {
        return <Toast message="Filename cannot be empty!" />;
      }

      // Use filename as the document ID
      const fileDocRef = doc(
        firedb,
        "Users",
        uid as string,
        "projects",
        filename
      );

      const docSnap = await getDoc(fileDocRef);
      //Prepare the data to be saved
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

      if (uid == null) {
        <Toast message="Create an account to save your flow" />;
      }

      if (docSnap.exists()) {
        // Update existing project
        await updateDoc(fileDocRef, projectData);
        console.log("Project updated successfully!");
      } else {
        // Create new project (No duplicates allowed since filename is the ID)
        await setDoc(fileDocRef, projectData);
        console.log("Project created successfully!");
      }

      closeModal();
      closeSaveModal();
    } catch (error) {
      console.error("Error saving file to Firestore:", error);
    }
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

  if (isLoading) {
    return <div>Loading...</div>;
  }
  //screenshot
  const screenShot = async () => {
    console.log("clicked 1");
    const element = document.getElementById("main-area"); // ID of the component
    if (!element) return;

    const canvas = await html2canvas(element);
    const dataUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "screenshot.png";
    link.click();
    console.log("clicked 2");
  };

  //host modal
  const handleClick = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  //send backend
  const sendBackend = async () => {
    //exportPathsAsJson();
    const pathData = extractPaths();
    const { template } = router.query;
    // Include other relevant fields
    const exportData = {
      llm: selectedLLM
        ? {
            [selectedLLM]: {
              apiKey: apiKey || "23423452342",
              temperature: temperature || "0.3",
              isVerbose: isVerbose || "false",
            },
          }
        : {
            groq_model: {
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
    console.log("Export data : ", exportData);
    // const response = await fetch("/api/sendjson", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body:jsonString,
    // });

    setJsonData(exportData);

    //export end
    console.log("json data after: ", jsonData);
    if (!exportData) {
      setError("No data to send");
      return;
    }
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    console.log("typeof : ", exportData);
    try {
      // Send JSON data to the backend
      const response = await fetch("http://localhost:8000/receive-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exportData),
      });

      if (!response.ok) {
        throw new Error("Failed to send data to backend");
      }
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //check consistency

  const checkConsistency = () => {
    console.log("check consistency");
  };

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


      <div className="flex-1" ref={reactFlowWrapper} id="main-area">
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
          nodeTypes={nodeTypes}
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
              <span className="invisible group-hover:visible absolute bg-gray-100 text-black p-2  text-xs mt-16 ml-6 rounded-md">
                Delete
              </span>
            </button>
            <button
              onClick={exportPathsAsJson}
              //onClick={openModal}
              className="flex items-center gap-2 px-2 py-1 bg-zinc-800 text-white rounded-lg hover:bg-indigo-400 transition-colors"
            >
              <MdOutlineSaveAlt size={20} />
              <span className="invisible group-hover:visible absolute bg-gray-100 text-black p-2  text-xs mt-16 ml-6 rounded-md">
                View Json
              </span>
            </button>

            <button
              onClick={() => {
                exportPathsAsJson();
                openSaveModal();
              }}
              className="flex items-center gap-2 px-2 py-1 bg-zinc-800 text-white rounded-lg hover:bg-indigo-400 transition-colors"
            >
              <FiUploadCloud size={20} />
              <span className="invisible group-hover:visible absolute bg-gray-100 text-black p-2  text-xs mt-16 ml-6 rounded-md">
                Save
              </span>
            </button>
            <button
              onClick={() => {
                handleClick();
                sendBackend();
              }}
              className="flex items-center gap-2 px-2 py-1 bg-zinc-800 text-white rounded-lg hover:bg-green-600 transition-colors group"
            >
              <RiShareForwardLine size={20} />
              <span className="invisible group-hover:visible absolute bg-gray-100 text-black p-2  text-xs mt-16 ml-6 rounded-md">
                Host
              </span>
            </button>
            <button
              onClick={screenShot}
              className="flex items-center gap-2 px-2 py-1 bg-zinc-800 text-white rounded-lg hover:bg-green-600 transition-colors group"
            >
              <TbCameraDown size={22} />
              <span className="invisible group-hover:visible absolute bg-gray-100 text-black p-2  text-xs mt-16 ml-6 rounded-md">
                Screenshot
              </span>
            </button>
          </Panel>
          <Controls />
          <Background className="bg-zinc-800" />
          <Toast message={"Hello"} />
        </ReactFlow>
        <Conditionals
          isOpen={showModal}
          edges={pendingEdges}
          onClose={() => setShowModal(false)}
          onSave={handleEdgeLabels}
        />
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-1/3">
            <h1 className="text-3xl font-semibold flex justify-center">
              Hosting in Streamlit
            </h1>
            <div className="flex justify-center align-baseline space-x-2 p-2">
              <MdOutlineDownloading size={26} className="" />
              <p className="text-xs">
                To start processing deployment, the consistency of the workflow
                has to be checked. We are using gemma-9b model to check for
                consistency in our local server,thus ensuring your data privacy.
                Click on the CHECK button below to move forward with the
                consistency check.
              </p>
            </div>
            <div className="flex justify-between">
              <button
                className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                onClick={checkConsistency}
                className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded flex flex-row space-x-2"
              >
                <RiRobot3Line className="mt-1" size={20} />
                <p>Check</p>
              </button>
            </div>
          </div>
        </div>
      )}

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
                value={projectname}
                placeholder="Enter File Name"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={ispublic}
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
                  {isExistingProject ? "Save" : "Create"}
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
          <div className="min-h-screen p-5">
            {" "}
            <div className="">
              <h1 className="text-lg text-white font-semibold text-right">
                Components
              </h1>
              <hr className="h-[1.5px] my-3 bg-indigo-500 border-0 " />
            </div>
            <div className="p-5 flex flex-col bg-zinc-800 rounded-lg space-y-3 transition-transform duration-600 overflow-y-auto max-h-[85vh]">
              {compLoaded ? ( // Show loader while data is being fetched
                <div className="flex justify-center items-center h-40">
                  <span className="text-gray-600">Loading components...</span>
                </div>
              ) : (
                Object.entries(components).map(([type, component], index) => (
                  <div
                    key={type}
                    className="border-1 border-indigo-400 rounded-md p-3 bg-indigo-400"
                  >
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
                      className="overflow-y-auto transition-[height] bg-indigo-300 rounded-md duration-300 ease-in-out"
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
    <FlowWithPathExtractor user={user} uid={user?.uid} />
  </ReactFlowProvider>
);

export default FlowApp;
