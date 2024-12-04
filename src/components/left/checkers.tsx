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
      <div className="flex flex-col p-3">
      
        <div className="w-full mt-3  px-7 ">
        <p className="text-black  text-1xl font-bold py-3">Checkers</p>
          <div
            className="p-2  text-center flex gap-3 items-center text-blue bg-blue-300 hover:shadow-lg rounded mb-2 cursor-move "
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
            className="p-2  flex gap-3 items-center text-center hover:shadow-lg rounded mb-2 cursor-move bg-blue-300"
            onDragStart={(e) =>
              onDragStart(e, "default", {
                label: "halucination-checker",
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
            className="p-2  flex gap-3 items-center text-center hover:shadow-lg rounded mb-2 cursor-move bg-blue-300"
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
            <p>Grounded Answer Checker</p>
          </div>
        </div>
      </div>
    </>
  );
}
