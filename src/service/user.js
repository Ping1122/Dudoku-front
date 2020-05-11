import http from "./http";
import auth from "./auth";
import { apiUrl } from "../config.json";
import { decodeJwt } from "../util/decodeJwt";

const apiEndpoint = apiUrl + "/api";

async function getCurrentUser() {
  try {
    const email = decodeJwt(auth.getJwt());
    const currentUser = await http.get(`${apiEndpoint}/me`, {
      username: email
    });
    console.log(currentUser);
    return currentUser;
  } catch (ex) {
    return null;
  }
}

export default {
  getCurrentUser
};
