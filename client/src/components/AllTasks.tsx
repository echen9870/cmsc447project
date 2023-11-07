import { useEffect, useState } from "react";
import Axios from "axios";
import "./AllTasks.css"; // CSS file

interface Props {
  username: string;
}

interface Task {
  _id: string;
  name: string;
  description: string;
  assignedUsers: string[];
  completed: boolean;
  dueAt: string; // Use dueAt as the timestamp
}

const AllTasks = ({ username }: Props) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const apiEndpoint = `http://localhost:3000/task/get_all_tasks/${username}`;

    Axios.get(apiEndpoint)
      .then((response) => {
        if (response.data) {
          // Sort tasks by dueAt date in ascending order (sooner due dates first)
          const sortedTasks = response.data.sort(
            (a: Task, b: Task) =>
              new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
          );

          setTasks(sortedTasks);
        }
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, [username]);

  // Categorize tasks into "Due Today," "Due This Week," and "Upcoming"
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const oneWeekFromToday = new Date(today);
  oneWeekFromToday.setDate(today.getDate() + 7);

  const overdueTasks = tasks.filter(
    (task) => new Date(task.dueAt) <= yesterday && task.completed == false
  );

  const dueTodayTasks = tasks.filter(
    (task) => new Date(task.dueAt) > yesterday && new Date(task.dueAt) <= today
  );

  const dueThisWeekTasks = tasks.filter(
    (task) =>
      new Date(task.dueAt) > today && new Date(task.dueAt) <= oneWeekFromToday
  );

  const everythingElseTasks = tasks.filter(
    (task) => new Date(task.dueAt) > oneWeekFromToday
  );

  return (
    <div className="all-tasks-container">
      <h1 className="page-title">{username}'s Tasks Stream</h1>
      <div className="scrollable-container">
        <div className="tasks-list">
        <div className="category-section">
            <h2>Overdue</h2>
            {overdueTasks.map((task) => (
              <div key={task._id} className="task-card">
                <h2 className="task-name">{task.name}</h2>
                <p className="task-description">{task.description}</p>
                <p className="task-assigned-users">
                  Assigned Users: {task.assignedUsers.join(", ")}
                </p>
                <p className={`task-status ${task.completed ? "done" : "undone"}`}>
                  {task.completed ? "Done" : "Undone"}
                </p>
                <p className="task-due-date">Due Date: {task.dueAt}</p>
              </div>
            ))}
          </div>

          <div className="category-section">
            <h2>Due Today</h2>
            {dueTodayTasks.map((task) => (
              <div key={task._id} className="task-card">
                <h2 className="task-name">{task.name}</h2>
                <p className="task-description">{task.description}</p>
                <p className="task-assigned-users">
                  Assigned Users: {task.assignedUsers.join(", ")}
                </p>
                <p className={`task-status ${task.completed ? "done" : "undone"}`}>
                  {task.completed ? "Done" : "Undone"}
                </p>
                <p className="task-due-date">Due Date: {task.dueAt}</p>
              </div>
            ))}
          </div>

          <div className="category-section">
            <h2>Due This Week</h2>
            {dueThisWeekTasks.map((task) => (
              <div key={task._id} className="task-card">
                <h2 className="task-name">{task.name}</h2>
                <p className="task-description">{task.description}</p>
                <p className="task-assigned-users">
                  Assigned Users: {task.assignedUsers.join(", ")}
                </p>
                <p className={`task-status ${task.completed ? "done" : "undone"}`}>
                  {task.completed ? "Done" : "Undone"}
                </p>
                <p className="task-due-date">Due Date: {task.dueAt}</p>
              </div>
            ))}
          </div>

          <div className="category-section">
            <h2>Upcoming</h2>
            {everythingElseTasks.map((task) => (
              <div key={task._id} className="task-card">
                <h2 className="task-name">{task.name}</h2>
                <p className="task-description">{task.description}</p>
                <p className="task-assigned-users">
                  Assigned Users: {task.assignedUsers.join(", ")}
                </p>
                <p className={`task-status ${task.completed ? "done" : "undone"}`}>
                  {task.completed ? "Done" : "Undone"}
                </p>
                <p className="task-due-date">Due Date: {task.dueAt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTasks;

