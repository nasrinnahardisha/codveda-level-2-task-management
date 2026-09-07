import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import {
  FaSearch,
  FaUsers,
  FaUserShield,
  FaUserTag,
  FaUserTimes,
  FaEnvelope,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useState } from "react";

const UserManagement = () => {
  const axiosSecure = UseAxiosSecure();
  const [searchText, setSearchText] = useState("");

  const {
    data: users = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["users", searchText],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?searchText=${searchText}`);
      if (Array.isArray(res.data)) {
        return res.data;
      }
      return res.data?.users || res.data?.result || [];
    },
  });

  const handleRoleChange = (user, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    Swal.fire({
      title: "Are you sure?",
      text: `You want to make this user ${newRole}!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/users/${user._id}/role`, { role: newRole })
          .then((res) => {
            if (res.data.modifiedCount > 0) {
              refetch();
              Swal.fire({
                title: "Updated!",
                text: `${user.displayName || user.name || "User"} is now an ${newRole}.`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              });
            }
          });
      }
    });
  };

  const safeUsersList = Array.isArray(users) ? users : [];

  return (
    <div className="w-full min-h-screen bg-[#0b0f19] text-gray-100 p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141b2d] p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-800 shadow-lg">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white flex items-center gap-2.5">
              <FaUsers className="text-blue-500 shrink-0" /> User Management
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Manage and view all registered users in your system
            </p>
          </div>

          <div className="flex items-center gap-3 bg-blue-950/40 border border-blue-800/50 rounded-xl py-2.5 px-4 self-start sm:self-center shrink-0">
            <div>
              <div className="text-[10px] sm:text-[11px] font-bold tracking-wider text-blue-400 uppercase">
                Total Users
              </div>
              <div className="text-xl sm:text-2xl font-black text-blue-300 mt-0.5">
                {safeUsersList.length}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
            <FaSearch className="text-sm" />
          </span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-[#141b2d] border border-gray-800 rounded-xl text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-500"
            placeholder="Search user by email..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Mobile View: Card Layout (sm এর নিচে দেখাবে) */}
        <div className="block sm:hidden space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-gray-400 bg-[#141b2d] rounded-xl border border-gray-800">
              Loading users...
            </div>
          ) : (
            safeUsersList.map((user, index) => {
              const userImg = user.photo || user.image || user.photoURL || null;
              const userName =
                user.displayName ||
                user.name ||
                user.email?.split("@")[0] ||
                "User";

              return (
                <div
                  key={user._id || index}
                  className="bg-[#141b2d] p-4 rounded-xl border border-gray-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-800 shrink-0 ring-1 ring-gray-700">
                        <img
                          src={
                            userImg ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              userName,
                            )}&background=2563eb&color=fff`
                          }
                          alt={userName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              userName,
                            )}&background=2563eb&color=fff`;
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-200 text-sm capitalize">
                          {userName}
                        </div>
                        <div className="text-[10px] font-mono text-gray-500">
                          ID:{" "}
                          {user._id ? user._id.slice(-6).toUpperCase() : "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Role Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                        user.role === "admin"
                          ? "bg-purple-950/60 text-purple-300 border border-purple-800/50"
                          : "bg-emerald-950/60 text-emerald-300 border border-emerald-800/50"
                      }`}
                    >
                      <FaUserTag className="text-[9px]" />
                      {user.role || "user"}
                    </span>
                  </div>

                  {/* Email Section */}
                  <div className="flex items-center gap-2 text-xs text-gray-400 pt-1 border-t border-gray-800/60">
                    <FaEnvelope className="text-gray-500 shrink-0" />
                    <span className="truncate">{user.email || "N/A"}</span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleRoleChange(user, user.role || "user")}
                    className={`w-full py-2 text-xs font-semibold rounded-lg text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                      user.role === "admin"
                        ? "bg-rose-600 hover:bg-rose-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {user.role === "admin" ? (
                      <>
                        <FaUserTimes /> Remove Admin
                      </>
                    ) : (
                      <>
                        <FaUserShield /> Make Admin
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop/Tablet View: Table Layout (sm এবং তার উপরে দেখাবে) */}
        <div className="hidden sm:block bg-[#141b2d] rounded-2xl border border-gray-800 shadow-lg overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse min-w-[650px] text-left">
              <thead className="bg-[#1f293d]/50 border-b border-gray-800">
                <tr>
                  <th className="py-4 pl-6 text-[11px] font-bold tracking-wider text-gray-400 uppercase w-12">
                    #
                  </th>
                  <th className="py-4 px-4 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                    User Profile
                  </th>
                  <th className="py-4 px-4 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                    Contact Info
                  </th>
                  <th className="py-4 px-4 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                    Account Role
                  </th>
                  <th className="py-4 pr-6 text-[11px] font-bold tracking-wider text-gray-400 uppercase text-center w-40">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-400">
                      Loading users...
                    </td>
                  </tr>
                ) : (
                  safeUsersList.map((user, index) => {
                    const userImg =
                      user.photo || user.image || user.photoURL || null;
                    const userName =
                      user.displayName ||
                      user.name ||
                      user.email?.split("@")[0] ||
                      "User";

                    return (
                      <tr
                        key={user._id || index}
                        className="hover:bg-gray-800/30 transition-colors duration-150"
                      >
                        <td className="py-4 pl-6 font-medium text-gray-400 text-sm whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center ring-1 ring-gray-700 shrink-0">
                              <img
                                src={
                                  userImg ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    userName,
                                  )}&background=2563eb&color=fff`
                                }
                                alt={userName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    userName,
                                  )}&background=2563eb&color=fff`;
                                }}
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-200 text-sm leading-tight capitalize">
                                {userName}
                              </div>
                              <div className="text-[10px] font-mono text-gray-500 mt-0.5">
                                ID:{" "}
                                {user._id
                                  ? user._id.slice(-6).toUpperCase()
                                  : "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-sm text-gray-300 font-normal">
                            {user.email || "N/A"}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                              user.role === "admin"
                                ? "bg-purple-950/60 text-purple-300 border border-purple-800/50"
                                : "bg-emerald-950/60 text-emerald-300 border border-emerald-800/50"
                            }`}
                          >
                            <FaUserTag className="text-[10px]" />
                            {user.role || "user"}
                          </span>
                        </td>
                        <td className="py-4 pr-6 text-center whitespace-nowrap">
                          <button
                            onClick={() =>
                              handleRoleChange(user, user.role || "user")
                            }
                            className={`inline-flex items-center justify-center gap-1.5 w-32 h-8 text-xs font-semibold rounded-lg text-white transition-all duration-150 active:scale-[0.98] ${
                              user.role === "admin"
                                ? "bg-rose-600 hover:bg-rose-700 shadow-sm"
                                : "bg-blue-600 hover:bg-blue-700 shadow-sm"
                            }`}
                          >
                            {user.role === "admin" ? (
                              <>
                                <FaUserTimes className="text-xs" />
                                <span>Remove Admin</span>
                              </>
                            ) : (
                              <>
                                <FaUserShield className="text-xs" />
                                <span>Make Admin</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {!isLoading && safeUsersList.length === 0 && (
          <div className="text-center py-12 sm:py-16 bg-[#141b2d] border border-gray-800 rounded-2xl shadow-lg">
            <div className="text-3xl sm:text-4xl mb-3 opacity-60">📭</div>
            <h3 className="text-sm sm:text-base font-bold text-gray-400">
              No users found
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
