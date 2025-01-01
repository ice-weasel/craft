import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

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
  const [selectedLLM, setSelectedLLM] = useState<string | null>(null);
  const [isVerbose, setIsVerbose] = useState(false);
  const [temperature, setTemperature] = useState("");
  const [apiKey, setApiKey] = useState("");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleVerboseToggle = () => {
    setIsVerbose(!isVerbose);
  };

  const handleTemperatureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTemperature(event.target.value);
  };

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handleLLMSelect = (llmLabel: string) => {
    if (llmLabel === selectedLLM) {
      setSelectedLLM(null);
      setIsDropdownOpen(false);
    } else {
      setSelectedLLM(llmLabel);
      setIsDropdownOpen(true);
    }
    onLLMSelected(
      llmLabel === selectedLLM ? null : llmLabel,
      temperature,
      isVerbose,
      apiKey
    );
  };

  const llms = [{ label: "Gemini" }, { label: "Open AI" }, { label: "groq" }];

  return (
    <div className="p-6 rounded-lg w-full max-w-md  shadow-md">
      <div className="grid grid-rows-3 gap-3">
        {llms.map((llm) => (
          <button
            key={llm.label}
            onClick={() => handleLLMSelect(llm.label)}
            className={`
            px-4 py-2 rounded-md font-medium transition-all duration-200
            ${
              selectedLLM === llm.label
                ? "bg-violet-500 text-white shadow-lg transform scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-violet-100"
            }
          `}
          >
            {llm.label}
          </button>
        ))}
      </div>

      {selectedLLM && (
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-semibold">Configuration</h3>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-600 hover:text-violet-500 transition-colors"
            >
              <ChevronDown
                size={20}
                className={`transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div
            className={`space-y-4 transition-all duration-300 ${
              isDropdownOpen ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
            }`}
          >
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
          </div>
        </div>
      )}
    </div>
  );
}
