interface Props {
    username: string;
}

const AllTasks = ({ username }: Props) => {
return (
    <div className="border-solid border-2 rounded-md border-gray-500 p-2 m-2">
    <p>{username}</p>
    </div>
);
};

export default AllTasks;