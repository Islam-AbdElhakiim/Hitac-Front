import { Tooltip } from "@mui/material";
import { FieldProps } from "formik";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Select, {
  MultiValueGenericProps,
  OptionProps,
  Options,
  SingleValueProps,
  StylesConfig,
  components,
} from "react-select";
interface Option {
  value: string | number | boolean;
  label: string | number;
}

interface SelectFieldProps {
  options: Option[];
  isMulti?: boolean;
  isValid?: boolean;
  isLink?: boolean;
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
  isLink,
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
      control: (baseStyles: any) => ({
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
          '&:hover': {
            borderColor: 'transparent',
          },
        }),
      }),
      multiValue: (base: any) => (
        isLink?{
        ...base,
        background: "transparent",
        color:  'rgb(15 139 253 / 1)',
      }:base),
      multiValueLabel: (base: any) => (isLink?{
        ...base,
        backgroundColor: "transparent",
        color: 'rgb(15 139 253 / 1)',
      }:base),
      singleValue: (base: any) => (
        isLink?{
        ...base,
        background: "transparent",
        color:  'rgb(15 139 253 / 1)',

      }:base),
      valueContainer: (base: any) => (
        isLink?{
        ...base,
        display: 'block',
        marginTop:' 9px'
      }:base),
      singleValueLabel: (base: any) => (isLink?{
        ...base,
        backgroundColor: "transparent",
        color: 'rgb(15 139 253 / 1)',
      }:base),
      indicatorsContainer: (provided:any) => (isDisabled?{ ...provided, display: 'none' }:provided),
      multiValueRemove: (provided:any) => (isDisabled?{ ...provided, display: 'none' }:provided),
    };
  };

  const MultiValueContainer = (props: MultiValueGenericProps) => {
    console.log(props);
    
    return (
      <Link href={"/contacts/"+props.data.value}>
        <components.MultiValueContainer {...props} />
      </Link>
    );
  };
  const SingleValue = ({
    children,
    data ,
    ...props
  } :any) => (
    <Link href={"/accounts/"+data.value}>

      <components.SingleValue data={data}{...props}>{children}</components.SingleValue>
    </Link>
  );
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
      components={isLink ? isMulti ? { MultiValueContainer } : { SingleValue } : {}}
      value={defaultValue(options, value)}
      onChange={(value: any) =>
        isMulti
          ? onChange(value.map((item: any) => item.value))
          : onChange(value)
      }
      isMulti={isMulti}
      closeMenuOnSelect={isMulti ? false : true}
      styles={getCustomStyles()}
      openMenuOnClick={!isDisabled}
      isSearchable={!isDisabled}

    />
  );
};

export default SelectField;
