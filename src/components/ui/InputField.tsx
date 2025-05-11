import React from "react";
import type { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  errorMessage,
  className,
  ...rest
}) => {
  const baseStyles =
    "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm";
  const errorStyles = errorMessage
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : "";
  const combinedClassName = `${baseStyles} ${className || ""} ${errorStyles}`;

  return (
    <div>
      {label && (
        <label
          htmlFor={rest.id || rest.name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input className={combinedClassName} {...rest} />
      {errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default InputField;
