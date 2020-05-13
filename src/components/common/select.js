import React from "react";
import ErrorMessage from "./errorMessage";

const Select = ({ name, label, options, error, ...rest }) => {
  return (
    <div className="from-grop">
      <label htmlFor={name}>{label}</label>
      <select name={name} id={name} {...rest} className="form-control">
        <option value="" />
        {options.map(option => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>
      {error && <ErrorMessage error={error} />}
    </div>
  );
};

export default Select;
