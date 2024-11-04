import React, { useState, useRef, useCallback } from "react";
import "tailwindcss/tailwind.css";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  ReactFlowProvider,
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange
} from 'reactflow';
import 'reactflow/dist/style.css';
import Tools,{toolNodes} from "@/components/flowtabs/tools";
import { Prompt } from "next/font/google";
import Prompts from "@/components/flowtabs/prompts";
import LLMs from "@/components/flowtabs/llm";

const getId = (() => {
  let id = 0;
  return () => `dndnode_${id++}`;
})();

type NavigationButtonProps = {
  number: number;
  isActive: boolean;
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

type NextButtonProps = {
  text: string;
  onClick: () => void;
};

const NextButton: React.FC<NextButtonProps> = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="bg-blue-600 text-white p-2 border rounded-md hover:bg-blue-700 transition-colors"
  >
    {text}
  </button>
);



const Testflow: React.FC = () => {
  

  const [activeTab, setActiveTab] = useState(0);
  const nextbutton = ["Enter prompt", "Select Tools", "Select LLMs"];

  const handleNext = () => {
    setActiveTab((prevTab) => (prevTab + 1) % nextbutton.length);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex h-14 bg-black text-white">
        <div className="flex items-center gap-2 px-4">
          {[1, 2, 3].map((num, index) => (
            <NavigationButton
              key={num}
              number={num}
              isActive={activeTab === index}
              onClick={() => setActiveTab(index)}
            />
          ))}
        </div>
        <div className="flex-1 flex justify-between items-center px-6">
          <div>Good evening</div>
          <div>Carolyne</div>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex">
          <div className="w-1 bg-gray-200"></div>
          <div
            className={`w-64 flex flex-col justify-between pb-5 transition-all duration-300 ${
              activeTab === 0 ? "bg-red-100" : activeTab === 1 ? "bg-blue-100" : "bg-green-100"
            }`}
          >
            {activeTab===0 && <Prompts/>}
            {activeTab===1 && <Tools/>}
            {activeTab===2 && <LLMs/>}

            <NextButton text={nextbutton[activeTab]} onClick={handleNext} />
          </div>
        </div>


       
      </div>
    </div>
  );
};

export default Testflow;
