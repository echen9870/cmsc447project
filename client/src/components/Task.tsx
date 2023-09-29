import { useState } from "react";
import "./Components.css";

interface Props {
  taskName: string;
}

const Task = ({ taskName }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpandClick = () => setIsExpanded(!isExpanded);
  return (
    <>
      <div className="task flex flex-col">
        <b className="flex-1 justify-center">{taskName}</b>
        <p className="text-xs text-gray-400">Due by 9/25</p>
        <div className="d-flex">
          <button className="finishButton">Finish</button>
          <button className="editButton">Edit</button>
          <button className="deleteButton">Delete</button>
          <button className="expandButton" onClick={handleExpandClick}>
            {isExpanded ? "Collapse" : "Expand"}
          </button>
        </div>
        {isExpanded && (
          <div className="expandContent">
            <p>Assigned to: John Doe</p>
            <textarea
              className="flex-grow bg-prismPurple outline-gray-400 hover:border-2 text-gray-100"
              placeholder="Add notes"
            ></textarea>
          </div>
        )}
      </div>
    </>
  );
};

export default Task;
