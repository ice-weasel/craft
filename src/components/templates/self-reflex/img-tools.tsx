import "tailwindcss/tailwind.css";
import { RiDraggable } from "react-icons/ri";
export default function IMGTools() {
  const onDragStart = (event: React.DragEvent, nodeType: string, data: any) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: nodeType, data })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <>
      <div className="flex flex-colflex border-2 rounded-xl bg-zinc-800 shadow-xl p-5 border-zinc-800 flex-col  ">
        <p className=" text-zinc-200  text-lg rounded-lg font-bold px-3 mt-3">Nodes</p>
        <div className="w-full flex flex-col p-3">
          <div
            className="p-2  text-center flex gap-3 items-center text-blue  font-semibold hover:text-black bg-indigo-400 hover:bg-indigo-500 transition-colors hover:shadow-lg rounded mb-2 cursor-move"
            onDragStart={(e) =>
              onDragStart(e, "default", {
                label: "visualize-tool",
                action: "visualize",
              })
            }
            draggable
          >
            <span>
              <RiDraggable />
            </span>
            <p>Visualization Tool</p>
          </div>
          <div
            className="p-2  text-center flex gap-3 items-center text-blue  font-semibold hover:text-black bg-indigo-400 hover:bg-indigo-500 transition-colors hover:shadow-lg rounded mb-2 cursor-move"
            onDragStart={(e) =>
              onDragStart(e, "default", {
                label: "adv-search-tool",
                action: "adv-search",
              })
            }
            draggable
          >
            <span>
              <RiDraggable />
            </span>
            <p>Advanced Search Tool</p>
          </div>
        </div>
      </div>
    </>
  );
}
