import React from "react";

export const Select = ({ name, value, onChange, required, children }) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="border rounded p-2 w-full"
    >
      {children}
    </select>
  );
};
