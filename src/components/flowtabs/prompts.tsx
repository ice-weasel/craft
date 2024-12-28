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
      <div className="w-full flex flex-col gap-3 p-3">
      {['Template 1', 'Template 2'].map((type) => (
    <label 
      key={type} 
      className="flex items-center cursor-pointer group"
    >
      <div className="relative">
        <input
          type="radio"
          
          value={type}
          checked={prompts === type}
          onChange={handleTemplateClick}
          className="sr-only" // Hide default radio but keep it accessible
        />
        <div className="w-5 h-5 border-2 border-violet-400 rounded-full group-hover:border-violet-600 transition-colors">
          <div className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            w-3 h-3 rounded-full bg-violet-500 
            transition-transform duration-200 ease-in-out
            ${prompts === type ? 'scale-100' : 'scale-0'}
          `}>
          </div>
        </div>
      </div>
      <span className="ml-3 text-gray-700 capitalize">
        {type.replace('_', ' ')}
      </span>
    </label>
  ))}

        

       
        <input 
          type="text" 
          className='border-1 p-1 rounded-md'
          name="prompts"
          value={customInput}
          onChange={handleCustomInputChange}
          placeholder="Enter custom prompt..."
        />
      </div>
    </>
  );
}