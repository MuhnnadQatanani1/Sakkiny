import React from "react";

export const FormInput = ({
  type,
  value,
  placeholder,
  name,
  handleChange,
}) => {
  return (
    <input
      className="w-full p-3 rounded-[20px] border-[##dddddd] border-[1px] text-lg mt-2"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      name={name}
      required
    />
  );
};
