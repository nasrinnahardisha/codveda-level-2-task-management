import axios from "axios";
import { useEffect } from "react";
import { auth } from "../Firebase/firebase.init";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
  // 🔹 ekhane amra authorization header set korbo, jekhane token thakbe
});

const UseAxiosSecure = () => {
  useEffect(() => {
    const reqInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const token = await currentUser.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
    );

    // interceptor response
    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.log(error);
        return Promise.reject(error);
      },
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, []);
  return axiosSecure;
};

export default UseAxiosSecure;
