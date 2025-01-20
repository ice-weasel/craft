import e from "express";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
type LLMProps = {
  onLLMSelected: (
    llm: string | null,
    temperature: string,
    isVerbose: boolean,
    apiKey: string
  ) => void;
};

export default function LLMs({ onLLMSelected }: LLMProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLLM, setSelectedLLM] = useState("");
  const [isVerbose, setIsVerbose] = useState(false);
  const [temperature, setTemperature] = useState("");
  const [apiKey, setApiKey] = useState("");

  // const handleLLMSelect = (llmLabel: string) => {
  //   // If selecting a different LLM, always open the dropdown and update selection
  //   setIsDropdownOpen(true);
  //   setSelectedLLM(llmLabel);
  //   console.log("temperature" ,temperature)
  //   console.log("llmlabel" , llmLabel)
  //   // Call the callback with the new selection
  //   onLLMSelected(llmLabel, temperature, isVerbose, apiKey);
  // };

  const llms = [{ label: "Gemini" }, { label: "Open AI" }, { label: "groq" }];

  return (
    <div className="">
      <div className="grid grid-rows-3 gap-3">
        {llms.map((llm) => (
          <button
            key={llm.label}
            onClick={() => {setSelectedLLM(llm.label);setIsDropdownOpen(!isDropdownOpen);console.log(selectedLLM)}}
            className="
            px-4 py-2 rounded-md font-medium transition-all duration-200 bg-gray-100  text-gray-700 hover:bg-violet-100"
          >
            {llm.label}
          </button>
        ))}
      </div>

      {selectedLLM && (
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800  font-semibold">Configuration</h3>
            <button className="text-gray-600 hover:text-violet-500 transition-colors">
              <IoIosArrowDown
                size={20}
                className="transition-transform duration-300 "
              />
            </button>
          </div>

          <div className="space-y-4 transition-all duration-300">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                API Key
              </label>
              <input
                type="text"
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                placeholder="Enter API key"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Temperature
              </label>
              <input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                placeholder="0.0 - 1.0"
                step="0.1"
                min="0"
                max="1"
              />
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative flex items-center">
                <input
                  id="verbose"
                  type="checkbox"
                  checked={isVerbose}
                  onChange={() => setIsVerbose(!isVerbose)}
                  className="w-4 h-4 text-violet-500 border-gray-300 rounded focus:ring-violet-500 transition-colors"
                />
                <label
                  htmlFor="verbose"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Verbose Output
                </label>
              </div>

              
            </div>
            <button onClick={()=> {onLLMSelected(selectedLLM,temperature,isVerbose,apiKey);console.log(selectedLLM,temperature,isVerbose,apiKey)}}>Confirm</button>
          </div>
        </div>
      )}
    </div>
  );
}
