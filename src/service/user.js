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

function getCurrentUser() {
  try {
    const creds = decodeJwt(auth.getJwt());
    const [email, username] = creds.split(" ");
    return { email, username };
  } catch (ex) {
    return null;
  }
}

export default {
  registerUser,
  getCurrentUser
};
