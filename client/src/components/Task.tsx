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

  //change the format of how the due date is displayed
  const formatDueDate = (dueAt: string) => {
    if (!dueAt) {
      return ""; // Return nothing if no date is passed
    }
    const date = new Date(dueAt);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    const timeString = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  
    return `${month}/${day}/${year}, ${timeString}`;
  };

  //When we want to complete the action of editing our task
  const handleEditTaskSubmit = async () => {
    try {
      const response = await Axios.put(
        `https://todolist-taskmeister-78653fbaf01e.herokuapp.com/task/edit_task`,
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
        `https://todolist-taskmeister-78653fbaf01e.herokuapp.com/task/toggle_finish_task/${task._id}`,
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
      // Synchronize assignedUsers with the original task
      assignedUsers: [...task.assignedUsers]
    }));
  };

  //When we want to delete our task
  const onTaskDelete = async () => {
    //accounts for accidentally touching of the task delete button
    if(isEdit){
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this task?"
      );

      if (isConfirmed) {
        try {
          const response = await Axios.delete(
            `https://todolist-taskmeister-78653fbaf01e.herokuapp.com/task/delete_task/${task._id}`
          );
          console.log(response);
        } catch (error) {
          console.error("Error:", error);
        }
        task.onTaskRefresh();
      }
    } 
    //normally just delete, no problems
    else {
      try {
        const response = await Axios.delete(
          `https://todolist-taskmeister-78653fbaf01e.herokuapp.com/task/delete_task/${task._id}`
        );
        console.log(response);
      } catch (error) {
        console.error("Error:", error);
      }
      task.onTaskRefresh();
    }
  };

  //Assign/Unassign users to the task
  const handleAssignUserToTask = async () => {
    console.log(task._id);
    console.log(selectedAssignMember);
    if (!task.assignedUsers.includes(selectedAssignMember)) {
      // Assigns the user to the task
      try {
        const response = await Axios.put(
          `https://todolist-taskmeister-78653fbaf01e.herokuapp.com/task/add_member_to_task/${task._id}/${selectedAssignMember}`
        );
        console.log(response);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      //Unassign the user from the task
      try {
        const response = await Axios.put(
          `https://todolist-taskmeister-78653fbaf01e.herokuapp.com/task/remove_member_to_task/${task._id}/${selectedAssignMember}`
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
    <div className="flex items-center">
      <button className="font-100 text-3xl" onClick={handleFinish}>
        {task.completed ? "☑" : "☐"}
      </button>
      <div className="task flex flex-col flex-1">
          <div className="task-header flex justify-between items-center">
          {/* Task Name Section */}
          {isEdit ? (
            <input
              name="name"
              type="text"
              value={curTask.name}
              className="rounded bg-prismPurple outline-grey-400 text-white"
              onChange={(e) => handleTaskEdit(e)}
            />
          ) : (
            <b className="flex-1">{curTask.name}</b>
          )}

          {/* Delete Button Section */}
          <button className="hover:bg-black focus:outline-none" onClick={() => onTaskDelete()}>
            ❌
          </button>
        </div>

        {/*Task DueAt Section*/}
        {isEdit ? (
          <input
            type="datetime-local"
            name="dueAt"
            className="rounded bg-prismPurple outline-grey-400 text-white"
            value={curTask.dueAt}
            onChange={(e) => handleTaskEdit(e)}
          ></input>
        ) : (
          <p className="text-xs text-gray-400">Due By: {formatDueDate(curTask.dueAt)}</p>
        )}
        {/*Task Buttons Section*/}
        <div className="d-flex">
        
          {isEdit ? (
            <button className="editButton" onClick={handleEditTaskSubmit}>
              Confirm
            </button>
          ) : (
            <button className="purpleButton" onClick={handleEditTask}>
              Edit
            </button>
          )}
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
    </div>
    </>
  );
};

export default Task;
