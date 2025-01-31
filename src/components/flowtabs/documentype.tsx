import React, { useEffect, useState } from "react";

type DocuTypeProps = {
  onDocTypeChange: (type: string) => void;
  currentValue:  string | null
};

export default function DocuType({ onDocTypeChange,currentValue }: DocuTypeProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [value,setValue]= useState(currentValue);

  useEffect(() => {
    if (currentValue) {
      console.log("this is doc_Type",currentValue)
      onDocTypeChange(currentValue)
      setSelectedType(currentValue)
    }
  }, [currentValue]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value as string; // Ensure type safety
    setSelectedType(newValue);
    onDocTypeChange(newValue); // Call the prop function
    console.log(`Selected document type: ${newValue}`);
  };

  return (
    <>
      <select
        className="p-1 overflow-y-auto bg-white rounded-md w-full"
        onChange={handleRadioChange}
        value={selectedType || ""}
      >
        {["PDF","PPT", "CSV", "XLSX", "JSON","IMGS"].map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </>
  );
}
