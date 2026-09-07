import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import loginLogo from "../../../../assets/login-logo.png";
import { Lock, Mail } from "lucide-react";
import UseAuth from "../../../../Hooks/UseAuth";
import UseAxiosSecure from "../../../../Hooks/UseAxiosSecure";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signInUser } = UseAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = UseAxiosSecure();

  const from = location?.state?.from || "/";

  const onSubmit = (data) => {
    signInUser(data.email, data.password)
      .then((result) => {
        const userInfo = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        };

        axiosSecure.post("/users", userInfo).finally(() => {
          navigate(from, { replace: true });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="bg-white font-Hind-Siliguri w-full mx-auto max-w-md p-8 rounded-2xl shadow-xl border border-gray-100">
      {/* Logo Placeholder - Image অনুয়ায়ী */}
      <div className="flex justify-center mb-6">
        <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center text-white">
          <img src={loginLogo} alt="Login Logo" />
        </div>
      </div>

      <h3 className="text-3xl font-bold text-center text-foreground  font-Hind-Siliguri">
        TaskFlow Login
      </h3>
      <p className="text-center text-muted-foreground font-Hind-Siliguri mb-8 text-sm font-semibold">
        Sign in to continue
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Social Login Button */}
        <SocialLogin />

        <div className="relative flex items-center justify-center my-4">
          <span className="absolute inset-x-0 h-px bg-gray-200"></span>
          <span className="relative bg-white px-4 text-xs text-gray-400 uppercase">
            Or
          </span>
        </div>

        {/* Email field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative flex items-center">
            {/* Message/Envelope Icon */}
            <span className="absolute left-4 text-gray-400">
              <Mail></Mail>
            </span>

            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#E5DFD5] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition placeholder:text-gray-300"
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="text-destructive text-xs mt-1">Email is required</p>
          )}
        </div>

        {/* Password field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative flex items-center">
            {/* Lock Icon */}
            <span className="absolute left-4 text-gray-400">
              <Lock size={16} />
            </span>

            {/* Input Field */}
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#E5DFD5] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition placeholder:text-gray-300"
              placeholder="••••••••"
            />
          </div>

          {errors.password && (
            <p className="text-destructive text-xs mt-1">
              Password must be 6+ characters
            </p>
          )}
        </div>

        <button className="w-full bg-[#111827] text-white py-3 rounded-lg font-semibold hover:bg-black transition duration-300">
          Sign in
        </button>

        <div className="flex items-center justify-between text-sm mt-4">
          <a className="text-muted-foreground hover:text-primary cursor-pointer transition">
            Forgot password?
          </a>
          <p className="text-muted-foreground">
            Need an account?{" "}
            <Link
              state={location.state}
              className="text-foreground font-bold hover:underline"
              to="/register"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
