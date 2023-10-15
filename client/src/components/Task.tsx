import { ChangeEvent, useEffect, useRef, useState } from "react";
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

  //Used to make sure our description text box automatically is the size needed to display all the information in the text box
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (isExpanded && textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset the height to auto
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Set the height based on the scroll height
    }
  }, [isExpanded, textAreaRef.current, curTask.description]);

  const handleFinish = () => {
    setCurTask((prev) => ({
      ...prev,
      ["completed"]: !curTask.completed,
    }));
    handleEditTaskSubmit();
  };

  //Saving changes to our task
  const handleTaskEdit = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    setIsEdit(false);
  };

  return (
    <>
      <div className="task flex flex-col">
        {/*Task Name Section*/}
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

        {/*Task DueAt Section*/}
        {isEdit ? (
          <input
            type="date"
            name="dueAt"
            className="text-black"
            value={curTask.dueAt}
            onChange={(e) => handleTaskEdit(e)}
          ></input>
        ) : (
          <p className="text-xs text-gray-400">Due By: {curTask.dueAt}</p>
        )}
        {/*Task Buttons Section*/}
        <div className="d-flex">
          <button className="finishButton" onClick={handleFinish}>
            {task.completed ? "Unfinish" : "Finish"}
          </button>
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
        {/*Task Expanded Section*/}
        {isExpanded && (
          <div className="expandContent">
            {/*Task Assigned Section*/}
            <p>Assigned to: John Doe</p>

            {/*Task Notes Section*/}
            <textarea
              ref={textAreaRef}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                handleTaskEdit(e);
              }}
              name="description"
              onBlur={handleEditTaskSubmit}
              className="flex-grow bg-prismPurple outline-gray-400 hover:border-2 text-gray-100 resize-none overflow-hidden"
              placeholder="Add notes"
              defaultValue={task.description}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Task;
