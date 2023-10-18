import { useState, useEffect } from "react";
import axios from 'axios';

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

  // State to store the actual members from the API
  const [actualMembers, setActualMembers] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/group/list_group_members/${groupID}`)
      .then(response => {
        // Check if the response status is OK (status code 200)
        if (response.status === 200) {
          setActualMembers(response.data);
        } else {
          console.error('Error: Unexpected response status', response.status);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [groupID]);
  
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
        {changeNameView && <button className="bg-purple-500  text-white ml-2 m-2 py-1 px-2 rounded" onClick={() => onGroupNameChange(groupID,newName)} >
          Edit
        </button>}
        {isOwner && <button className="bg-red-500  text-white m-2 py-1 px-2 rounded" onClick = {() => onGroupDelete(groupID)}>
          Delete Group
        </button>}
        {/* allows members changes*/}
        {isOwner && <button className="bg-yellow-500  text-white ml-2 m-2 py-1 px-2 rounded" onClick = {() => setAddDeleteMember(!addDeleteMember)}>
          Update Members
        </button>}
        {/* will help us add a new member*/}
        {addDeleteMember && <input type="text" placeholder="Add new member" onChange = {(e) => setNewMemeber(e.target.value)} value={newMember}/>}
        {addDeleteMember &&  <button className="bg-yellow-400  text-white ml-2 m-2 py-1 px-2 rounded" onClick={() => { setAdd(true); onGroupMembersChange(groupID,newMember,add);}} >
          Add Member
        </button>}
        {/* Display and allow removal of actual members */}
        {addDeleteMember && <select>
          {actualMembers
            .filter(member => member !== null) // don't display possible empty values
            .map((member, index) => (
              <option key={index} value={member}>
                {member}
              </option>
            ))}
          </select>}     
        {addDeleteMember && <button className="bg-red-500 text-white ml-2 m-2 py-1 px-2 rounded" onClick={() => {
            const selectElement = document.querySelector('select'); //find element in
            if (selectElement) {
              const selectedMember = selectElement.value;
              setAdd(false);
              onGroupMembersChange(groupID, selectedMember, add);
            }
          }}>
          Remove
        </button>}
      </div>
    </>
  );
};

export default Taskheader;
