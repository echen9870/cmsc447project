import { useState } from "react";
import TaskGroup from "../components/TaskGroup";
import Calendar from "../components/Calendar";

interface Props {
  onLogout: (username: string) => void;
  username: string;
}

export const Dashboard = ({ onLogout, username }: Props) => {
  const [calendarView, setCalendarView] = useState(false);

  const onToggle = () => {
    setCalendarView(!calendarView);
  };

  const handleLogout = () => {
    onLogout("");
  };

  return (
    <div className=" flex flex-col bg-prismDarkPurple h-screen">
      <div className="">
        <p className="absolute left-0 top-0 text-white p-4">
          {" "}
          Hello {username}
        </p>
        <div className="flex justify-end items-end outline outline-gray-400 p-4 text-white">
          <button
            onClick={onToggle}
            className="bg-blue-500 text-white px-4 py-2 rounded-md content-end"
          >
            {calendarView ? "Group" : "Calendar"}
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
        {calendarView ? <Calendar></Calendar> : <TaskGroup username={username} />}
      </div>
    </div>
  );
};

export default Dashboard;
