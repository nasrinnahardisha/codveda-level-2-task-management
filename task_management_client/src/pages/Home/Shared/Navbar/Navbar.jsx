import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "../../../../Components/ui/dropdown_menu";
import {
  Bell,
  Settings,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  ShoppingBag,
  LayoutDashboard,
  Package,
  BarChart2,
  Crown,
  LogIn,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../../../../Components/ui/avatar";
import { Button } from "../../../../Components/ui/button";

// Auth Context & Hooks Integration
import { AuthContext } from "../../../../Contexts/AuthContext";
import UseRole from "../../../../Hooks/UseRole";

export default function Topbar({ onMenuClick }) {
  const { user, logOut } = useContext(AuthContext);
  const { role, roleLoading } = UseRole();
  const navigate = useNavigate();

  // Mobile Drawer Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ইউজার ইনিশিয়াল
  const initials = (user?.displayName || user?.email || "U")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (onMenuClick) onMenuClick();
  };

  return (
    <>
      {/* Unique Premium Glassmorphism Navbar (Increased Height & Distinct Color Palette) */}
      <header className="sticky top-0 z-30 h-20 w-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 backdrop-blur-xl border-b border-indigo-500/20 px-5 sm:px-8 shadow-xl transition-all duration-300">
        <div className="h-full flex items-center justify-between  mx-auto">
          {/* Left Side: Mobile Menu Button & Bigger Welcome Title */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-300 hover:text-white hover:bg-indigo-600/30 active:scale-95 transition-all border border-indigo-500/20"
              onClick={toggleMobileMenu}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-rose-400" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <div className="flex flex-col">
              {/* Link add me added wrapper */}
              <a
                href="/"
                className="flex items-center gap-2 group cursor-pointer focus:outline-none"
              >
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide leading-tight group-hover:text-indigo-200 transition-colors">
                  TaskFlow
                </h1>
                <Sparkles className="h-4 w-4 text-amber-400 hidden sm:inline-block animate-pulse group-hover:scale-110 transition-transform" />
              </a>
              <p className="text-xs sm:text-sm text-indigo-200/80 font-medium truncate max-w-[160px] sm:max-w-none">
                Welcome back,{" "}
                <span className="text-indigo-100 font-semibold">
                  {user?.displayName?.split(" ")[0] || "User"}
                </span>
              </p>
            </div>
          </div>

          {/* Right Side: Action Buttons & User Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Unique Upgrade Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/upgrade")}
              className="!hidden !md:flex items-center gap-2 text-sm font-bold text-white bg-amber-500/20 hover:bg-amber-400 hover:text-slate-950 border border-amber-400/40 px-4 h-10 rounded-xl transition-all shadow-md shadow-amber-950/20 group"
            >
              <Crown className="h-4 w-4 fill-amber-400 text-amber-400 group-hover:fill-slate-950 group-hover:text-slate-950 transition-colors" />
              <span>Upgrade Pro</span>
            </Button>

            {/* Notification Icon */}
            <button
              className="p-2.5 rounded-xl text-indigo-200 hover:text-white bg-indigo-500/10 hover:bg-indigo-600/20 active:scale-95 transition-all border border-indigo-500/20 relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-indigo-950 animate-ping" />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-indigo-950" />
            </button>

            {/* User Profile Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 pl-1 py-1 outline-none group rounded-2xl hover:bg-indigo-500/10 transition-all">
                  <Avatar className="h-11 w-11 ring-2 ring-indigo-400 overflow-hidden rounded-full">
                    {user?.photoURL || user?.photo || user?.image ? (
                      <img
                        src={user?.photoURL || user?.photo || user?.image}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // ছবি লোড না হলে বা ব্রোকেন লিঙ্ক হলে ডিফল্ট এভাটার দেখাবে
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : null}

                    {/* ছবি না থাকলে বা লোড হতে ব্যর্থ হলে টেক্সট দেখাবে */}
                    {!user?.photoURL && !user?.photo && !user?.image && (
                      <AvatarFallback className="w-full h-full bg-gradient-to-tr from-indigo-600 to-pink-500 text-white font-bold flex items-center justify-center">
                        {user?.displayName
                          ? user.displayName.slice(0, 2).toUpperCase()
                          : "NN"}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  {/* User Name & Role Info */}
                  <div className="hidden md:flex flex-col items-start text-left leading-tight pr-1">
                    <span className="text-sm font-semibold text-white truncate max-w-[130px]">
                      {user?.displayName || (user ? "User" : "Guest")}
                    </span>
                    <span className="text-xs text-indigo-300 font-medium capitalize">
                      {!roleLoading && role ? role : "User"}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-60 mt-2 rounded-2xl shadow-2xl border-indigo-500/20 bg-slate-900/95 text-slate-100 backdrop-blur-2xl p-2"
              >
                {user ? (
                  <>
                    <DropdownMenuLabel className="font-normal px-3 py-2.5">
                      <div className="flex flex-col space-y-1">
                        <p className="text-base font-bold text-black truncate leading-tight">
                          {user?.displayName || "User"}
                        </p>
                        <p className="text-xs text-black truncate">
                          {user?.email}
                        </p>
                        {!roleLoading && role === "admin" && (
                          <span className="inline-block mt-1 w-fit text-[11px] bg-indigo-500/20 text-indigo-600 border border-indigo-400/10 px-2.5 py-0.5 rounded-full font-medium">
                            অ্যাডমিন প্যানেল
                          </span>
                        )}
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="my-1.5 bg-indigo-500/20" />

                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(
                            role === "admin"
                              ? "/admin/dashboard"
                              : "/user/dashboard",
                          )
                        }
                        className="cursor-pointer text-sm rounded-xl py-2.5 font-medium hover:bg-indigo-600/20 focus:bg-indigo-600/20 text-black hover:text-black"
                      >
                        <LayoutDashboard className="mr-3 h-4 w-4 text-indigo-400" />
                        <span>
                          {role === "admin"
                            ? "Admin Dashboard"
                            : "User Dashboard"}
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    {!roleLoading && role === "admin" && (
                      <>
                        <DropdownMenuSeparator className="my-1.5 bg-indigo-500/20" />
                        <p className="px-3 py-1 text-[11px] text-indigo-400/70 font-semibold uppercase tracking-wider">
                          অ্যাডমিন অপশন
                        </p>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => navigate("/dashboard")}
                            className="cursor-pointer text-sm rounded-xl py-2 font-medium hover:bg-indigo-600/20 focus:bg-indigo-600/20 text-black hover:text-black"
                          >
                            <LayoutDashboard className="mr-3 h-4 w-4 text-indigo-400" />
                            <span>ড্যাশবোর্ড</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate("/dashboard/products")}
                            className="cursor-pointer text-sm rounded-xl py-2 font-medium hover:bg-indigo-600/20 focus:bg-indigo-600/20 text-black hover:text-black"
                          >
                            <Package className="mr-3 h-4 w-4 text-indigo-400" />
                            <span>পণ্য ব্যবস্থাপনা</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate("/dashboard/orders")}
                            className="cursor-pointer text-sm rounded-xl py-2 font-medium hover:bg-indigo-600/20 focus:bg-indigo-600/20 text-black hover:text-black"
                          >
                            <ShoppingBag className="mr-3 h-4 w-4 text-indigo-400" />
                            <span>অর্ডার ব্যবস্থাপনা</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate("/dashboard/users-management")
                            }
                            className="cursor-pointer text-sm rounded-xl py-2 font-medium hover:bg-indigo-600/20 focus:bg-indigo-600/20 text-black hover:text-black"
                          >
                            <UserIcon className="mr-3 h-4 w-4 text-indigo-400" />
                            <span>ব্যবহারকারী ব্যবস্থাপনা</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate("/dashboard/analytics")}
                            className="cursor-pointer text-sm rounded-xl py-2 font-medium hover:bg-indigo-600/20 focus:bg-indigo-600/20 text-black hover:text-black"
                          >
                            <BarChart2 className="mr-3 h-4 w-4 text-indigo-400" />
                            <span>অ্যানালিটিক্স</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate("/dashboard/settings")}
                            className="cursor-pointer text-sm rounded-xl py-2 font-medium hover:bg-indigo-600/20 focus:bg-indigo-600/20 text-black hover:text-black"
                          >
                            <Settings className="mr-3 h-4 w-4 text-indigo-400" />
                            <span>সেটিংস</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </>
                    )}

                    <DropdownMenuSeparator className="my-1.5 bg-indigo-500/20" />
                    <DropdownMenuItem
                      className="text-rose-400 focus:text-rose-300 hover:bg-rose-500/15 focus:bg-rose-500/15 cursor-pointer text-sm rounded-xl py-2.5 font-medium"
                      onClick={() => logOut()}
                    >
                      <LogOut className="mr-3 h-4 w-4 text-rose-400" />
                      <span>লগআউট করুন</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <div className="p-3 space-y-3">
                    <p className="text-xs text-indigo-200/80">
                      আপনার অ্যাকাউন্টে প্রবেশ করুন
                    </p>
                    <Button
                      onClick={() => navigate("/login")}
                      className="w-full text-xs h-9 font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl shadow-lg"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      লগইন করুন
                    </Button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Modern Slide-over Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Mobile Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border-r border-indigo-500/20 p-6 shadow-2xl flex flex-col justify-between z-50 animate-in slide-in-from-left duration-300">
            <div>
              {/* Drawer Top User Profile */}
              <div className="flex items-center justify-between pb-5 border-b border-indigo-500/20">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11 ring-2 ring-indigo-400 overflow-hidden rounded-full">
                    {user?.photoURL || user?.photo || user?.image ? (
                      <img
                        src={user?.photoURL || user?.photo || user?.image}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // ছবি লোড না হলে বা ব্রোকেন লিঙ্ক হলে ডিফল্ট এভাটার দেখাবে
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : null}

                    {/* ছবি না থাকলে বা লোড হতে ব্যর্থ হলে টেক্সট দেখাবে */}
                    {!user?.photoURL && !user?.photo && !user?.image && (
                      <AvatarFallback className="w-full h-full bg-gradient-to-tr from-indigo-600 to-pink-500 text-white font-bold flex items-center justify-center">
                        {user?.displayName
                          ? user.displayName.slice(0, 2).toUpperCase()
                          : "NN"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-white truncate max-w-[150px]">
                      {user?.displayName || "Guest User"}
                    </span>
                    <span className="text-xs text-indigo-300 truncate max-w-[150px]">
                      {user?.email || "Welcome back"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-indigo-300 hover:text-white hover:bg-indigo-500/20"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile Menu Nav Links */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => {
                    navigate("/upgrade");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-300 font-semibold text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <Crown className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span>Upgrade to Pro</span>
                  </div>
                  <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-bold">
                    PRO
                  </span>
                </button>

                <div className="pt-3 space-y-1.5">
                  <p className="px-3 text-[11px] text-indigo-300/70 font-bold uppercase tracking-wider">
                    মেনু নেভিগেশন
                  </p>

                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-indigo-100 hover:text-white hover:bg-indigo-600/20 text-sm font-medium transition-all"
                  >
                    <LayoutDashboard className="h-5 w-5 text-indigo-400" />
                    <span>ড্যাশবোর্ড</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/dashboard/orders");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-indigo-100 hover:text-white hover:bg-indigo-600/20 text-sm font-medium transition-all"
                  >
                    <ShoppingBag className="h-5 w-5 text-indigo-400" />
                    <span>আমার অর্ডার</span>
                  </button>
                  {/* 
                  <button
                    onClick={() => {
                      navigate("/dashboard/settings");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-indigo-100 hover:text-white hover:bg-indigo-600/20 text-sm font-medium transition-all"
                  >
                    <Settings className="h-5 w-5 text-indigo-400" />
                    <span>সেটিংস</span>
                  </button> */}
                </div>
              </div>
            </div>

            {/* Mobile Drawer Bottom Logout */}
            <div className="pt-4 border-t border-indigo-500/20">
              {user ? (
                <button
                  onClick={() => {
                    logOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2.5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/20 text-rose-300 hover:bg-rose-500/25 font-semibold text-sm transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  <span>লগআউট করুন</span>
                </button>
              ) : (
                <Button
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-sm h-11 font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl shadow-lg"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  লগইন করুন
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
