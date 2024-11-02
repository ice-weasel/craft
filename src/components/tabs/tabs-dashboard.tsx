import { useState } from "react";

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="w-screen p-10 h-full ">
      <div className="flex space-x-4 border-b border-gray-200 mb-4 ">
        <button
          className={`px-4 py-2 text-xl transition ${
            activeTab === 0
              ? "text-black border-b-2 border-black font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(0)}
        >
          Recent
        </button>
        <button
          className={`px-4 py-2 text-xl transition ${
            activeTab === 1
              ? "text-black border-b-2 border-black font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(1)}
        >
          For You
        </button>
        <button
          className={`px-4 py-2 text-xl transition ${
            activeTab === 2
              ? "text-black border-b-2 border-black font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(2)}
        >
          All
        </button>
      </div>

      <div className="h-5/6 rounded-lg">
        {activeTab === 0 && (
          <div className="h-full flex flex-row justify-between space-x-5">
            <div className="w-1/3  bg-violet-100  rounded-lg ">box1</div>
            <div className="w-1/3 bg-indigo-100 rounded-lg ">box2</div>
            <div className="w-1/3 bg-violet-100 rounded-lg ">box3</div>
          </div>
        )}
        {activeTab === 1 && <div>Content for Tab 2</div>}
        {activeTab === 2 && <div>Content for Tab 3</div>}
      </div>
    </div>
  );
};

export default Tabs;
