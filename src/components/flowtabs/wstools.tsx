// Tools.tsx
import React, { useState } from 'react';

type VSToolsProp = {
  onVSToolsChange: (type: string | null ) => void;
}


const VSTools = ({onVSToolsChange}: VSToolsProp) => {

  const [option,setOption] = useState<string| null>(null)

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setOption(newValue)
    onVSToolsChange(newValue)// Call the prop function
    console.log(`Selected document type2: ${newValue}`);
};


  return (
    <>
    <p className="text-xl w-full text-center">Select Document Type</p>
    <div className="flex flex-col items-center">
      {['Chroma','Faiss'].map((type) => (
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

export default VSTools;