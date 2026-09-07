import { Navigate } from "react-router";
import { useEffect } from "react";
import UseAuth from "../Hooks/UseAuth";
import UseRole from "../Hooks/UseRole";

const AdminRoute = ({ children }) => {
  const { user, loading } = UseAuth();
  const { role, roleLoading } = UseRole();

  useEffect(() => {
    if (!loading && !roleLoading && user) {
      console.log("🔐 অ্যাডমিন রুট অ্যাক্সেস চেক:");
      console.log("📧 ইমেইল:", user.email);
      console.log("👨‍💼 ভূমিকা (Role):", role);
      console.log("✅ অ্যাডমিন স্ট্যাটাস:", role === "admin" ? "অনুমতিপ্রাপ্ত ✓" : "অনুমতিহীন ✗");
      
      if (role !== "admin") {
        console.warn("⚠️ এই ব্যবহারকারী অ্যাডমিন নয়। ইউজার ড্যাশবোর্ডে পুনর্নির্দেশিত হচ্ছে...");
      } else {
        console.log("✓ অ্যাডমিন অ্যাক্সেস প্রদান করা হয়েছে");
      }
    }
  }, [loading, roleLoading, user, role]);

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        লোড হচ্ছে...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/user-dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
