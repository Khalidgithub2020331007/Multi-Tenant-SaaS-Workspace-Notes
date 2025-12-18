const LeftSide = () => {
  return (
    <nav className="space-y-4">
      <button className="w-full text-left p-2 rounded hover:bg-blue-200 transition">
        Dashboard Home
      </button>
      <button className="w-full text-left p-2 rounded hover:bg-blue-200 transition">
        Workspaces
      </button>
      <button className="w-full text-left p-2 rounded hover:bg-blue-200 transition">
        Notes
      </button>
      <button className="w-full text-left p-2 rounded hover:bg-blue-200 transition">
        Settings
      </button>
    </nav>
  );
};

export default LeftSide;
