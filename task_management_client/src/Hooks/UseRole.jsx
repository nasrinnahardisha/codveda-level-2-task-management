import { useQuery } from "@tanstack/react-query";
import UseAuth from "./UseAuth";
import UseAxiosSecure from "./UseAxiosSecure";

const UseRole = () => {
  const { user, loading: authLoading } = UseAuth();
  const axiosSecure = UseAxiosSecure();

  const {
    data: role = "user",
    isLoading: roleLoading,
    refetch,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !!user?.email,
    staleTime: 0,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users/${encodeURIComponent(user.email)}/role`,
      );
      return res.data?.role || "user";
    },
  });

  return { role, roleLoading: authLoading || roleLoading, refetch };
};

export default UseRole;
