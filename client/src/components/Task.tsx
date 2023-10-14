import { useState } from "react";
import "./Components.css";
import Axios from "axios";

interface Props {
  taskName: string;
  taskID:string;
  onTaskRefresh : () => void;
}

const Task = ({ taskID,taskName,onTaskRefresh }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpandClick = () => setIsExpanded(!isExpanded);

  const onTaskDelete =  async (taskID:string) => {
    try {
      const response = await Axios.delete(
        `http://localhost:3000/task/delete_task/${taskID}`,
      );
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
    onTaskRefresh();
  }

  return (
    <>
      <div className="task flex flex-col">
        <b className="flex-1 justify-center">{taskName}</b>
        <p className="text-xs text-gray-400">Due by 9/25</p>
        <div className="d-flex">
          <button className="finishButton">Finish</button>
          <button className="editButton">Edit</button>
          <button className="deleteButton" onClick ={() => onTaskDelete(taskID)} >Delete</button>
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
