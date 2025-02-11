// Tools.tsx
import React, { useEffect, useState } from "react";

type VSToolsProp = {
  onVSToolsChange: (type: string | null) => void;
  currentvstools : string | null;
};

const VSTools = ({ onVSToolsChange,currentvstools }: VSToolsProp) => {
  const [option, setOption] = useState<string | null>("Chroma_store");

  useEffect(() => {
    if(currentvstools) {
      setOption(currentvstools)
    }
  },[currentvstools])

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setOption(newValue);
    onVSToolsChange(newValue); // Call the prop function
    console.log(`Selected document type2: ${newValue}`);
  };

  return (
    <>
      <div className="flex flex-col space-y-3">
        {["Chroma_store", "Faiss_store"].map((type) => (
          <label key={type} className="flex items-center font-bold cursor-pointer group">
            <div className="relative">
              <input
                type="radio"
                name="documentType"
                value={type}
                checked={option === type}
                onChange={handleRadioChange}
                className="sr-only" // Hide default radio but keep it accessible
              />
              <div className="w-5 h-5 border-2  border-indigo-500 rounded-full group-hover:border-indigo-600 transition-colors">
                <div
                  className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            w-3 h-3 rounded-full bg-indigo-800 
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
    </>
  );
};

export default VSTools;
