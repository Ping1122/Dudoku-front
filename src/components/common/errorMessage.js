import React from "react";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";

const ErrorMessage = ({ target, error }) => {
  return (
    <Overlay target={target.current} show={true} placement="bottom">
      {props => (
        <Tooltip id="overlay-example" {...props}>
          {error}
        </Tooltip>
      )}
    </Overlay>
  );
};

export default ErrorMessage;
