import React, { useState } from 'react';

type DocuTypeProps = {
    onDocTypeChange: (type: string | null) => void;
  };

export default function DocuType({ onDocTypeChange }: DocuTypeProps) {
  
    const [option, setOption] = useState<string | null>(null);

  
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 
        alert(`Selected document type: ${option}`);
    };

    // Handle radio button change
    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOption(e.target.value); 
        console.log(`Selected document type: ${option}`)
       
    };

    return (
        <>
        <p className="text-3xl w-full text-center">Select Document Type</p>
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
