import http from "./http";
import auth from "./auth";
import { apiUrl } from "../config.json";
import { decodeJwt } from "../util/decodeJwt";

const apiEndpoint = apiUrl + "/api";

async function registerUser(email, username, password) {
  await http.post(`${apiEndpoint}/register`, {
    email,
    username,
    password
  });
}

async function getCurrentUser() {
  try {
    const email = decodeJwt(auth.getJwt());
    const currentUser = await http.get(`${apiEndpoint}/me`, {
      username: email
    });
    return currentUser;
  } catch (ex) {
    return null;
  }
}

export default {
  registerUser,
  getCurrentUser
};
