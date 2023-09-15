import Group from "./Group";
import Groupinput from "./Groupinput";

const Navbar = () => {
  return (
    <>
      <div className="fixed space-y-2 top-0 left-0 h-full w-60 bg-prismLightPurple m-5 flex flex-col text-center text-white shadow-lg">
        <Groupinput></Groupinput>
        <Group groupName="Group 1"></Group>
        <Group groupName="Group 2"></Group>
        <Group groupName="Group 3"></Group>
        <Group groupName="Group 4"></Group>
      </div>
    </>
  );
};

export default Navbar;
