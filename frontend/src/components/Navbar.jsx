import { Bell, User } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="fixed top-0 right-0 left-64 bg-gradient-to-r from-white to-orange-50 shadow-lg px-8 py-4 flex justify-between items-center border-b-2 border-primary/20 z-30">
      <div>
        <h2 className="text-2xl font-bold text-primary">
          Welcome back, {user?.name}
        </h2>
        <p className="text-gray-600 text-sm">Have a great day at work</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-3 hover:bg-orange-100 rounded-xl transition-all duration-200 group">
          <Bell
            size={24}
            className="text-gray-600 group-hover:text-primary transition-colors"
          />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-danger rounded-full animate-pulse"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l-2 border-orange-200">
          <div className="w-11 h-11 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center shadow-md">
            <User size={22} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-dark">{user?.name}</p>
            <p className="text-xs text-primary font-medium uppercase">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
