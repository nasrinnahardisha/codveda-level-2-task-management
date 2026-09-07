import { useLocation, useNavigate } from "react-router";
import UseAuth from "../../../../Hooks/UseAuth";
import UseAxios from "../../../../Hooks/UseAxios";

const SocialLogin = () => {
  const { signInGoogle, updateUserProfile } = UseAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";
  const axiosInstance = UseAxios();

  const handleGoogleSignIn = () => {
    signInGoogle()
      .then(async (result) => {
        const user = result.user;
        console.log(user);
        // update userinfo in the database
        await updateUserProfile({
          displayName: user.displayName,
          photoURL: user.photoURL,
        });

        const userInfo = {
          email: user.email,
          role: "user",
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };
        const response = await axiosInstance.post("/users", userInfo);
        console.log(response);
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="text-center">
      {/* Google */}
      <button
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-gray-700 font-medium border border-[#E5DFD5] rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
      >
        <svg
          aria-label="Google logo"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <g>
            <path d="m0 0H512V512H0" fill="#fff"></path>
            <path
              fill="#34a853"
              d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
            ></path>
            <path
              fill="#4285f4"
              d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
            ></path>
            <path
              fill="#fbbc02"
              d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
            ></path>
            <path
              fill="#ea4335"
              d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
            ></path>
          </g>
        </svg>
        <span>Continue with Google</span>
      </button>
    </div>
  );
};

export default SocialLogin;
