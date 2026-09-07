import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { ArrowLeft } from "lucide-react";
import UseAuth from "../../../../Hooks/UseAuth";
import UseAxios from "../../../../Hooks/UseAxios";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser, updateUserProfile } = UseAuth();
  const navigate = useNavigate();
  const axiosInstance = UseAxios();

  const onSubmit = (data) => {
    createUser(data.email, data.password)
      .then(async () => {
        await updateUserProfile({
          displayName: `${data.name}`,
          photoURL: "",
        });

        const userInfo = {
          email: data.email,
          name: `${data.name}`,
          role: "user",
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };

        await axiosInstance.post("/users", userInfo);

        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          showConfirmButton: false,
          timer: 1500,
        });

        navigate("/");
      })
      .catch((error) => {
        Swal.fire({ icon: "error", title: "Error", text: error.message });
      });
  };

  return (
    <div className="bg-white w-full mx-auto max-w-md p-8 rounded-2xl shadow-xl border border-gray-100">
      <Link
        to="/login"
        className="flex items-center text-sm text-muted-foreground mb-6 cursor-pointer hover:text-primary gap-2"
      >
        <ArrowLeft /> Back to sign in
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-8 font-playfair">
        Create your account
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name fields row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
              placeholder="First Name"
            />
            {errors.name && (
              <p className="text-destructive text-xs mt-1">Required</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              {...register("lastName", { required: true })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
              placeholder="Last Name"
            />
            {errors.lastName && (
              <p className="text-destructive text-xs mt-1">Required</p>
            )}
          </div>
        </div>

        {/* Email field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-destructive text-xs mt-1">Email is required</p>
          )}
        </div>

        {/* Password field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            {...register("password", { required: true, minLength: 6 })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
            placeholder="Min. 8 characters"
          />
          {errors.password && (
            <p className="text-destructive text-xs mt-1">
              Min 6 characters required
            </p>
          )}
        </div>

        <button className="w-full bg-[#111827] text-white py-3 rounded-lg font-semibold mt-4 hover:bg-black transition duration-300">
          Create account
        </button>
      </form>
    </div>
  );
};

export default Register;
