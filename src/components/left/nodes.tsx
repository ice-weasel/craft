import { RiDraggable } from "react-icons/ri";
export default function Nodes() {
  const onDragStart = (event: React.DragEvent, nodeType: string, data: any) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: nodeType, data })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <>
      <div className="flex flex-col  bg-slate-900 p-3">
      <p className=" text-gray-200 bg-gray-900 rounded-lg text-1xl font-bold px-3 py-3">Nodes</p>
        <div className="w-full mt-3  px-7">
       
          <div
            className="p-2  text-center flex gap-3 items-center text-blue font-thin hover:font-semibold hover:text-white bg-gray-400 hover:bg-blue-700 transition-colors hover:shadow-lg rounded mb-2 cursor-move"
            onDragStart={(e) =>
              onDragStart(e, "default", {
                label: "grade-documents",
                action: "grade",
              })
            }
            draggable
          >
            <span>
              <RiDraggable />
            </span>
            <p>Grade Documents</p>
          </div>
          <div
            className="p-2  text-center flex gap-3 items-center text-blue font-thin hover:font-semibold  hover:text-white bg-gray-400 hover:bg-blue-700 hover:shadow-lg rounded mb-2 cursor-move"
            onDragStart={(e) =>
              onDragStart(e, "default", {
                label: "rewrite-node",
                action: "rewrite",
              })
            }
            draggable
          >
            <span>
              <RiDraggable />
            </span>
            <p>Rewrite Node</p>
          </div>
          <div
            className="p-2  text-center flex gap-3 items-center font-thin hover:font-semibold  text-blue  hover:text-white bg-gray-400 hover:bg-blue-700 hover:shadow-lg rounded mb-2 cursor-move"
            onDragStart={(e) =>
              onDragStart(e, "default", {
                label: "web-search-node",
                action: "search",
              })
            }
            draggable
          >
            <span>
              <RiDraggable />
            </span>
            <p>Web Search Node</p>
          </div>
        </div>
      </div>
    </>
  );
}
