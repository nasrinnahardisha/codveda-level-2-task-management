import axios from "axios";

const asioxInstance = axios.create({
  baseURL: "http://localhost:5000",
});

const UseAxios = () => {
  return asioxInstance;
};
export default UseAxios;
