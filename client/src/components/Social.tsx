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
    setNewMember("");
  };

  return (
    <div className="flex-col text-white flex bg-gray-800 border-gray-400  rounded-lg">
      <p className="text-lg font-semibold mb-2 p-2">Members:</p>
      <div className="flex flex-col">
        {users.map((user, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-gray-400 border-2 rounded-md p-2 mb-2 bg-gray-700"
          >
            <p className="text-sm flex-grow">{user}</p>
            {((isOwner && user !== username) || (!isOwner && user == username)) && (
              <button
                className="text-red-500 hover:text-red-700 focus:outline-none"
                onClick={() => handleDeleteMember(user)}
              >
                x
              </button>
            )}
          </div>
        ))}
      </div>
    
      {isOwner && (
        <div className="flex flex-col my-2 p-2 bg-gray-800 rounded-md">
          <input
            type="text"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="Add Member"
            className="bg-gray-700 text-white p-2 rounded-md mb-2 focus:outline-none text-sm"
          />
          <button
            className="bg-green-500 hover:bg-green-700 text-white p-2 rounded-md focus:outline-none"
            onClick={handleAddMember}
          >
            Add
          </button>
        </div>
      )}
    </div>
  
  );
};

export default Social;
