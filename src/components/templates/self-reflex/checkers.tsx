import "tailwindcss/tailwind.css";
import { RiDraggable } from "react-icons/ri";
export default function Checkers() {
  const onDragStart = (event: React.DragEvent, nodeType: string, data: any) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: nodeType, data })
    );
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <>
      <div className=" flex flex-col ">
        <p className="text-black  rounded-lg font-semibold px-3 mt-3">
          Checkers
        </p>
        <div className="w-full flex flex-col p-3 ">
          <div
            className="p-2 flex gap-3 items-center text-blue  font-semibold hover:text-black bg-indigo-100 hover:bg-indigo-200 transition-colors hover:shadow-lg rounded mb-2 cursor-move"
            onDragStart={(e) =>
              onDragStart(e, "default", {
                label: "relevancy-checker",
                action: "relevancy",
              })
            }
            draggable
          >
            <span>
              <RiDraggable />
            </span>
            <p className="">Relevancy Checker</p>
          </div>
          <div
            className="p-2 flex gap-3 items-center text-blue  font-semibold hover:text-black bg-indigo-100 hover:bg-indigo-200 transition-colors hover:shadow-lg rounded mb-2 cursor-move"
            onDragStart={(e) =>
              onDragStart(e, "default", {
                label: "hallucination-checker",
                action: "hallucinate",
              })
            }
            draggable
          >
            <span>
              <RiDraggable />
            </span>
            <p>Hallucination Checker</p>
          </div>
          <div
            className="p-2  flex gap-3 items-center text-blue  font-semibold hover:text-black bg-indigo-100 hover:bg-indigo-200 transition-colors hover:shadow-lg rounded mb-2 cursor-move"
            onDragStart={(e) =>
              onDragStart(e, "default", {
                label: "grounded-answer-checker",
                action: "grounded-check",
              })
            }
            draggable
          >
            <span>
              <RiDraggable />
            </span>
            <p className="">Answer Checker</p>
          </div>
        </div>
      </div>
    </>
  );
}
