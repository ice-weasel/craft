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
            <div className="w-1/3  bg-violet-100  rounded-lg flex flex-col justify-between p-10">
              <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                  <div className="text-lg">26th September 2024</div>
                  <button className="rounded-lg bg-neutral-100 hover:bg-red-200 p-2">
                    <MdDelete size={26} />
                  </button>
                </div>
                <div className="text-5xl font-semibold">
                  <h1 className={pops.className}>PPT RAG</h1>
                </div>
              </div>
              <div className="">
                <button className="flex flex-row justify-between w-full bg-violet-300 p-3 rounded-full hover:bg-violet-200">
                  <div className="text-xl font-semibold pl-4">Edit</div>
                  <div className="pr-4">
                    <MdEdit size={26} />
                  </div>
                </button>
              </div>
            </div>
            <div className="w-1/3  bg-indigo-100  rounded-lg flex flex-col justify-between p-10">
              <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                  <div className="text-lg">26th September 2024</div>
                  <button className="rounded-lg bg-neutral-100 hover:bg-red-200 p-2">
                    <MdDelete size={26} />
                  </button>
                </div>
                <div className="text-5xl font-semibold">
                  <h1 className={pops.className}>Wikipedia Search</h1>
                </div>
              </div>
              <div className="">
                <button className="flex flex-row justify-between w-full bg-violet-300 p-3 rounded-full hover:bg-violet-200">
                  <div className="text-xl font-semibold pl-4">Edit</div>
                  <div className="pr-4">
                    <MdEdit size={26} />
                  </div>
                </button>
              </div>
            </div>
            <div className="w-1/3  bg-violet-100  rounded-lg flex flex-col justify-between p-10">
              <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                  <div className="text-lg">26th September 2024</div>
                  <button className="rounded-lg bg-neutral-100 hover:bg-red-200 p-2">
                    <MdDelete size={26} />
                  </button>
                </div>
                <div className="text-5xl font-semibold">
                  <h1 className={pops.className}>Image Search</h1>
                </div>
              </div>
              <div className="">
                <button className="flex flex-row justify-between w-full bg-violet-300 p-3 rounded-full hover:bg-violet-200">
                  <div className="text-xl font-semibold pl-4">Edit</div>
                  <div className="pr-4">
                    <MdEdit size={26} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 1 && (
          <div className="h-full flex flex-row justify-between space-x-5">
            <div className="w-1/3  bg-violet-100  rounded-lg flex flex-col justify-between p-10">
              <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                  <div className="text-lg">26th September 2024</div>
                  <button className="rounded-lg bg-neutral-100 hover:bg-red-200 p-2">
                    <MdDelete size={26} />
                  </button>
                </div>
                <div className="text-5xl font-semibold">
                  <h1 className={pops.className}>PPT RAG</h1>
                </div>
              </div>
              <div className="">
                <button className="flex flex-row justify-between w-full bg-violet-300 p-3 rounded-full hover:bg-violet-200">
                  <div className="text-xl font-semibold pl-4">Edit</div>
                  <div className="pr-4">
                    <MdEdit size={26} />
                  </div>
                </button>
              </div>
            </div>
            <div className="w-1/3  bg-indigo-100  rounded-lg flex flex-col justify-between p-10">
              <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                  <div className="text-lg">26th September 2024</div>
                  <button className="rounded-lg bg-neutral-100 hover:bg-red-200 p-2">
                    <MdDelete size={26} />
                  </button>
                </div>
                <div className="text-5xl font-semibold">
                  <h1 className={pops.className}>Wikipedia Search</h1>
                </div>
              </div>
              <div className="">
                <button className="flex flex-row justify-between w-full bg-violet-300 p-3 rounded-full hover:bg-violet-200">
                  <div className="text-xl font-semibold pl-4">Edit</div>
                  <div className="pr-4">
                    <MdEdit size={26} />
                  </div>
                </button>
              </div>
            </div>
            <div className="w-1/3  bg-violet-100  rounded-lg flex flex-col justify-between p-10">
              <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                  <div className="text-lg">26th September 2024</div>
                  <button className="rounded-lg bg-neutral-100 hover:bg-red-200 p-2">
                    <MdDelete size={26} />
                  </button>
                </div>
                <div className="text-5xl font-semibold">
                  <h1 className={pops.className}>Image Search</h1>
                </div>
              </div>
              <div className="">
                <button className="flex flex-row justify-between w-full bg-violet-300 p-3 rounded-full hover:bg-violet-200">
                  <div className="text-xl font-semibold pl-4">Edit</div>
                  <div className="pr-4">
                    <MdEdit size={26} />
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
