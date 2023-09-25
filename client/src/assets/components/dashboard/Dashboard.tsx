const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="bg-blue-500 w-1/4 p-4">
        <h2 className="text-white text-xl font-semibold mb-4">Sidebar</h2>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
        {/* Add dashboard content here */}
      </main>
    </div>
  );
};

export default Dashboard;
