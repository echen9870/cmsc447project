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
    setTasks([]);
  };

  const deleteTasks: (taskNumber: number) => void = () => {};

  return (
    <>

    </>
  );
};

export default Tasklist;
