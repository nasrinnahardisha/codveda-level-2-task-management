import { Navigate, useLocation } from "react-router";
import { useEffect } from "react";
import UseAuth from "../Hooks/UseAuth";
import UseRole from "../Hooks/UseRole";

const PrivateRoute = ({ children }) => {
  const { user, loading } = UseAuth();
  const { role, roleLoading } = UseRole();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !roleLoading && user) {
      console.log("👤 ব্যবহারকারী ভূমিকা তথ্য:");
      console.log("📧 ইমেইল:", user.email);
      console.log("👨‍💼 ভূমিকা (Role):", role);
      console.log("📍 বর্তমান পেজ:", location.pathname);
    }
  }, [loading, roleLoading, user, role, location.pathname]);

  if (loading || roleLoading) {
    return <span className="loading loading-spinner text-success"></span>;
  }

  if (!user) {
    return (
      <Navigate state={{ from: location.pathname }} to="/login"></Navigate>
    );
  }
  return children;
};

export default PrivateRoute;
