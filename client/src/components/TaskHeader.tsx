import { useState, useEffect } from "react";
import axios from "axios";

interface Props {
  groupID: string;
  isOwner: boolean;
  onGroupDelete: (groupID: string) => {};
  onGroupNameChange: (groupID: string, newGroupName: string) => {};
  onTaskAdd: (groupID: string) => {};
  refreshTask: () => {};
}

const Taskheader = ({
  groupID,
  isOwner,
  onGroupDelete,
  onGroupNameChange,
  onTaskAdd,
  refreshTask,
}: Props) => {
  const [changeNameView, setChangeNameView] = useState(false);
  const [newName, setNewName] = useState("");
  const onTaskDeleteAll = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/group/delete_all_tasks/${groupID}`
      );
      console.log(response); 
    } catch (error) {
      console.error("Error:", error);
      // Handle errors or display error messages to the user
    }
    refreshTask();
  };

  const handleAllTaskStatusChange = async (isFinish: boolean) => {
    try {
      const endpoint = isFinish ? "finish_all_tasks" : "unfinish_all_tasks";
      const response = await axios.put(
        `http://localhost:3000/group/${endpoint}/${groupID}`
      );
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
    refreshTask();
  };

  return (
    <>
      <div className="bg-prismDarkPurple content-right">
        <button
          className="bg-green-500 text-white m-2 py-1 px-2 rounded"
          onClick={() => onTaskAdd(groupID)}
        >
          Add Task
        </button>
        <button
          className="bg-blue-500 text-white m-2 py-1 px-2 rounded"
          onClick={() => handleAllTaskStatusChange(true)}
        >
          Finish All
        </button>
        <button
          className="bg-prismLightPurple text-white m-2 py-1 px-2 rounded"
          onClick={() => handleAllTaskStatusChange(false)}
        >
          Unfinish All
        </button>
        {isOwner && (
          <>
            <button
              className="bg-red-500  text-white m-2 py-1 px-2 rounded"
              onClick={onTaskDeleteAll}
            >
              Delete All
            </button>
            {isOwner && (
              <button
                className="bg-purple-500  text-white ml-2 m-2 py-1 px-2 rounded"
                onClick={() => setChangeNameView(!changeNameView)}
              >
                Change Name
              </button>
            )}
            {changeNameView && (
              <input
                type="text"
                placeholder="Change Group Name"
                className="rounded bg-prismDarkPurple outline-white outline text-white px-2"
                onChange={(e) => setNewName(e.target.value)}
                value={newName}
              ></input>
            )}
            {changeNameView && (
              <button
                className="bg-purple-500  text-white ml-2 m-2 py-1 px-2 rounded"
                onClick={() => {
                  setChangeNameView(!changeNameView);
                  onGroupNameChange(groupID, newName);
                  setNewName("");
                }}
              >
                Edit
              </button>
            )}
            {isOwner && (
              <button
                className="bg-red-500  text-white m-2 py-1 px-2 rounded"
                onClick={() => onGroupDelete(groupID)}
              >
                Delete Group
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Taskheader;
