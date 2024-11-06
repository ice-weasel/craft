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
        <div className="flex flex-col">
          <h1 className="text-white bg-blue-700 text-center py-8">Checkers</h1>
          <div className="w-full mt-11 space-y-6 px-7 border-2 rounded-xl border-blue-700">
          <div
            className="p-2 border-4 text-center rounded mb-2 cursor-move bg-white"
            onDragStart={(e) => onDragStart(e, "default",{label:"relevancy-checker",action:"relevancy"})}
            draggable
          >
            Relevancy Checker
          </div>
          <div
            className="p-2 border-4 text-center rounded mb-2 cursor-move bg-white"
            onDragStart={(e) => onDragStart(e,"default",{label:"halucination-checker",action:"hallucinate"})}
            draggable
          >
            Hallucination Checker
          </div>
          <div
            className="p-2 border-4 text-center rounded mb-2 cursor-move bg-white"
            onDragStart={(e) => onDragStart(e, "default",{label:"grounded-answer-checker",action:"grounded-check"})}
            draggable
          >
            Grounded Answer Checker
          </div>
          </div>
       
        </div>
      </>
    );
  }
  