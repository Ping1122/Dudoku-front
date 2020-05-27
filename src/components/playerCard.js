import React from "react";

const PlayerCard = props => {
  const { mistakes } = props;
  return (
    <div className="player-card">
      <p>mistakes:{mistakes}</p>
    </div>
  );
};

export default PlayerCard;
