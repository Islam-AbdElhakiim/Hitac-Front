import React, { ReactNode } from "react";
import { Field, ErrorMessage } from "formik";
import SelectField from "./SelectField";
import TextError from "./TextError";
import { StylesConfig } from "react-select";

interface SelectInput<OptionType> {
  label?: React.ReactNode;
  name: string;
  isMulti?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  options: OptionType[];
  className?: string;
  required?: boolean;
  tooltip?: boolean;
  tooltipContent?: string;
  onChange?: (e: OptionType) => void;
  formatOptionLabel?: (item: OptionType) => JSX.Element;
}

export const SelectInput = <OptionType,>({
  label,
  name,
  isLoading,
  className,
  options,
  required,
  tooltip,
  tooltipContent,
  ...rest
}: SelectInput<OptionType>) => {
  const styles: StylesConfig = {
    control: (baseStyles) => ({
      ...baseStyles,
      boxShadow:
        "0 0 #0000,  0 0 #0000 , 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      paddingLeft: " 0.5rem",
      paddingRight: "0.5rem",
      borderColor: " rgb(217 217 243 / 1)",
      borderWidth: "1px",
      borderRadius: "0.375rem",
      width: "100%",
      height: "3rem",
    }),
  };
  return (
    <>
      {isLoading ? (
        <input
          value={`Loading...`}
          disabled
          className={`w-full rounded-md border border-lightGray shadow-md  px-2 `}
        />
      ) : (
        <Field
          component={SelectField}
          options={options}
          id={name}
          name={name}
          {...rest}
          styles={styles}
        />
      )}
      <ErrorMessage name={name} component={TextError} />
    </>
  );
};
