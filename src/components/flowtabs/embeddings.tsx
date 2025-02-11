// Tools.tsx
import React, { useEffect, useState } from "react";

type EmbeddingsProps = {
  onEmbeddingsChange: (type: string | null) => void;
  currentembeddings : string | null;
};

const Embeddings = ({ onEmbeddingsChange,currentembeddings }: EmbeddingsProps) => {
  const [option, setOption] = useState<string | null>("hugging_face");
  // Handle radio button change

  useEffect(() => {
    if(currentembeddings) {
      setOption(currentembeddings);
    }
  },[currentembeddings])

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setOption(newValue);
    onEmbeddingsChange(newValue); // Call the prop function
    console.log(`Selected document type2: ${newValue}`);
  };

  return (
    <>
      <div className="flex flex-col space-y-2">
        {["hugging_face", "open_ai"].map((type) => (
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
              <div className="w-5 h-5 border-2 border-indigo-500 rounded-full group-hover:border-indigo-600 transition-colors">
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

export default Embeddings;
