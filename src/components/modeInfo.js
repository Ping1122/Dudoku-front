import React from "react";

const ModeInfo = props => {
  const { label, info } = props;
  const images = require.context("../", true);
  let img = images(`./${label}.png`);
  return (
    <div>
      <p>{info}</p>
      <img className="mode-img" src={img} alt="" />
    </div>
  );
};

export default ModeInfo;
