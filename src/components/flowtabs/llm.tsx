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
  const options = ["Groq", "Gemini", "OpenAI","Groq-Vision"];

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [dropdownData, setDropdownData] = useState({
    apiKey: "",
    temperature: "0",
    isVerbose: false,
  });
  const [showDropdown, setShowDropdown] = useState(false);

  const handleRadioChange = (option: string) => {
    setSelectedOption(option);
    setShowDropdown(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    

    setDropdownData((prev) => ({
      ...prev,
      [target.name]:
        target.type === "checkbox"
          ? (target as HTMLInputElement).checked
          : target.value,
    }));
  };

  const handleConfirm = () => {
    if (selectedOption) {
      // Pass the LLM selection and configuration to the parent component
      onLLMSelected(
        selectedOption,
        dropdownData.temperature,
        dropdownData.isVerbose,
        dropdownData.apiKey
      );
    }
    setShowDropdown(false); // Hide dropdown after confirmation
    console.log("Confirmed data:", {
      llm: selectedOption,
      ...dropdownData,
    });
  };
  return (
    <div className="h-full">
      <div className="flex flex-col space-y-3">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2">
            <input
              type="radio"
              name="selection"
              value={option}
              checked={selectedOption === option}
              onChange={() => handleRadioChange(option)}
              className="w-5 h-5 border border-violet-500 checked:bg-violet-500 checked:hover:bg-violet-500 checked:active:bg-violet-500 checked:focus:bg-violet-500 focus:bg-violet-500 focus:ring-violet-500"
            />
            {option}
          </label>
        ))}
      </div>

      {showDropdown && (
        <div className="mt-4 border-2 p-4 rounded-md ">
          <h2 className="font-semibold mb-2">Configure {selectedOption}</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block font-medium mb-1">API Key</label>
              <input
                type="text"
                name="apiKey"
                value={dropdownData.apiKey}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1"
                placeholder="Enter API Key"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Temperature</label>
              <input
                type="text"
                name="temperature"
                value={dropdownData.temperature}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1"
                placeholder="Set Temperature"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isVerbose"
                checked={dropdownData.isVerbose}
                onChange={handleInputChange}
                className="active:bg-violet-500 focus:ring-violet-500"
              />
              <label className="font-medium ">Is Verbose</label>
            </div>
            <button
              onClick={handleConfirm}
              className="bg-violet-500 text-white px-4 py-2 rounded hover:bg-violet-400 checked:hover:bg-violet-500 checked:active:bg-violet-500 checked:focus:bg-violet-500 focus:bg-violet-500 focus:ring-violet-500"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
