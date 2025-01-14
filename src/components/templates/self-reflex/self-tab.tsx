import React, { useState } from "react";
import Nodes from "./nodes";
import Checkers from "./checkers";
import Advanced from "./advanced";

// type SelfTabProps = {
//   onTemplateChange :
//   (basicTools:string | null,advancedTools:string | null) => void
// }

const SelfTab = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  return (
    <div className="p-5">
      <h1 className="text-lg font-semibold">Tool Box</h1>
      <hr className="h-[1.5px] my-3 bg-black border-0 " />
      <div className="flex space-x-4 border-b border-gray-200 text-left ">
        <button
          className={`px-4 py-2 text-md text-left transition ${
            activeTab === 0
              ? "text-black border-b-2 border-black font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(0)}
        >
          Basic
        </button>
        <button
          className={`px-4 py-2 text-md transition ${
            activeTab === 1
              ? "text-black border-b-2 border-black font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(1)}
        >
          Advanced
        </button>
      </div>
      {activeTab === 0 && (
        <div>
          <Nodes />
          <Checkers />
        </div>
      )}
      {activeTab === 1 && (
        <Advanced/>
      )}
    </div>
  );
};

export default SelfTab;
