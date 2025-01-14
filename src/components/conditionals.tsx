import React from "react";

// components/SimpleModal.tsx
interface ModalProps {
    isOpen: boolean;
    edges: any[];
    onClose: () => void;
    onSave: (edgeLabels: { id: string; label: string }[]) => void;
  }
  
  const Conditionals: React.FC<ModalProps> = ({ isOpen, edges, onClose, onSave }) => {
    const [labels, setLabels] = React.useState<{ id: string; label: string }[]>([]);
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Edge Conditions</h2>
          {edges.map((edge, index) => (
            <div key={edge.id} className="mb-4">
              <label className="block mb-2">
                Condition for Edge {index + 1}:
              </label>
              <input
                type="text"
                className="border p-2 w-full rounded"
                onChange={(e) => {
                  const newLabels = [...labels];
                  newLabels[index] = { id: edge.id, label: e.target.value };
                  setLabels(newLabels);
                }}
              />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button onClick={() => onSave(labels)} className="px-4 py-2 bg-black text-white rounded">Save</button>
          </div>
        </div>
      </div>
    );
  };

  export default Conditionals