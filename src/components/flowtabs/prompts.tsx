import React, { useState } from 'react';

type PromptsProps = {
  onpromptsChange: (type: string | null) => void;
};

export default function Prompts({ onpromptsChange }: PromptsProps) {
  const [prompts, setPrompts] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState<string>('');

  // For template buttons
  const handleTemplateClick = (templateValue: string) => {
    setPrompts(templateValue);
    onpromptsChange(templateValue);
    console.log(`Selected template: ${templateValue}`);
  };

  // For custom text input
  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomInput(newValue);
   
    console.log(`Custom input: ${newValue}`);
  };

  return (
    <>
      <div className="w-full flex flex-col gap-6 p-4">
        <button 
          onClick={() => handleTemplateClick('Template 1')}
          className='border-2 p-6 bg-white transition-all duration-200 hover:bg-blue-700 hover:text-white rounded-md'
        >
          Template 1
        </button>

        <button 
          onClick={() => handleTemplateClick('Template 2')}
          className='border-2 p-6 bg-white transition-all duration-200 hover:bg-blue-700 hover:text-white rounded-md'
        >
          Template 2
        </button>

        <label className="font-medium">Enter your input</label>
        <input 
          type="text" 
          className='border-2 p-2 rounded-md'
          name="prompts"
          value={customInput}
          onChange={handleCustomInputChange}
          placeholder="Enter custom prompt..."
        />
      </div>
    </>
  );
}