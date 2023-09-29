import { useEffect, useState } from "react";
import Task from "./Task";

interface Props {
  groupID: string;
}

const Tasklist = ({ groupID }: Props) => {
  const [tasks, setTasks] = useState<string[]>([]);

  useEffect(() => {
    fetchTasks(groupID);
  }, []);

  const fetchTasks = async (groupID: string) => {
    /*Get the list of tasks with the groupNumber*/
    const res: string[] = ["Task1", "Task2"];
    setTasks(res);
  };

  const deleteTasks: (taskNumber: number) => void = () => {};

  return (
    <>
      {tasks.map((task) => (
        <Task taskName={task}></Task>
      ))}
    </>
  );
};

export default Tasklist;
