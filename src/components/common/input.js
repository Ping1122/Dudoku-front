import React, { useRef } from "react";
import ErrorMessage from "./errorMessage";

const Input = ({ name, label, error, ...rest }) => {
  const target = useRef(null);
  return (
    <div className="form-group">
      <label htmlFor="name">{label}</label>
      <input
        {...rest}
        name={name}
        id={name}
        ref={target}
        className="form-control"
      />
      {error && <ErrorMessage target={target} error={error} />}
    </div>
  );
};

export default Input;
