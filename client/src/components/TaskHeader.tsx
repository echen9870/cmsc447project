import TaskInput from "./TaskInput";

interface Props {
  groupID: string;
  isOwner: boolean;
  onGroupDelete: (groupID:string) => {} ;
}

const Taskheader = ({ groupID,isOwner,onGroupDelete }: Props ) => {
  return (
    <>
      <div className="bg-prismDarkPurple content-right">
        <TaskInput></TaskInput>
        <button className="bg-blue-500 text-white m-2 py-1 px-2 rounded">
          Finish All
        </button>
        <button className="bg-prismLightPurple text-white m-2 py-1 px-2 rounded">
          Unfinish All
        </button>
        <button className="bg-red-500  text-white m-2 py-1 px-2 rounded">
          Delete All
        </button>
        {isOwner && <button className="bg-red-500  text-white m-2 py-1 px-2 rounded" onClick = {() => onGroupDelete(groupID)}>
          Delete Group
        </button>}
      </div>
    </>
  );
};

export default Taskheader;
