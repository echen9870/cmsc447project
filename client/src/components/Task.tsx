import { useState } from "react";
import "./Components.css";
import Axios from "axios";

interface Props {
  _id: string;
  groupId: string;
  name: string;
  description: string;
  assignedUsers: [];
  completed: boolean;
  createdAt: string;
  dueAt: string;
  onTaskRefresh: () => void;
}

const Task = (task: Props) => {
  //States to manage how our task should look
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  //State to manage the info in the task
  const [curTask, setCurTask] = useState(task);

  //When we want to expand/edit our task
  const handleExpandClick = () => setIsExpanded(!isExpanded);
  const handleEditTask = () => setIsEdit(!isEdit);

  //Saving changes to our task
  const handleTaskEdit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurTask((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(curTask);
  };

  //When we want to delete our task
  const onTaskDelete = async () => {
    try {
      const response = await Axios.delete(
        `http://localhost:3000/task/delete_task/${task._id}`
      );
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
    task.onTaskRefresh();
  };

  //When we want to complete the action of editing our task
  const handleEditTaskSubmit = async () => {
    try {
      const response = await Axios.put(
        `http://localhost:3000/task/edit_task`,
        curTask
      );
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
    task.onTaskRefresh();
    setIsEdit(!isEdit);
  };

  return (
    <>
      <div className="task flex flex-col">
        {isEdit ? (
          <input
            name="name"
            type="text"
            value={curTask.name}
            className="text-black"
            onChange={(e) => handleTaskEdit(e)}
          ></input>
        ) : (
          <b className="flex-1 justify-center">{curTask.name}</b>
        )}
        <p className="text-xs text-gray-400">Due by 9/25</p>
        <div className="d-flex">
          <button className="finishButton">Finish</button>
          {isEdit ? (
            <button className="editButton" onClick={handleEditTaskSubmit}>
              Confirm
            </button>
          ) : (
            <button className="editButton" onClick={handleEditTask}>
              Edit
            </button>
          )}
          <button className="deleteButton" onClick={() => onTaskDelete()}>
            Delete
          </button>
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
