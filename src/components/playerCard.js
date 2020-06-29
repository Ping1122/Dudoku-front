import React from "react";
import DefaultPlayer from "../player.png";
import Mistake from "../mistake.png";
import Correct from "../correct.png";

const PlayerCard = props => {
  const { id, mistakes, filled, players } = props;
  const mistake = mistakes && mistakes[id];
  const fill = mistakes && filled[id];
  const player = mistakes && players[id];
  return (
    <div className="player-card">
      <div className={`player${id}-wrapper mx-2`}>
        <div className="row mb-2">
          <div className="col-md-6 align-center">
            <p className="player-name mb-2">{player.username}</p>
            <img
              className="player-photo"
              src={DefaultPlayer}
              alt="User Photo"
            />
          </div>
          <div className="col-md-6">
            <div className="row mt-3">
              <div className="col-md-6 ">
                <img className="filled-mistake" src={Correct} alt="Filled" />
              </div>
              <div className="col-md-6 text-left filled-mistake-value">
                <span className="filled-mistake-value">{fill}</span>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <img className="filled-mistake" src={Mistake} alt="Mistakes" />
              </div>
              <div className="col-md-6 text-left ">
                <span className="filled-mistake-value">{mistake}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
