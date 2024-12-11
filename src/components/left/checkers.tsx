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
      <div className="max-w-[17vw] flex flex-col bg-slate-900 p-3">
      <p className="text-gray-200  rounded-lg text-1xl font-bold px-3 py-3">Checkers</p>
        <div className="w-full mt-3  px-7 ">
       
          <div
            className="p-2  text-center flex gap-3 items-center text-blue font-thin hover:font-semibold hover:text-white bg-gray-400 hover:bg-blue-700 transition-colors hover:shadow-lg rounded mb-2 cursor-move"
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
            className="p-2  text-center flex gap-3 items-center text-blue font-thin hover:font-semibold  hover:text-white bg-gray-400 hover:bg-blue-700 hover:shadow-lg rounded mb-2 cursor-move"
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
            className="p-2  text-center flex gap-2 items-center font-thin hover:font-semibold  text-blue  hover:text-white bg-gray-400 hover:bg-blue-700 hover:shadow-lg rounded mb-2 cursor-move"
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
            <p className="">Grounded Answer Checker</p>
          </div>
        </div>
      </div>
    </>
  );
}
