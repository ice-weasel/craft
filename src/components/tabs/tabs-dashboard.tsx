// components/BasicTabs.tsx

import { useState } from "react";

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="w-screen p-3">
      {/* Tab Headers */}
      <div className="flex space-x-4 border-b border-gray-200 mb-4">
        <button
          className={`px-4 py-2 transition ${
            activeTab === 0
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(0)}
        >
          Tab 1
        </button>
        <button
          className={`px-4 py-2 transition ${
            activeTab === 1
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(1)}
        >
          Tab 2
        </button>
        <button
          className={`px-4 py-2 transition ${
            activeTab === 2
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(2)}
        >
          Tab 3
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 bg-gray-100 rounded-lg">
        {activeTab === 0 && <div>Content for Tab 1</div>}
        {activeTab === 1 && <div>Content for Tab 2</div>}
        {activeTab === 2 && <div>Content for Tab 3</div>}
      </div>
    </div>
  );
};

export default Tabs;
