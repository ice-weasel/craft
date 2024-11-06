// RTools.tsx
import React,  { useState } from 'react';


type RToolsProps = {
  onRToolsChange: (type: string|null) => void;
}

const RTools = ({onRToolsChange}: RToolsProps) => {
  const [option, setOption] = useState<string | null>(null);
  // Handle radio button change
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setOption(newValue);
      onRToolsChange(newValue); // Call the prop function
      console.log(`Selected document type2: ${newValue}`);
  };
  return (
    <>
    <p className="text-xl w-full text-center">Select Document Type</p>
    <div className="flex flex-col items-center">
      {['Default','Self-Query','Multi-Query'].map((type) => (
        <label key={type}>
          <input
            type="radio"
            name="documentType"
            value={type}
            checked={option === type}
            onChange={handleRadioChange}
          />
          {type}
        </label>
      ))}
    </div>
  </>
  );
};

export default RTools;