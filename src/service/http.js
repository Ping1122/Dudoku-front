import axios from "axios";
import logger from "./log";
import { toast } from "react-toastify";

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.reponse.status >= 400 &&
    error.response.status < 500;
  if (!expectedError) {
    logger.log(error);
    toast.error("Server side error occured");
  }
  return Promise.reject(error);
});

function setJwt(jwt) {
  console.log("setJwt called");
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
