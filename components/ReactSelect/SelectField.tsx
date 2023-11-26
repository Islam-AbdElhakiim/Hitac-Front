import { FieldProps } from "formik";
import React, { useEffect, useState } from "react";
import Select, { Options, StylesConfig } from "react-select";
interface Option {
  value: string | number | boolean;
  label: string | number;
}

interface SelectFieldProps {
  options: Option[];
  isMulti?: boolean;
  isValid?: boolean;
  isDisabled?: boolean;
  className?: any;
  onChange: (value: any) => void;
  value?: string[] | string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  onChange,
  options,
  value,
  className,
  isMulti,
  isValid,
  isDisabled,
}) => {
  // const styles: StylesConfig = {
  //   control: (baseStyles) => ({
  //     ...baseStyles,
  //     boxShadow:
  //       "0 0 #0000,  0 0 #0000 , 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  //     paddingLeft: " 0.5rem",
  //     paddingRight: "0.5rem",
  //     borderColor: isValid ? " rgb(217 217 243 / 1)" : "red",
  //     borderWidth: "1px",
  //     borderRadius: "0.375rem",
  //     width: "100%",
  //     height: "3rem",
  //   }),
  // };

  console.log(isValid, isMulti);
  const getCustomStyles = () => {
    // Replace the condition with your own logic
    const isOption1Selected = isValid;

    return {
      control: (baseStyles: any, { isDisabled }: any) => ({
        ...baseStyles,
        boxShadow:
          "0 0 #0000,  0 0 #0000 , 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        paddingLeft: " 0.5rem",
        paddingRight: "0.5rem",
        borderColor: isOption1Selected ? " rgb(217 217 243 / 1)" : "red",
        borderWidth: "1px",
        borderRadius: "0.375rem",
        width: "100%",
        height: "3rem",
        ...(isDisabled && {
          backgroundColor: " rgb(217 217 243 /1);",
        }),
      }),
    };
  };
  const defaultValue = (options: any, value: any) => {
    if (isMulti) {
      return options
        ? options?.filter((option: any) => value.includes(option.value))
        : [];
    } else {
      return options
        ? options?.find((option: any) => option.value === value)
        : "";
    }
  };

  return (
    <Select
      placeholder={`Select...`}
      options={options}
      value={defaultValue(options, value)}
      onChange={(value: any) =>
        isMulti
          ? onChange(value.map((item: any) => item.value))
          : onChange(value)
      }
      isMulti={isMulti}
      closeMenuOnSelect={isMulti ? false : true}
      styles={getCustomStyles()}
      isDisabled={isDisabled}
    />
  );
};

export default SelectField;
