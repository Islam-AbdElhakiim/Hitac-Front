import React from "react";

const TextError: React.FC<any> = ({ children }) => {
  return (
    <small className={`text-red-500 absolute -bottom-6 left-2 `}>
      {children}
    </small>
  );
};

export default TextError;
