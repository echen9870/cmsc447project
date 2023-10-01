import { useState } from "react";
import Group from "../components/Group";
import GroupInput from "../components/GroupInput";
import TaskGroup from "../components/TaskGroup";
import Calendar from "../components/Calendar";

interface Props {
  onLogout: () => void;
}

export const Dashboard = ({ onLogout }: Props) => {
  const [calendarView, setCalendarView] = useState(false);
  const onToggle = () => {
    setCalendarView(!calendarView);
  };

  return (
    <div className="flex flex-col h-screen bg-prismDarkPurple ">
      {/* Sidebar */}
      <div className="flex justify-end items-end outline outline-gray-400 p-4">
        <button
          onClick={onToggle}
          className="bg-blue-500 text-white px-4 py-2 rounded-md content-end"
        >
          {calendarView ? "Group" : "Calendar"}
        </button>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md content-end"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="p-2">{calendarView ? <Calendar /> : <TaskGroup />}</div>
    </div>
  );
};

export default Dashboard;
