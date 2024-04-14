import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import "./Flow.css";

// Assuming the type of the data props might look something like this:
interface CustomNodeData {
  name: string;
  description: string;
  image: any;
  type: string;
}

const CustomNode = ({
  data,
  isConnectable,
}: NodeProps<CustomNodeData>) => {
  const isInput: boolean = data.type === "input";

  return (
    <div className="p-2 rounded node-container bg-secondary">
      {!isInput && (
        <Handle
          type="target"
          position={Position.Left}  // Position the target handle on the left
          isConnectable={isConnectable}
        />
      )}
      <div className="d-flex align-items-center gap-3">
        {data.image && (
          <img
            src={data.image}
            alt={data.name}
            className="rounded image-container"
          />
        )}
        <div>
          <h5>{data.name}</h5>
          <h6>{data.description}</h6>
        </div>
      </div>
      {isInput && (
        <Handle
          type="source"
          position={Position.Right} // Position the source handle on the right
          isConnectable={isConnectable}
        />
      )}
    </div>
  );
};

CustomNode.displayName = "CustomNode";

export default memo(CustomNode);
