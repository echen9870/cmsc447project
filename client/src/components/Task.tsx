import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./Components.css";
import Axios from "axios";

interface Props {
  _id: string;
  groupId: string;
  name: string;
  description: string;
  assignedUsers: string[];
  completed: boolean;
  createdAt: string;
  dueAt: string;
  members: string[];
  onTaskRefresh: () => void;
}

const Task = (task: Props) => {
  //States to manage how our task should look
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedAssignMember, setSelectedAssignMember] = useState("");
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

  const handleFinish = async () => {
    try {
      console.log(!task.completed);
      const response = await Axios.put(
        `http://localhost:3000/task/toggle_finish_task/${task._id}`,
        { completed: task.completed }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
    task.onTaskRefresh();
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

  //Assign/Unassign users to the task
  const handleAssignUserToTask = async () => {
    console.log(task._id);
    console.log(selectedAssignMember);
    if (!task.assignedUsers.includes(selectedAssignMember)) {
      // Assigns the user to the task
      try {
        const response = await Axios.put(
          `http://localhost:3000/task/add_member_to_task/${task._id}/${selectedAssignMember}`
        );
        console.log(response);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      //Unassign the user from the task
      try {
        const response = await Axios.put(
          `http://localhost:3000/task/remove_member_to_task/${task._id}/${selectedAssignMember}`
        );
        console.log(response);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    task.onTaskRefresh();
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
            className="rounded bg-prismPurple outline-grey-400 text-white"
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
            className="rounded bg-prismPurple outline-grey-400 text-white"
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
            <button className="purpleButton" onClick={handleEditTask}>
              Edit
            </button>
          )}
          <button className="redButton" onClick={() => onTaskDelete()}>
            Delete
          </button>
          <button className="greenButton" onClick={handleExpandClick}>
            {isExpanded ? "Collapse" : "Expand"}
          </button>
        </div>
        {/*Task Expanded Section*/}
        {isExpanded && (
          <>
            <div className="expandContent">
              {/*Task Assigned Section*/}
              <div className="d-flex ">
                <button
                  className="purpleButton bg-purple-500 "
                  onClick={handleAssignUserToTask}
                >
                  Unassign/Assign Members
                </button>
                <select
                  className="text-white rounded-lg bg-prismPurple "
                  id="dropdown"
                  value={selectedAssignMember}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setSelectedAssignMember(e.target.value);
                  }}
                >
                  <option value={""} className=""></option>
                  {task.members.map((member, index) => (
                    <option key={index} value={member} className="text-white">
                      {member}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex outline-gray-400 outline rounded-md ">
                <p className="px-2 border-r-2">Assigned To:</p>
                {task.assignedUsers.map((member) => (
                  <p className="px-2 border-x-2">{member}</p>
                ))}
                <p className="px-2 border-l-2"></p>
              </div>

              {/*Task Notes Section*/}
              <textarea
                ref={textAreaRef}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  handleTaskEdit(e);
                }}
                name="description"
                onBlur={handleEditTaskSubmit}
                className="flex-grow bg-prismPurple outline-gray-400 hover:border-2 my-2 text-gray-100 resize-none overflow-hidden"
                placeholder="Add notes"
                defaultValue={task.description}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Task;
