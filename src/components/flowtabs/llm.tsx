export default function LLMs() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <>
      <div>
        <div
          className="p-2 border rounded mb-2 cursor-move bg-white"
          onDragStart={(e) => onDragStart(e, "default")}
          draggable
        >
          ChatGPT
        </div>
        <div
          className="p-2 border rounded mb-2 cursor-move bg-white"
          onDragStart={(e) => onDragStart(e, "input")}
          draggable
        >
          Gemini
        </div>
        <div
          className="p-2 border rounded mb-2 cursor-move bg-white"
          onDragStart={(e) => onDragStart(e, "output")}
          draggable
        >
          Llama
        </div>
      </div>
    </>
  );
}
