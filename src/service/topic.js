import auth from "./auth.js";
const SockJS = require("sockjs-client");

let Stomp = require("stompjs");
let stompEndpoint;
let stompClient;

function subscribe(path, dudokuId, origin, handlers) {
  const { handleFill, handleDelete, handleEnd } = handlers;
  try {
    const stompEndpoint = "http://localhost:8080" + path;
    const socket = new SockJS(stompEndpoint);
    stompClient = Stomp.over(socket);
    stompClient.connect({ "x-auth-token": auth.getJwt() }, frame => {
      console.log("Connected: " + frame);
      stompClient.subscribe(`/topic/fill/${dudokuId}/${origin}`, message => {
        handleFill(message);
      });
      stompClient.subscribe(`/topic/delete/${dudokuId}/${origin}`, message => {
        handleDelete(message);
      });
      stompClient.subscribe(`/topic/end/${dudokuId}/${origin}`, message => {
        handleEnd(message);
      });
    });
    stompClient.heartbeat.outgoing = 5000;
    stompClient.heartbeat.incoming = 5000;
  } catch (ex) {
    console.log(ex);
  }
}

function disconnect() {
  if (!stompClient) return;
  stompClient.disconnect(() => {
    console.log("disconnected");
  });
  stompClient = null;
}

export default {
  subscribe,
  disconnect
};
