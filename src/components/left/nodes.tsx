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
      <div className="flex flex-col">
        <h1 className="text-white bg-blue-700 text-center py-8">Nodes</h1>
        <div className="w-full mt-11 space-y-6 p-7 border-2 rounded-xl border-blue-700">
          <div
            className="p-2 border-4 text-center rounded mb-2 cursor-move bg-white"
            onDragStart={(e) => onDragStart(e, "default", { label: "grade-documents", action: "grade" })}
            draggable
          >
            Grade Documents
          </div>
          <div
            className="p-2 border-4 text-center rounded mb-2 cursor-move bg-white"
            onDragStart={(e) => onDragStart(e, "default", { label: "rewrite-node", action: "rewrite" })}
            draggable
          >
            Rewrite Node
          </div>
          <div
            className="p-2 border-4 text-center rounded mb-2 cursor-move bg-white"
            onDragStart={(e) => onDragStart(e, "default", { label: "web-search-node", action: "search" })}
            draggable
          >
            Web Search Node
          </div>
        </div>
      </div>
    </>
  );
  
}
