import { SetStateAction, useEffect, useState } from "react";
import TaskGroup from "../components/TaskGroup";
import Calendar from "../components/Calendar";
import AllTasks from "../components/AllTasks";

interface Props {
  onLogout: (username: string) => void;
  username: string;
}

export const Dashboard = ({ onLogout, username }: Props) => {
  const storedView = localStorage.getItem("selectedView");
  const [selectedView, setSelectedView] = useState(storedView || "TaskGroup");

  useEffect(() => {
    localStorage.setItem("selectedView", selectedView);
  }, [selectedView]);

  const handleSelectView = (view: SetStateAction<string>) => {
    setSelectedView(view);
  };

  const handleLogout = () => {
    localStorage.removeItem("selectedView");
    onLogout("");
  };

  return (
    <div className="flex flex-col bg-prismDarkPurple h-screen">
      <div>
        <p className="absolute left-0 top-0 text-white p-4">Hello {username}</p>
        <div className="flex justify-end items-end outline outline-gray-400 p-4 text-white">
          <button
            onClick={() => handleSelectView("TaskGroup")}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md content-end ${selectedView === "TaskGroup" ? "bg-opacity-100" : "bg-opacity-50"}`}
          >
            Task Group
          </button>
          <button
            onClick={() => handleSelectView("Calendar")}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md content-end ${selectedView === "Calendar" ? "bg-opacity-100" : "bg-opacity-50"}`}
          >
            Calendar
          </button>
          <button
            onClick={() => handleSelectView("AllTasks")}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md content-end ${selectedView === "AllTasks" ? "bg-opacity-100" : "bg-opacity-50"}`}
          >
            All Tasks
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md content-end"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-2 bg-prismDarkPurple text-white flex-grow">
        {selectedView === "TaskGroup" && <TaskGroup username={username} />}
        {selectedView === "Calendar" && <Calendar />}
        {selectedView === "AllTasks" && <AllTasks username={username} />}
      </div>
    </div>
  );
};

export default Dashboard;

