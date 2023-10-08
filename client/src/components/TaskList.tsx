import { useEffect, useState } from "react";
import Task from "./Task";

interface Props {
  groupID: string;
  isOwner: boolean;
}

const Tasklist = ({ groupID,isOwner }: Props) => {
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
    <h1 className="text-white">{groupID}</h1>
    </>
  );
};

export default Tasklist;
