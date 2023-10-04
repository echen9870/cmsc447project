import Social from "./Social";
import TaskHeader from "./TaskHeader";
import TaskList from "./TaskList";
import Group from "./Group";
import GroupInput from "./GroupInput";
import { useState } from "react";
const TaskGroup = () => {
  const [groupID,setGroupID] = useState("test");
  const handleGroupAdd = () => {};
  const onGroupChange = () => {
    
  }
  return (
    <div className="flex">
      <aside className="w-1/5 p-4 text-gray-100 flex flex-col justify-between">
        <GroupInput></GroupInput>
        <Group groupName="Group1"></Group>
        <Group groupName="Group2"></Group>
        <Group groupName="Group2"></Group>
      </aside>
      <main className="flex-1 p-2">
        <TaskHeader></TaskHeader>
        <TaskList groupID={groupID}></TaskList>
        <Social></Social>
      </main>
    </div>
  );
};

export default TaskGroup;
