import http from "./http.js";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/login";
const tokenKey = "token";

http.setJwt(getJwt());

async function login(email, password) {
  const { data: jwt } = await http.post(apiEndpoint, {
    email,
    password
  });
  localStorage.setItem(tokenKey, jwt.token);
}

function logout() {
  localStorage.removeItem(tokenKey);
}

function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  logout,
  getJwt
};
