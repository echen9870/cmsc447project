import Navbar from "./Navbar";
import Taskgroup from "./Taskgroup";
const Dashboard = () => {
  return (
    <>
      <div className="flex">
        <Navbar></Navbar>
        <Taskgroup></Taskgroup>
      </div>
    </>
  );
};

export default Dashboard;
