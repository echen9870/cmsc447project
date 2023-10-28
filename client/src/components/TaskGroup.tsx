import TaskHeader from "./TaskHeader";
import Group from "./Group";
import { useEffect, useState } from "react";
import Axios from "axios";
import Task from "./Task";
import Social from "./Social";

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
    members: [],
  });

  const formData = {
    name: "Group",
    members: [username],
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
      //Get the tasks
      const taskResponse = await Axios.get(
        `http://localhost:3000/task/get_task_group/${groupID}`
      );
      const tasks = taskResponse.data;
      //Get the members
      const memberResponse = await Axios.get(
        `http://localhost:3000/group/get_group_members/${groupID}`
      );
      const member = memberResponse.data;
      //Check if the user is the owner
      const response = await Axios.get(
        `http://localhost:3000/group/check_owner/${username}/${groupID}`
      );

      setCurrentGroupInfo({
        groupID,
        isOwner: response.data.message === "User is owner",
        tasks: tasks,
        members: member,
      });
      console.log(currentGroupInfo);
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
    const { name, members } = formData;
    try {
      const response = await Axios.post(
        "http://localhost:3000/group/create_group",
        {
          name,
          members,
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
      setCurrentGroupInfo({
        groupID: "",
        isOwner: false,
        tasks: [],
        members: [],
      });
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
  const handleAddMember = async (username: string) => {
    try {
      const response = await Axios.put(
        `http://localhost:3000/group/add_member/${username}/${currentGroupInfo.groupID}`
      );

      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
    onGroupChange(currentGroupInfo.groupID);
  };

  const handleDeleteMember = async (username: string) => {
    try {
      const response = await Axios.put(
        `http://localhost:3000/group/remove_member/${username}/${currentGroupInfo.groupID}`
      );

      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
    onGroupChange(currentGroupInfo.groupID);
  };

  return (
    <div className="flex">
      {/*Sidebar*/}
      <aside className="w-1/6 p-2 pr-7 pb-40 text-white h-screen overflow-y-auto overflow-x-hidden">
        <button
          className=" w-full border-solid border-2 rounded-md bg-prismGroupInput border-gray-500 py-4 m-2"
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

      <main className="flex-1 p-4 h-screen flex flex-col pb-40">
      {currentGroupInfo.groupID && (
            <TaskHeader
              refreshTask={handleRefreshTask}
              groupID={currentGroupInfo.groupID}
              isOwner={currentGroupInfo.isOwner}
              onGroupNameChange={handleGroupNameChange}
              onGroupDelete={() => handleGroupDelete(currentGroupInfo.groupID)}
              onTaskAdd={() => handleOnTaskAdd()}
            ></TaskHeader>
          )}
        <div className="h-4/5 overflow-y-auto">
          
          <div>
            <h1 className="text-white">Uncompleted Tasks</h1>
            {currentGroupInfo.tasks &&
              (currentGroupInfo.tasks as Task[]).map(
                (task) =>
                  !task.completed && (
                    <Task
                      key={task._id}
                      {...task}
                      members={currentGroupInfo.members}
                      onTaskRefresh={handleRefreshTask}
                    ></Task>
                  )
              )}
          </div>
          <div className="flex-1 border-t-2 border-gray-400"></div>{" "}
          <div>
            <h1 className="text-white">Completed Tasks</h1>
            {currentGroupInfo.tasks &&
              (currentGroupInfo.tasks as Task[]).map(
                (task) =>
                  task.completed && (
                    <Task
                      key={task._id}
                      {...task}
                      members={currentGroupInfo.members}
                      onTaskRefresh={handleRefreshTask}
                    ></Task>
                  )
              )}
          </div>
        </div>
        {/* Border line */}
        <div className="border-t-2 border-gray-400"></div> {/* Border line */}
        <div className=" overflow-y-auto ">
          {currentGroupInfo.groupID && (
            <Social
              isOwner={currentGroupInfo.isOwner}
              users={currentGroupInfo.members}
              onMemberAdd={handleAddMember}
              onMemberDelete={handleDeleteMember}
            ></Social>
          )}
        </div>
      </main>
    </div>
  );
};

export default TaskGroup;
