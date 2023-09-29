import Social from "./Social";
import TaskHeader from "./TaskHeader";
import TaskList from "./TaskList";

const TaskGroup = () => {
  return (
    <div>
      <TaskHeader></TaskHeader>
      <TaskList groupID="Test"></TaskList>
      <Social></Social>
    </div>
  );
};

export default TaskGroup;
