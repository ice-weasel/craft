import React, { useState } from 'react';


export default function Prompts() {

   const [prompts,setPrompts] = useState<string | null>(null);

   const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompts(e.target.value); 
    

};


    return (
      <>
      <div className="w-full flex flex-col gap-6">
        <label>Enter your input</label>
        <input type="text" name="prompts"/>
      </div>
      </>
    )
}