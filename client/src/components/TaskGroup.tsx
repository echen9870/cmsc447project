import Social from "./Social";
import TaskHeader from "./TaskHeader";
import TaskList from "./TaskList";
import Group from "./Group";
import GroupInput from "./GroupInput";
import { useEffect, useState } from "react";
import Axios, { AxiosResponse } from "axios";

interface Props {
  username: string;
}

interface Group {
  _id: string;
  name: string;
  members: [];
}

const TaskGroup = ({ username }: Props) => {
  const [listOfGroup, setListOfGroup] = useState<Group[]>([]);
  const [groupID, setGroupID] = useState("test");
  const formData = {
    name: "Group",
    usernameList: [username],
  };

  const getGroupIDs = async () => {
    try {
      const response = await Axios.get(
        `http://localhost:3000/group/get_groups/${username}`
      );
      setListOfGroup(response.data);
      console.log("Use effect");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getGroupIDs();
  }, []);

  const handleGroupAdd = async () => {
    const { name, usernameList } = formData;
    try {
      const response = await Axios.post(
        "http://localhost:3000/group/create_group",
        {
          name,
          usernameList,
        }
      );
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
    getGroupIDs();
  };

  const onGroupChange = () => {};

  return (
    <div className="flex">
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
          >
            {group.name}
          </button>
        ))}
      </aside>
      <main className="flex-1 p-4 hover:overflow-y-scroll">
        <TaskHeader></TaskHeader>
        <TaskList groupID={groupID}></TaskList>
        <Social></Social>
      </main>
    </div>
  );
};

export default TaskGroup;
