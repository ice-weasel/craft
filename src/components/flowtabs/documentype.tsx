import React, { useState } from 'react';

type DocuTypeProps = {
    onDocTypeChange: (type: string | null) => void;
  };

export default function DocuType({ onDocTypeChange }: DocuTypeProps) {
  
    const [option, setOption] = useState<string | null>(null);
    // Handle radio button change
    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setOption(newValue);
        onDocTypeChange(newValue); // Call the prop function
        console.log(`Selected document type2: ${newValue}`);
    };
    return (
        <>
        <p className="text-xl w-full text-center">Select Document Type</p>
        <div className="flex flex-col items-center">
          {['PPT', 'PDF', 'CSV', 'XLSX', 'JSON'].map((type) => (
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
}
