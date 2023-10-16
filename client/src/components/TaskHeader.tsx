import { useState } from "react";

interface Props {
  groupID: string;
  isOwner: boolean;
  onGroupDelete: (groupID:string) => {};
  onGroupNameChange:(groupID:string,newGroupName:string)=>{};
  onTaskAdd:(groupID:string) => {};
  //new
  onGroupMembersChange:(groupID:string, updateMember:string, addMember:boolean) => {};
}

const Taskheader = ({ groupID,isOwner,onGroupDelete,onGroupNameChange,onTaskAdd,onGroupMembersChange }: Props ) => {

  const [changeNameView,setChangeNameView] = useState(false);
  const [newName,setNewName] = useState("");
  //new 
  const [addDeleteMember,setAddDeleteMember] = useState(false);
  const [newMember,setNewMemeber] = useState("");
  const [add, setAdd] = useState(false);
  // Just sample data should remove later
  const existingMembers = ['Member1', 'Member2', 'Member3'];

  return (
    <>
      <div className="bg-prismDarkPurple content-right">
      <button className="bg-green-500 text-white m-2 py-1 px-2 rounded" onClick = { () => onTaskAdd(groupID)}>
          Add Task
        </button>
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
        {/* allows members changes*/}
        {isOwner && <button className="bg-yellow-500  text-white ml-2 m-2 py-1 px-2 rounded" onClick = {() => setAddDeleteMember(!addDeleteMember)}>
          Update Members
        </button>}
        {addDeleteMember && (
        <div>
          {/* will help us add a new member*/}
          <div>
            <input type="text" placeholder="Add new member" onChange = {(e) => setNewMemeber(e.target.value)} value={newMember}/>
            <button className="bg-green-500  text-white ml-2 m-2 py-1 px-2 rounded" onClick={() => { setAdd(true); onGroupMembersChange(groupID,newMember,add);}} >
              Add Member
            </button>
          </div>
          {/* will list and allow for removal of existing members*/}
          <div>
            <select>
              {existingMembers.map((member, index) => (
                <option key={index} value={member}>
                  {member}
                </option>
              ))}
            </select>
            <button className="bg-red-500  text-white ml-2 m-2 py-1 px-2 rounded" onClick={() =>  setAdd(false)}>Remove</button>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default Taskheader;
