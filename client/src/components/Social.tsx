import { useState } from "react";

interface Props {
  users: string[];
  onMemberAdd: (name: string) => {};
  onMemberDelete: (name: string) => {};
  isOwner: boolean;
  username: string;
}

const Social = ({ users, onMemberAdd, onMemberDelete, isOwner, username }: Props) => {
  const [newMember, setNewMember] = useState("");

  const handleDeleteMember = (name: string) => {
    onMemberDelete(name);
  };
  const handleAddMember = () => {
    onMemberAdd(newMember);
  };

  return (
    <div className="flex-col text-white flex bg-gray-800 border-gray-400 border-2 rounded-lg m-2 p-2">
      <p>Member(s):</p>
      <div className="flex flex-row">
      {users.map((user, index) => (
          <div
            key={index}
            className="flex border-gray-400 border-2 justify-center items-center rounded-lg w-1/3"
          >
            <p className="text-sm flex-grow">{user}</p>
            {isOwner && user !== username && (
              <button
                className="redButton ml-auto"
                onClick={() => handleDeleteMember(user)}
              >
                Remove
              </button>
            )}
          </div>
      ))}
      </div>
      {isOwner && (
        <div className="flex border-gray-400 border-2 justify-center items-center rounded-lg my-2 ">
          <input
            type="text"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="Add Member"
            className="bg-gray-800 text-center flex-grow"
          ></input>
          {
            <button className="greenButton ml-auto" onClick={handleAddMember}>
              Add
            </button>
          }
        </div>
      )}
    </div>
  );
};

export default Social;
