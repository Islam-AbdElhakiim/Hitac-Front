import { Alert } from "@mui/material";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  // const session = await getSession();
  // if (session) {
  //   config.headers.Authorization = `Bearer ${session.user.token}`;
  // }
  return config;
});

axiosInstance.interceptors.response.use(
  function (response) {
    // console.log(response);

    // if (response.data.message && response.config.method !== 'get') {
    //   toast.success(response.data.message);
    // }
    return response;
  },
  function (error) {
    if (error.response?.status === 404) {
      console.log(error.response.data.message);
      // <Alert variant="filled" severity="error">
      //   This is an error alert — check it out!
      // </Alert>;
    }
    return Promise.reject(error.response);
  }
);

export default axiosInstance;
