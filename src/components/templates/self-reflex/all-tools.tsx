import React from "react";
import Nodes from "./nodes";
import Checkers from "./checkers";
import Advanced from "./advanced";
import { RiDraggable } from "react-icons/ri";

const Alltools = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, data: any) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: nodeType, data })
    );
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <div className="space-y-2   ">
      <div className="flex border-2 rounded-xl bg-zinc-800 shadow-xl p-5 border-zinc-800 flex-col ">
        <p className=" text-zinc-200  text-lg rounded-lg font-bold px-3 mt-3">
          Essentials
        </p>
        <div className="w-full flex flex-col p-3">
        <div
            className="p-2  text-center flex gap-3 items-center text-blue  font-semibold hover:text-black bg-indigo-400 hover:bg-indigo-500 transition-colors hover:shadow-lg rounded mb-2 cursor-move"
            onDragStart={(e) =>
              onDragStart(e, "input", {
                label: "Start",
                action: "start",
              })
            }
            draggable
          >
            <span>
              <RiDraggable />
            </span>
            <p>Start</p>
          </div>
          <div
            className="p-2  text-center flex gap-3 items-center text-blue  font-semibold hover:text-black bg-indigo-400 hover:bg-indigo-500 transition-colors hover:shadow-lg rounded mb-2 cursor-move"
            onDragStart={(e) =>
              onDragStart(e, "output", {
                label: "Stop",
                action: "stop",
              })
            }
            draggable
          >
            <span>
              <RiDraggable />
            </span>
            <p>Stop</p>
          </div>
          <div
            className="p-2  text-center flex gap-3 items-center text-blue  font-semibold hover:text-black bg-indigo-400 hover:bg-indigo-500 transition-colors hover:shadow-lg rounded mb-2 cursor-move"
            onDragStart={(e) =>
              onDragStart(e, "conditional", {
                label: "Retrieve",
                action: "retrieve",
              })
            }
            draggable
          >
            <span>
              <RiDraggable />
            </span>
            <p>Retrieve Node</p>
          </div>
          <div
            className="p-2  text-center flex gap-3 items-center text-blue  font-semibold hover:text-black bg-indigo-400 hover:bg-indigo-500 transition-colors hover:shadow-lg rounded mb-2 cursor-move"
            onDragStart={(e) =>
              onDragStart(e, "conditional", {
                label: "Generate",
                action: "generate",
              })
            }
            draggable
          >
            <span>
              <RiDraggable />
            </span>
            <p>Generate Node</p>
          </div>
        </div>
      </div>
      <Nodes />
      <Checkers />
    </div>
  );
};

export default Alltools;
