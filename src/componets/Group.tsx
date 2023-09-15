import React from "react";

interface Props {
  groupName: string;
}

const Group = ({ groupName }: Props) => {
  return (
    <div className="border-solid border-2 rounded-md border-gray-500 p-2 m-2">
      <p>{groupName}</p>
    </div>
  );
};

export default Group;
