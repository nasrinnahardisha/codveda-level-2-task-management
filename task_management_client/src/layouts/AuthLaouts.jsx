import { Link, Outlet } from "react-router";
import { Leaf, Sparkles } from "lucide-react";
import ScrollToTop from "../Components/ScrollToTop";
import { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext";

const AuthLayouts = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <ScrollToTop />
      <div className="p-12 bg-base-200">
        <Link to="/">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>

            <div className="flex flex-col">
              {/* Link add me added wrapper */}
              <a
                href="/"
                className="flex items-center gap-2 group cursor-pointer focus:outline-none"
              >
                <h1 className="text-xl sm:text-3xl font-bold text-black tracking-wide leading-tight group-hover:text-indigo-200 transition-colors">
                  TaskFlow
                </h1>
                <Sparkles className="h-4 w-4 text-amber-400 hidden sm:inline-block animate-pulse group-hover:scale-110 transition-transform" />
              </a>
              <p className="text-xs sm:text-sm  font-medium truncate max-w-[160px] sm:max-w-none">
                Welcome back,{" "}
                <span className=" font-semibold">
                  {user?.displayName?.split(" ")[0] || "User"}
                </span>
              </p>
            </div>
          </div>
        </Link>
        <div className="">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default AuthLayouts;
