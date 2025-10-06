const Navbar = () => {
  return (
    <header className="bg-white shadow-sm flex justify-between items-center p-4">
      <h2 className="text-lg font-semibold text-gray-700">Admin Panel</h2>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Hello, Asandile 👋</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </header>
  );
};

export default Navbar;
