import axios from "axios";
import { toast } from "react-toastify";
import logger from "./log";

axios.interceptors.response.use(null, error => {
  console.log("inside intercepter");
  console.log(error.response);
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!expectedError) {
    logger.log(error);
    toast.error("Server side error occured");
  }
  return Promise.reject(error);
});

function setJwt(jwt) {
  console.log(jwt);
  axios.defaults.headers.common["x-auth-token"] = jwt;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt
};
