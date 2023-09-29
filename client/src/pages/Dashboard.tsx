import Group from "../components/Group";
import GroupInput from "../components/GroupInput";
import TaskGroup from "../components/TaskGroup";

export const Dashboard = () => {
  return (
    <div className="flex h-screen bg-prismDarkPurple ">
      {/* Sidebar */}
      <aside className=" w-1/4 p-4 text-gray-100">
        <GroupInput></GroupInput>
        <Group groupName="Group1"></Group>
        <Group groupName="Group2"></Group>
        <Group groupName="Group2"></Group>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <>
          <TaskGroup></TaskGroup>
        </>
      </main>
    </div>
  );
};

export default Dashboard;
