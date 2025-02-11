import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import { collectionGroup, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { firedb } from "@/app/firebase";



const pops = Poppins({
  weight: "500",
  subsets: ["latin"],
});
const Tabs = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [projects, setProjects] = useState<any[]>([]); // Store the fetched projects
  const [loading, setLoading] = useState<boolean>(true); // Track loading state


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Reference to all 'projects' subcollections across all users
        const projectsRef = collectionGroup(firedb, "projects");

        // Create a query to fetch public projects (isPublic == true)
        const q = query(projectsRef, where("isPublic", "==", true));

        // Fetch the data
        const querySnapshot = await getDocs(q);

        // Extract data from the snapshot
        const fetchedProjects = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Update the state with the fetched projects
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []); // Empty dependency array, runs only once on component mount

 
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
           Your work
        </button>
        <button
          className={`px-4 py-2 text-md transition ${
            activeTab === 1
              ? "text-black border-b-2 border-black font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(1)}
        >
          Templates
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
          <div className="h-full flex flex-col md:flex-row md:space-y-0 md:space-x-3 space-x-0 space-y-4 justify-between">
            <div className="md:w-1/3 w-full bg-violet-100  rounded-lg flex flex-col md:space-y-0 space-y-4 justify-between p-6">
              <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                  <div className="md:text-sm text-xs text-neutral-600">
                    26th September 2024
                  </div>
                  <button className="rounded-lg bg-neutral-100 hover:bg-red-200 md:p-2 p-1">
                    <MdDelete className="hidden md:block" size={20} />
                    <MdDelete className="block md:hidden" size={14} />
                  </button>
                </div>
                <div className="md:text-4xl text-xl font-semibold">
                  <h1 className={pops.className}>Math Engine</h1>
                </div>
                <button className="mt-2 border-2 rounded-full p-2 border-black md:h-6 h-4 w-1/6 text-sm text-center items-center flex justify-center">
                  <div>
                    <FaLock className="block md:hidden" size={10} />
                    <FaLock className="hidden md:block" size={16} />
                  </div>
                </button>
              </div>
              <div className="">
                <Link href="/Flow/self_rag">
                  {" "}
                  <button className="flex flex-row justify-between w-full bg-violet-300 md:p-3 p-1 rounded-full hover:bg-violet-200">
                    <div className="md:text-md text-sm font-semibold pl-4">
                      Edit
                    </div>
                    <div className="pr-4">
                      <MdEdit size={20} />
                    </div>
                  </button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 w-full bg-indigo-100  rounded-lg flex flex-col justify-between md:space-y-0 space-y-4  p-6">
              <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                  <div className="md:text-sm text-xs text-neutral-600">
                    10th July 2024
                  </div>
                  <button className="rounded-lg bg-neutral-100 hover:bg-red-200  md:p-2 p-1">
                    <MdDelete className="hidden md:block" size={20} />
                    <MdDelete className="block md:hidden" size={14} />
                  </button>
                </div>
                <div className="md:text-4xl text-xl font-semibold">
                  <h1 className={pops.className}>Technical Writer</h1>
                </div>
                <button className="mt-2 border-2 rounded-full p-2 border-black md:h-6 h-4 w-1/6 text-sm text-center items-center flex justify-center">
                  <div>
                    <FaLock className="block md:hidden" size={10} />
                    <FaLock className="hidden md:block" size={16} />
                  </div>
                </button>
              </div>
              <div className="">
                <button className="flex flex-row justify-between w-full bg-violet-300 md:p-3 p-1 rounded-full hover:bg-violet-200">
                  <div className="md:text-md text-sm  font-semibold pl-4">
                    Edit
                  </div>
                  <div className="pr-4">
                    <MdEdit size={20} />
                  </div>
                </button>
              </div>
            </div>
            <div className="md:w-1/3 w-full bg-violet-100  rounded-lg md:space-y-0 space-y-4  flex flex-col justify-between p-6">
              <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                  <div className="md:text-sm text-xs text-neutral-600">
                    30th June 2024
                  </div>
                  <button className="rounded-lg bg-neutral-100 hover:bg-red-200  md:p-2 p-1">
                    <MdDelete className="hidden md:block" size={20} />
                    <MdDelete className="block md:hidden" size={14} />
                  </button>
                </div>
                <div className="md:text-4xl text-xl font-semibold">
                  <h1 className={pops.className}>SQL Query Engine</h1>
                </div>
                <button className="mt-2 border-2 rounded-full p-2 border-black md:h-6 h-4 w-1/6 text-sm text-center items-center flex justify-center">
                  <div>
                    <FaLockOpen className="block md:hidden" size={10} />
                    <FaLockOpen className="hidden md:block" size={16} />
                  </div>
                </button>
              </div>
              <div className="">
                <button className="flex flex-row justify-between w-full bg-violet-300 md:p-3 p-1 rounded-full hover:bg-violet-200">
                  <div className="md:text-md text-sm  font-semibold pl-4">
                    Edit
                  </div>
                  <div className="pr-4">
                    <MdEdit size={20} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 1 && (
          <div className="h-full flex flex-col md:flex-row md:space-y-0 md:space-x-3 space-x-0 space-y-4 justify-between">
            <div className="md:w-1/3 w-full bg-violet-100  rounded-lg flex flex-col md:space-y-0 space-y-4 justify-between p-6">
              <div className="flex flex-col space-y-2">
                <div className="md:text-4xl text-2xl font-semibold text-center">
                  <h1 className={pops.className}>Self-Reflection RAG</h1>
                </div>
                <div className="text-neutral-600 md:text-sm text-xs text-center">
                Discover deeper insights about yourself with the Self-Reflection RAG template, 
                crafted to guide introspection and <br/> foster personal growth through reflective analysis.
                </div>
              </div>
              <div className="">
                <Link href = "/Flow/self_rag">
                <button className="flex flex-row justify-between w-full bg-violet-300 md:p-3 p-2 rounded-full hover:bg-violet-200">
                  <div className="md:text-md text-sm font-semibold pl-4">
                    Continue
                  </div>
                  <div className="pr-4">
                    <MdEdit size={20} />
                  </div>
                </button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 w-full bg-violet-100  rounded-lg flex flex-col md:space-y-0 space-y-4 justify-between p-6">
              <div className="flex flex-col space-y-2">
                <div className="md:text-4xl text-2xl font-semibold text-center">
                  <h1 className={pops.className}>Wikipedia Search</h1>
                </div>
                <div className="text-neutral-600 md:text-sm text-xs text-center">
                Quickly explore vast knowledge with the Wikipedia Search template, 
                designed to provide accurate and <br /> comprehensive information at your fingertips.
                </div>
              </div>
              <div className="">
                <button className="flex flex-row justify-between w-full bg-violet-300 md:p-3 p-2  rounded-full hover:bg-violet-200">
                  <div className="md:text-md text-sm font-semibold pl-4">
                   Continue
                  </div>
                  <div className="pr-4">
                    <MdEdit size={20} />
                  </div>
                </button>
              </div>
            </div>
            <div className="md:w-1/3 w-full bg-violet-100  rounded-lg flex flex-col md:space-y-0 space-y-4 justify-between p-6">
              <div className="flex flex-col space-y-2">
                <div className="md:text-4xl text-2xl font-semibold text-center">
                  <h1 className={pops.className}>Image Search</h1>
                </div>
                <div className="text-neutral-600 md:text-sm text-xs text-center">
                Effortlessly find the visuals you need with the Image Search template, 
                tailored to deliver relevant and <br /> high-quality images in seconds.
                </div>
              </div>
              <div className="">
                <Link href="/Flow/image_search">
                <button className="flex flex-row justify-between w-full bg-violet-300 md:p-3 p-2 rounded-full hover:bg-violet-200">
                  <div className="md:text-md text-sm font-semibold pl-4">
                    Continue
                  </div>
                  <div className="pr-4">
                    <MdEdit size={20} />
                  </div>
                </button>
                </Link>
              </div>
            </div>
          </div>
        )}
       {activeTab === 2 && (
          <div className="h-full flex flex-row w-full   flex-wrap justify-center mb-5 ">
            {loading ? (
              <div>Loading projects...</div>
            ) : (
              projects.length > 0 ? (
                projects.map((project, index) => (
                  <div
                    key={index}
                    className="w-1/4 h-full  bg-violet-100 rounded-lg flex flex-col justify-between space-y-0  p-6 mb-2 ml-2"
                  >
                    <div className="flex flex-col">
                      <div className="flex flex-row justify-between">
                        <div className="md:text-sm text-xs text-neutral-600">
                          {new Date(project.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                       
                      </div>
                      <div className="md:text-4xl text-xl font-semibold pb-5">
                        <h1 className={pops.className}>{project.filename}</h1>
                      </div>
                     
                    </div>
                    <div>
                      <Link href={`/Flow/${project.username}/${project.filename}`}>
                        <button className="flex flex-row justify-between w-full bg-violet-300 md:p-3 p-1 rounded-full hover:bg-violet-200">
                          <div className="md:text-md text-sm font-semibold pl-4">
                            Edit
                          </div>
                          <div className="pr-4">
                            <MdEdit size={20} />
                          </div>
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div>No public projects found.</div>
              )
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Tabs;
