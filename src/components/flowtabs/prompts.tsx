import React, { useState } from 'react';

type PromptsProps = {
  onpromptsChange: (type: string | null) => void;
};

export default function Prompts({ onpromptsChange }: PromptsProps) {
  const [prompts, setPrompts] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState<string>('');
  const [option, setOption] = useState<string | null>(null);

  // For template buttons
  const handleTemplateClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const templateValue = e.target.value;
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
        {['Template 1','Template 2'].map((type) => (
          <label key={type}>
             <input
             value={type}
             checked={prompts === type}
             onChange={handleTemplateClick}
          />
          </label>
         
        ))}

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