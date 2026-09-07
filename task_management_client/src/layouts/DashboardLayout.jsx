import { useState } from "react";
import { Outlet, NavLink } from "react-router";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  ShieldAlert,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import Navbar from "../pages/Home/Shared/Navbar/Navbar";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen(!isOpen);
  const closeDrawer = () => setIsOpen(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Home Navbar */}
      <Navbar />

      <div className="flex flex-1 relative">
        {/* Desktop Sidebar (Left side) */}
        <aside className="hidden md:flex w-64 bg-slate-900/80 border-r border-indigo-500/20 flex-col justify-between p-4 backdrop-blur-xl shrink-0">
          <div>
            <p className="text-[11px] uppercase text-slate-400 font-bold mb-3 px-3 tracking-wider">
              Menu
            </p>
            <nav className="space-y-1.5">
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`
                }
              >
                <LayoutDashboard size={18} /> Dashboard
              </NavLink>

              <NavLink
                to="/dashboard/tasks"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`
                }
              >
                <CheckSquare size={18} /> Tasks
              </NavLink>

              <NavLink
                to="/dashboard/user-management"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`
                }
              >
                <Users size={18} /> User Management
              </NavLink>

              <NavLink
                to="/dashboard/admin-panel"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`
                }
              >
                <ShieldAlert size={18} /> Admin Panel
              </NavLink>
            </nav>
          </div>

          <div className="relative overflow-hidden bg-slate-950/80 border border-indigo-500/30 p-4 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <p className="font-bold text-sm text-white">Go Pro</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlock advanced analytics & reports
            </p>
            <button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold py-2 rounded-xl transition shadow-md shadow-indigo-600/20 active:scale-95">
              Upgrade
            </button>
          </div>
        </aside>

        {/* Backdrop for Mobile Drawer */}
        {isOpen && (
          <div
            onClick={closeDrawer}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
          />
        )}

        {/* Right Side Drawer for Mobile */}
        <aside
          className={`fixed top-0 right-0 h-full w-72 bg-slate-900 border-l border-indigo-500/20 flex flex-col justify-between p-5 backdrop-blur-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-indigo-500/20">
              <p className="text-xs uppercase text-slate-400 font-bold tracking-wider">
                Dashboard Menu
              </p>
              <button
                onClick={closeDrawer}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-2">
              <NavLink
                to="/dashboard"
                end
                onClick={closeDrawer}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`
                }
              >
                <LayoutDashboard size={18} /> Dashboard
              </NavLink>

              <NavLink
                to="/dashboard/tasks"
                onClick={closeDrawer}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`
                }
              >
                <CheckSquare size={18} /> Tasks
              </NavLink>

              <NavLink
                to="/dashboard/user-management"
                onClick={closeDrawer}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`
                }
              >
                <Users size={18} /> User Management
              </NavLink>

              <NavLink
                to="/dashboard/admin-panel"
                onClick={closeDrawer}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`
                }
              >
                <ShieldAlert size={18} /> Admin Panel
              </NavLink>
            </nav>
          </div>

          <div className="relative overflow-hidden bg-slate-950/80 border border-indigo-500/30 p-4 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <p className="font-bold text-sm text-white">Go Pro</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlock advanced analytics & reports
            </p>
            <button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold py-2 rounded-xl transition shadow-md shadow-indigo-600/20 active:scale-95">
              Upgrade
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-slate-950">
          {/* Mobile Top Header for Menu Button */}
          <div className="md:hidden flex items-center justify-between px-6 pt-4 pb-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Dashboard
            </span>
            <button
              onClick={toggleDrawer}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-indigo-500/30 rounded-xl text-slate-300 hover:text-white text-xs font-semibold shadow-md active:scale-95 transition"
            >
              <Menu size={16} className="text-indigo-400" />
              <span>Menu</span>
            </button>
          </div>

          <main className="p-6 md:p-8 flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
