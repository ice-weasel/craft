import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { MdEditDocument } from "react-icons/md";
import { X } from "lucide-react";

type PromptsProps = {
  onpromptsChange: (type: string | null, customContent?: string) => void;
  currentprompts : string | null
};

const selfprompt = "tempcontent";

const initialOptions = [
  {
    value: "grading-prompt",
    label: "grading-prompt",
    content: "This is the prompt for grading",
  },
  {
    value: "relevancy-prompt",
    label: "relevancy-prompt",
    content: "This is the prompt for relevancy.",
  },
  {
    value: "generating-prompt",
    label: "generating-prompt",
    content: "This is the prompt for generating.",
  },
  {
    value: "hallucinating-prompt",
    label: "hallucinating-prompt",
    content: "This is the prompt for hallucinatin.g",
  },
  {
    value: "answer-checking",
    label: "answer-checking",
    content: "This is the prompt for answer checking.",
  },
  {
    value: "rewriting-prompt",
    label: "rewriting-prompt",
    content: "This is the prompt for rewriting.",
  },
];
export default function Prompts({ onpromptsChange,currentprompts }: PromptsProps) {
  const [selectedOption, setSelectedOption] = useState<string>("default"); // Radio button state
  const [customText, setCustomText] = useState<string>(); // Toast text state
  const [selectedDropdown, setSelectedDropdown] = useState<string>(""); // Dropdown state
  const forceUpdate = useState(false)[1];

  useEffect (() => {
    if(currentprompts!=="default"){
      setSelectedDropdown(currentprompts as string)
    }
  },[currentprompts])

  const handlePromptsChange = (
    selectedDropdown: string,
    customText: string
  ) => {
    if (selectedOption === "custom" && selectedDropdown) {
      // Pass the selected dropdown and custom text values to the parent
      onpromptsChange(selectedDropdown, customText);
    } else if (selectedOption === "default") {
      // For default, handle accordingly if needed
    }
  };

  const handleEditClick = () => {
    const selected = initialOptions.find(
      (opt) => opt.value === selectedDropdown
    );

    if (selected) {
      const sel_text = selected.content;
      setCustomText(sel_text); // Set the selected option's content to customText

      toast(
        (t) => (
          <div className="p-4">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="font-semibold text-lg mb-2">{selected.label}</h2>
            <textarea
              value={customText} // Ensure value is linked to the state
              onChange={(e) => setCustomText(e.target.value)} // Update state on input
              className="w-full p-2 border border-gray-300 rounded mb-3"
              rows={4}
            />
            <button
              onClick={() => {
                toast.dismiss(t.id); // Close the toast
                handlePromptsChange(selectedDropdown, customText as string); // Pass updated values to parent
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        ),
        { duration: Infinity } // Ensure toast stays open until dismissed
      );
    } else {
      toast.error("Please select an option from the dropdown.", {
        duration: 2000,
      });
    }
  };

  const handleChange = (option: string) => {
    setSelectedOption(option);
    if (option !== "custom") {
      setSelectedDropdown(""); // Reset dropdown when not in custom mode
    }
  };

  return (
    <div className="p-2 h-full">
      <Toaster />
      {/* Radio Buttons */}
      <div className="flex flex-col space-y-2 ">
        <label className="flex items-center cursor-pointer group">
          <div className="relative">
            <input
              type="radio"
              name="option"
              value="default"
              checked={selectedOption === "default"}
              onChange={() => handleChange("default")}
              className="sr-only"
            />
            <div className="w-5 h-5 border-2 border-violet-400 rounded-full group-hover:border-violet-600 transition-colors">
              {selectedOption === "default" && (
                <div
                  className={`
                  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  w-3 h-3 rounded-full bg-violet-500 
                  transition-transform duration-200 ease-in-out
                `}
                ></div>
              )}
            </div>
          </div>
          <span className="pl-3 text-gray-700 capitalize">
            Default Template
          </span>
        </label>

        <label className="flex items-center cursor-pointer group">
          <div className="relative">
            <input
              type="radio"
              name="option"
              value="custom"
              checked={selectedOption === "custom"}
              onChange={() => handleChange("custom")}
              className="sr-only"
            />
            <div className="w-5 h-5 border-2 border-violet-400 rounded-full group-hover:border-violet-600 transition-colors">
              {selectedOption === "custom" && (
                <div
                  className={`
                  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  w-3 h-3 rounded-full bg-violet-500 
                  transition-transform duration-200 ease-in-out
                `}
                ></div>
              )}
            </div>
          </div>
          <span className="pl-3 text-gray-700 capitalize">Custom Template</span>
        </label>
      </div>

      {selectedOption === "custom" && (
        <div className="pt-4 flex justify-between space-x-2 h-full">
          <select
            value={selectedDropdown}
            onChange={(e) => setSelectedDropdown(e.target.value)}
            className="w-3/4 p-1 border border-gray-300 rounded-md"
          >
            <option value="" disabled className="">
              Select an option
            </option>
            {initialOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleEditClick}
            className="py-1 px-3 bg-violet-500 text-white rounded-full items-center text-center hover:bg-gray-800"
          >
            <MdEditDocument size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
