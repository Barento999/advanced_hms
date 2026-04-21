import { Bell, User } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-secondary">
          Welcome back, {user?.name}
        </h2>
        <p className="text-gray-500 text-sm">Have a great day at work</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <Bell size={24} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div>
            <p className="font-medium text-secondary">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
