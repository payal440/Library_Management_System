import axios from "axios";

export const registerUser = async (data) => {
  return axios.post("http://localhost:3000/api/signup", data);
};