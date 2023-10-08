import { useState } from "react";
import TaskInput from "./TaskInput";

interface Props {
  groupID: string;
  isOwner: boolean;
  onGroupDelete: (groupID:string) => {};
  onGroupNameChange:(groupID:string,newGroupName:string)=>{};
}

const Taskheader = ({ groupID,isOwner,onGroupDelete,onGroupNameChange }: Props ) => {

  const [changeNameView,setChangeNameView] = useState(false);
  const [newName,setNewName] = useState("");

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
        {isOwner && <button className="bg-purple-500  text-white ml-2 m-2 py-1 px-2 rounded" onClick = {() => setChangeNameView(!changeNameView)}>
          Change Name
        </button>}
        {changeNameView && <input type = "text" className="" onChange = {(e) => setNewName(e.target.value)} value={newName}></input>} 
        {changeNameView && <button className="bg-green-500  text-white ml-2 m-2 py-1 px-2 rounded" onClick={() => onGroupNameChange(groupID,newName)} >
          Edit
        </button>}
        {isOwner && <button className="bg-red-500  text-white m-2 py-1 px-2 rounded" onClick = {() => onGroupDelete(groupID)}>
          Delete Group
        </button>}
      </div>
    </>
  );
};

export default Taskheader;
