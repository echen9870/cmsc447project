import TaskHeader from "./TaskHeader";
import Group from "./Group";
import { useEffect, useState } from "react";
import Axios from "axios";
import Task from "./Task";

interface Props {
  username: string;
}

interface Group {
  _id: string;
  name: string;
  members: [];
}

interface Task {
  _id: string;
  groupId: string;
  name: string;
  description: string;
  assignedUsers: [];
  completed: boolean;
  createdAt: string;
  dueAt: string;
}

const TaskGroup = ({ username }: Props) => {
  const [listOfGroup, setListOfGroup] = useState<Group[]>([]);
  const [currentGroupInfo, setCurrentGroupInfo] = useState({
    groupID: "",
    isOwner: false,
    tasks: [],
  });

  const formData = {
    name: "Group",
    members: [],
    usernameList: [username],
  };

  const newTask = {
    groupId: currentGroupInfo.groupID,
    name: "Task",
    description: "",
    assignedUsers: [],
    completed: false,
    createdAt: new Date().toLocaleDateString,
    dueAt: "",
  };

  //State change function for currentGroupInfo
  const onGroupChange = async (groupID: string) => {
    try {
      const taskResponse = await Axios.get(
        `http://localhost:3000/task/get_task_group/${groupID}`
      );
      const tasks = taskResponse.data;
      const response = await Axios.get(
        `http://localhost:3000/group/check_owner/${username}/${groupID}`
      );
      setCurrentGroupInfo({
        groupID,
        isOwner: response.data.message === "User is owner",
        tasks: tasks,
      });
    } catch (error) {
      console.error("Error fetching group ownership info:", error);
    }
  };

  //Gets the list of groups the user is part of
  const getListOfGroupIDs = async () => {
    try {
      const response = await Axios.get(
        `http://localhost:3000/group/get_groups/${username}`
      );
      setListOfGroup(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getListOfGroupIDs();
  }, []);

  //Creating a new group
  const handleGroupAdd = async () => {
    const { name, members, usernameList } = formData;
    try {
      const response = await Axios.post(
        "http://localhost:3000/group/create_group",
        {
          name,
          members,
          usernameList,
        }
      );
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
    getListOfGroupIDs();
  };

  //Deleting a group
  const handleGroupDelete = async (groupID: string) => {
    try {
      const response = await Axios.delete(
        `http://localhost:3000/group/delete_group/${groupID}`
      );
      console.log(response);
      await getListOfGroupIDs();
      setCurrentGroupInfo({ groupID: "", isOwner: false, tasks: [] });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //Changing the group name
  const handleGroupNameChange = async (
    groupID: string,
    groupNewName: string
  ) => {
    try {
      const response = await Axios.put(
        `http://localhost:3000/group/edit_group_name/${groupID}/${groupNewName}`
      );
      console.log(response);
      await getListOfGroupIDs();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //Refresh tasks a task used when we need to create/delete/edit tasks
  const handleRefreshTask = async () => {
    try {
      const taskResponse = await Axios.get(
        `http://localhost:3000/task/get_task_group/${currentGroupInfo.groupID}`
      );
      const tasks = taskResponse.data;
      setCurrentGroupInfo((prevGroupInfo) => ({
        ...prevGroupInfo,
        tasks: tasks,
      }));
      console.log(taskResponse);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //Creating a new task
  const handleOnTaskAdd = async () => {
    try {
      const response = await Axios.post(
        `http://localhost:3000/task/create_task`,
        newTask
      );
      await handleRefreshTask();
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Add/Delete a new member to the group
  const handleAddDeleteMember = async (
    groupID: string,
    updateMember: string, 
    addMember: boolean
    ) => {
    
    try {
      // Determine whether to add or delete a member based on the value of addMember
      const action = addMember ? "addUser" : "deleteUser";
      const response = await Axios.put(`http://localhost:3000/group/groups/${groupID}/users/${updateMember}`, {
        action  // Use computed property name to set addUser or deleteUser based on action
      });

      console.log(response);
      // need to re-render somehow - await onGroupChange(groupID);
    } catch(error) {
      console.error("Error", error)
    }
  };
  

  return (
    <div className="flex">
      {/*Sidebar*/}
      <aside className="w-1/5 p-2 pr-7 pb-40 text-white h-screen  overflow-y-scroll">
        <button
          className=" w-full border-solid border-2 rounded-md bg-prismGroupInput border-gray-500 p-4 m-2"
          onClick={handleGroupAdd}
        >
          New Group
        </button>
        {listOfGroup.map((group) => (
          <button
            className=" w-full block border-solid border-2 rounded-md border-gray-500 p-2 m-2"
            key={group._id}
            onClick={() => onGroupChange(group._id)}
          >
            {group.name}
          </button>
        ))}
      </aside>

      <main className="flex-1 p-4 hover:overflow-y-scroll">
        {currentGroupInfo.groupID && (
          <TaskHeader
            groupID={currentGroupInfo.groupID}
            isOwner={currentGroupInfo.isOwner}
            onGroupNameChange={handleGroupNameChange}
            onGroupMembersChange={handleAddDeleteMember}
            onGroupDelete={() => handleGroupDelete(currentGroupInfo.groupID)}
            onTaskAdd={() => handleOnTaskAdd()}
          ></TaskHeader>
        )}
        {currentGroupInfo.tasks &&
          currentGroupInfo.tasks &&
          (currentGroupInfo.tasks as Task[]).map((task) => (
            <Task key = {task._id} {...task} onTaskRefresh={handleRefreshTask}></Task>
          ))}
      </main>
    </div>
  );
};

export default TaskGroup;
