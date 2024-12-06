import React, { useState } from 'react';

type DocuTypeProps = {
  onDocTypeChange: (type: string) => void;
};

export default function DocuType({ onDocTypeChange }: DocuTypeProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleRadioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value as string; // Ensure type safety
    setSelectedType(newValue);
    onDocTypeChange(newValue); // Call the prop function
    console.log(`Selected document type: ${newValue}`);
  };

  return (
    <>
      <p className="text-1xl font-bold w-full text-center">Select Document Type</p>
      <div className="flex flex-col">
        <select onChange={handleRadioChange}>
          {['PPT', 'PDF', 'CSV', 'XLSX', 'JSON'].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}