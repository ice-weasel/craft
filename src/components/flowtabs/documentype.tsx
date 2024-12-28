import React, { useState } from 'react';

type DocuTypeProps = {
  onDocTypeChange: (type: string) => void;
};

export default function DocuType({ onDocTypeChange }: DocuTypeProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const options = ['PPT', 'PDF', 'CSV', 'XLSX', 'JSON'];

  const handleRadioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value as string; // Ensure type safety
    setSelectedType(newValue);
    onDocTypeChange(newValue); // Call the prop function
    console.log(`Selected document type: ${newValue}`);
  };

  return (
    <>
      
      
        <select className='p-1 overflow-y-auto bg-indigo-100 w-full' onChange={handleRadioChange}>
          {['PPT', 'PDF', 'CSV', 'XLSX', 'JSON'].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
     
    </>
  );
}