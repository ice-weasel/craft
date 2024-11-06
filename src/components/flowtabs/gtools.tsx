// Tools.tsx
import React,  { useState } from 'react';

type EmbeddingsProps = {
  onEmbediingsChange: (type: string|null) => void;
}

const Embeddings = ({onEmbediingsChange}: EmbeddingsProps) => {

  const [option, setOption] = useState<string | null>(null);
  // Handle radio button change
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setOption(newValue);
      onEmbediingsChange(newValue); // Call the prop function
      console.log(`Selected document type2: ${newValue}`);
  };

  return (
    <>
    <p className="text-xl w-full text-center">Select Document Type</p>
    <div className="flex flex-col items-center">
      {['hugging_face','open_ai'].map((type) => (
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

export default Embeddings;