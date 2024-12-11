import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type LLMProps = {
  onLLMSelected: (llm: string | null, temperature: string, isVerbose: boolean,apiKey:string) => void;
}

export default function LLMs({onLLMSelected}: LLMProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLLM, setSelectedLLM] = useState<string | null>(null);
  const [isVerbose, setIsVerbose] = useState(false);
  const [temperature, setTemperature] = useState('');
  const [apiKey, setApiKey] = useState('');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleVerboseToggle = () => {
    setIsVerbose(!isVerbose);
  };

  const handleTemperatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTemperature(event.target.value);
  };

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handleLLMSelect = (llmLabel: string) => {
    setSelectedLLM(llmLabel === selectedLLM ? null : llmLabel); // Toggle selection
    setIsDropdownOpen(llmLabel === selectedLLM ? false : true); // Toggle options visibility
    onLLMSelected(llmLabel === selectedLLM ? null : llmLabel, temperature, isVerbose, apiKey);
  };

  const llms = [{ label: 'Gemini' }, { label: 'Open AI' }, { label: 'groq' }];

  return (
    <div className="bg-gray-800 px-4 py-3 rounded-md w-full max-w-md">
      <div className="text-white font-medium mb-3">Select LLM</div>
      <div className="space-y-2">
        {llms.map((llm) => (
          <div
            key={llm.label}
            className={`p-2 cursor-pointer rounded ${
              selectedLLM === llm.label ? 'bg-blue-700 text-white' : 'bg-gray-700 text-gray-300'
            }`}
            onClick={() => handleLLMSelect(llm.label)}
          >
            {llm.label}
          </div>
        ))}
      </div>

      {selectedLLM && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">Options for {selectedLLM}</h3>
            <button
              className="text-white hover:text-gray-300 focus:outline-none"
              onClick={toggleDropdown}
            >
              <ChevronDown
                size={24}
                className={`transition-transform duration-300 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {isDropdownOpen && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center">
                <label htmlFor="number-input" className="text-gray-400 mr-2">
                 API Key:
                </label>
                <input
                  id="string-input"
                  type="text"
                  onChange={handleApiKeyChange}
                  className="bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <label htmlFor="number-input" className="text-gray-400 mr-2">
                  Temperature:
                </label>
                <input
                  id="number-input"
                  type="number"
                  value={temperature}
                  onChange={handleTemperatureChange}
                  className="bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <label htmlFor="verbose-checkbox" className="text-gray-400 mr-2">
                  Verbose:
                </label>
                <input
                  id="verbose-checkbox"
                  type="checkbox"
                  checked={isVerbose}
                  onChange={handleVerboseToggle}
                  className="h-5 w-5 text-blue-500 focus:ring-blue-500 border-gray-600 rounded"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
