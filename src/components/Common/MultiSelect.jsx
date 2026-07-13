import React from "react";
import Select from "react-select";

export const CustomStyles = {
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#fff', // or any background you want
    zIndex: 9999,
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: 200, // ~5 items, then scroll
    overflowY: 'auto',
    backgroundColor: '#fff',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#f2f2f2' : '#fff',
    color: '#333',
  }),
};

const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  isMulti = true,
  getOptionLabel = option => option.label,
  getOptionValue = option => option.value,
}) => {
  return (
    <Select
      isMulti={isMulti}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      closeMenuOnSelect={!isMulti}
      hideSelectedOptions={isMulti}
      isClearable
      styles={CustomStyles}
    />
  );
};

export default MultiSelect; 