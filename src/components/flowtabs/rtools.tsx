// RTools.tsx
import React, { useState } from "react";

type RToolsProps = {
  onRToolsChange: (type: string | null) => void;
};

const RTools = ({ onRToolsChange }: RToolsProps) => {
  const [option, setOption] = useState<string | null>("Basic");
  // Handle radio button change
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setOption(newValue);
    onRToolsChange(newValue); // Call the prop function
    console.log(`Selected document type2: ${newValue}`);
  };
  const dynamicText: { [key: string]: string } = {
    Basic: "You have selected the Basic option.",
    "Self-Query": "The Self-Query option is selected for personalized queries.",
    "Multi-Query": "Multi-Query allows multiple queries to be processed.",
  };
  return (
    <>
      <div className="flex flex-col space-y-3">
        {["Basic", "Self-Query", "Multi-Query"].map((type) => (
          <label key={type} className="flex items-center cursor-pointer group">
            <div className="relative">
              <input
                type="radio"
                name="documentType"
                value={type}
                checked={option === type}
                onChange={handleRadioChange}
                className="sr-only" // Hide default radio but keep it accessible
              />
              <div className="w-5 h-5 border-2 border-violet-400 rounded-full group-hover:border-violet-600 transition-colors">
                <div
                  className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            w-3 h-3 rounded-full bg-violet-500 
            transition-transform duration-200 ease-in-out
            ${option === type ? "scale-100" : "scale-0"}
          `}
                ></div>
              </div>
            </div>
            <span className="ml-3 text-gray-700 capitalize">
              {type.replace("_", " ")}
            </span>
          </label>
        ))}
      </div>
      {option && (
        <div className="p-1">
          {" "}
          <p className="mt-4 text-sm text-gray-600">
            {dynamicText[option] || "Please select an option."}
          </p>
        </div>
      )}
    </>
  );
};

export default RTools;
