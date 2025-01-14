import "tailwindcss/tailwind.css";
import { RiDraggable } from "react-icons/ri";
export default function Advanced() {
  const onDragStart = (event: React.DragEvent, nodeType: string, data: any) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: nodeType, data })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <>
      <div className="flex flex-col ">
        <p className=" text-black  rounded-lg font-semibold px-3 mt-3">Advanced Tools</p>
        <div className="w-full flex flex-col p-3">
          <div
            className="p-2  text-center flex gap-3 items-center text-blue  font-semibold hover:text-black bg-indigo-100 hover:bg-indigo-200 transition-colors hover:shadow-lg rounded mb-2 cursor-move"
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
          <div
            className="p-2  text-center flex gap-3 items-center text-blue  font-semibold hover:text-black bg-indigo-100 hover:bg-indigo-200 transition-colors hover:shadow-lg rounded mb-2 cursor-move"
            onDragStart={(e) =>
              onDragStart(e, "default", {
                label: "text-extraction",
                action: "text-extraction",
              })
            }
            draggable
          >
            <span>
              <RiDraggable />
            </span>
            <p>Text-Extraction</p>
          </div>
        </div>
      </div>
    </>
  );
}
