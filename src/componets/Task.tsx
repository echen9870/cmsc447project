const Task = () => {
  return (
    <>
      <div className=" text-white flex bg-prismPurple border-gray-400 border-2 rounded-lg m-2 p-2">
        <b className="inline-flex justify-center flex-1">Task</b>
        <div className="d-flex">
          <button className="bg-blue-500 m-2 py-1 px-2 rounded">Finish</button>
          <button className="bg-prismStrongPurple m-2 py-1 px-2 rounded">
            Edit
          </button>
          <button className="bg-red-500 m-2 py-1 px-2 rounded ">Delete</button>
        </div>
      </div>
    </>
  );
};

export default Task;
