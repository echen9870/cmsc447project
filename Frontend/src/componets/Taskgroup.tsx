import Social from "./Social";
import Taskheader from "./Taskheader";
import Tasklist from "./Tasklist";

const Taskgroup = () => {
  return (
    <div className="mx-10 my-5 h-4/5 w-2/3 fixed left-60 ">
      <Taskheader></Taskheader>
      <Tasklist></Tasklist>
      <Social></Social>
    </div>
  );
};

export default Taskgroup;
