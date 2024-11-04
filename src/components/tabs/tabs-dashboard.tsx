import { useState } from "react";
import { Poppins } from "next/font/google";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

const pops = Poppins({
  weight: "500",
  subsets: ["latin"],
});
const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="w-screen p-10 h-full ">
      <div className="flex space-x-4 border-b border-gray-200 mb-4 ">
        <button
          className={`px-4 py-2 text-md transition ${
            activeTab === 0
              ? "text-black border-b-2 border-black font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(0)}
        >
          Recent
        </button>
        <button
          className={`px-4 py-2 text-md transition ${
            activeTab === 1
              ? "text-black border-b-2 border-black font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(1)}
        >
          For You
        </button>
        <button
          className={`px-4 py-2 text-md transition ${
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
          <div className="h-full flex flex-row justify-between space-x-3">
            <div className="w-1/3  bg-violet-100  rounded-lg flex flex-col justify-between p-6">
              <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                  <div className="text-sm text-neutral-600">
                    26th September 2024
                  </div>
                  <button className="rounded-lg bg-neutral-100 hover:bg-red-200 p-2">
                    <MdDelete size={20} />
                  </button>
                </div>
                <div className="text-4xl font-semibold">
                  <h1 className={pops.className}>PPT RAG</h1>
                </div>
              </div>
              <div className="">
                <button className="flex flex-row justify-between w-full bg-violet-300 p-3 rounded-full hover:bg-violet-200">
                  <div className="text-md font-semibold pl-4">Edit</div>
                  <div className="pr-4">
                    <MdEdit size={20} />
                  </div>
                </button>
              </div>
            </div>
            <div className="w-1/3  bg-indigo-100  rounded-lg flex flex-col justify-between p-6">
              <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                  <div className="text-sm text-neutral-600">10th July 2024</div>
                  <button className="rounded-lg bg-neutral-100 hover:bg-red-200 p-2">
                    <MdDelete size={20} />
                  </button>
                </div>
                <div className="text-4xl font-semibold">
                  <h1 className={pops.className}>Wikipedia Search</h1>
                </div>
              </div>
              <div className="">
                <button className="flex flex-row justify-between w-full bg-violet-300 p-3 rounded-full hover:bg-violet-200">
                  <div className="text-md font-semibold pl-4">Edit</div>
                  <div className="pr-4">
                    <MdEdit size={20} />
                  </div>
                </button>
              </div>
            </div>
            <div className="w-1/3  bg-violet-100  rounded-lg flex flex-col justify-between p-6">
              <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                  <div className="text-md text-neutral-600">
                    26th September 2024
                  </div>
                  <button className="rounded-lg bg-neutral-100 hover:bg-red-200 p-2">
                    <MdDelete size={20} />
                  </button>
                </div>
                <div className="text-4xl font-semibold">
                  <h1 className={pops.className}>Image Search</h1>
                </div>
              </div>
              <div className="">
                <button className="flex flex-row justify-between w-full bg-violet-300 p-3 rounded-full hover:bg-violet-200">
                  <div className="text-md font-semibold pl-4">Edit</div>
                  <div className="pr-4">
                    <MdEdit size={20} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 1 && (
          <div className="h-full flex flex-row justify-between space-x-3">
            <div className="w-1/3  bg-violet-100  rounded-lg flex flex-col justify-between p-6">
              <div className="flex flex-col space-y-2">
                <div className="text-4xl font-semibold text-center">
                  <h1 className={pops.className}>Math Engine</h1>
                </div>
                <div className="text-neutral-600 text-sm text-center">
                  Effortlessly solve complex math problems with the Math Engine
                  template, designed to simplify calculations and <br /> handle
                  mathematical operations.
                </div>
              </div>
              <div className="">
                <button className="flex flex-row justify-between w-full bg-violet-300 p-3 rounded-full hover:bg-violet-200">
                  <div className="text-md font-semibold pl-4">
                    Use this template
                  </div>
                  <div className="pr-4">
                    <MdEdit size={20} />
                  </div>
                </button>
              </div>
            </div>
            <div className="w-1/3  bg-violet-100  rounded-lg flex flex-col justify-between p-6">
              <div className="flex flex-col space-y-2">
                <div className="text-4xl font-semibold text-center">
                  <h1 className={pops.className}>Technical Writer</h1>
                </div>
                <div className="text-neutral-600 text-sm text-center">
                  Automate content creation with the AI-powered Technical Writer
                  template, crafted to generate clear, accurate, and engaging
                  <br />
                  technical documentations effortlessly.
                </div>
              </div>
              <div className="">
                <button className="flex flex-row justify-between w-full bg-violet-300 p-3 rounded-full hover:bg-violet-200">
                  <div className="text-md font-semibold pl-4">
                    Use this template
                  </div>
                  <div className="pr-4">
                    <MdEdit size={20} />
                  </div>
                </button>
              </div>
            </div>
            <div className="w-1/3  bg-violet-100  rounded-lg flex flex-col justify-between p-6">
              <div className="flex flex-col space-y-2">
                <div className="text-4xl font-semibold text-center">
                  <h1 className={pops.className}>SQL Query Engine</h1>
                </div>
                <div className="text-neutral-600 text-sm text-center">
                  Generate and optimize database queries with ease with the{" "}
                  <br />
                  SQL Query Engine template, designed to simplify
                  <br /> data retrieval and management.
                </div>
              </div>
              <div className="">
                <button className="flex flex-row justify-between w-full bg-violet-300 p-3 rounded-full hover:bg-violet-200">
                  <div className="text-md font-semibold pl-4">
                    Use this template
                  </div>
                  <div className="pr-4">
                    <MdEdit size={20} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 2 && <div>Content for Tab 3</div>}
      </div>
    </div>
  );
};

export default Tabs;
