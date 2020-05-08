import jwtDecode from "jwt-decode";
import http from "./http.js";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/auth";
const tokenKey = "token";

http.setJwt(getJwt());

async function login(email, password) {
  const { data: jwt } = await http.post(apiEndpoint, {
    username: email,
    password
  });
  console.log(jwt.token);
  var ca = jwt.token;
  var base64Url = ca.split(".")[1];
  var decodedValue = JSON.parse(window.atob(base64Url));
  console.log(decodedValue);
  localStorage.setItem(tokenKey, jwt.token);
}

function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  getJwt
};
