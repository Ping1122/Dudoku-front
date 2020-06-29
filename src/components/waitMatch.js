import React from "react";
import Searching from "../searching.gif";
import Timer from "./timer";

const WaitMatch = () => {
  return (
    <div className="wait-match">
      <img src={Searching} alt="searching" />
      <h1>Searching For Opponent</h1>
      <Timer startTime={0} />
      <button className="login-button cancel-button">Cancel</button>
    </div>
  );
};

export default WaitMatch;
