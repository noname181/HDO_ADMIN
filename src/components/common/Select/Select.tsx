import React, { useState, useEffect, useRef } from 'react';
import { LabelWrap } from 'components/common/Form/Form';
import {
  SelectItem,
  SelectItems,
  SelectLabel,
  SelectWrapper,
  StyledSelect,
} from './Select.styled';
import { type SelectProps } from 'interfaces/common/ISelect';

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  isVertical = false,
  isRequired = false,
  requiredMark = true,
  w100 = false,
  onChange,
  loading = false,
  placeholder,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | number>(
    options && options.length > 0 ? options[0].value : '',
  );
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    setIsDropdownActive(false);
    const selectedOption = options?.find(
      (option) => option.value === selectedValue,
    );
    if (selectedOption && onChange) {
      onChange(selectedOption);
    }
  };

  useEffect(() => {
    setSelectedOption(options && options.length > 0 ? options[0].value : '');
  }, [options]);

  const toggleDropdown = () => {
    setIsDropdownActive(!isDropdownActive);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsDropdownActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <LabelWrap
        label={''}
        isVertical={isVertical}
        isRequired={isRequired}
        requiredMark={requiredMark}
      >
        <SelectWrapper w100={w100}>
          <SelectLabel>loading</SelectLabel>
        </SelectWrapper>
      </LabelWrap>
    );
  }

  if (!options) {
    return (
      <LabelWrap
        label={''}
        isVertical={isVertical}
        isRequired={isRequired}
        requiredMark={requiredMark}
      >
        <SelectWrapper w100={w100}>
          <SelectLabel> </SelectLabel>
        </SelectWrapper>
      </LabelWrap>
    );
  }

  const renderSelectOptions = options?.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ));

  const selectedLabel = options?.find(
    (option) => option.value === selectedOption,
  )?.label;

  const renderSelectItems = options?.map((option) => (
    <SelectItem
      key={option.value}
      active={selectedOption === option.value}
      onClick={() => {
        setSelectedOption(option.value);
        setIsDropdownActive(false);
        if (onChange) {
          onChange(option);
        }
      }}
    >
      {option.label}
    </SelectItem>
  ));

  return (
    <>
      {label && (
        <LabelWrap
          label={label}
          isVertical={isVertical}
          isRequired={isRequired}
          requiredMark={requiredMark}
        >
          <SelectWrapper w100={w100} ref={selectRef}>
            <StyledSelect
              value={selectedOption}
              onChange={handleSelect}
              placeholder={placeholder}
            >
              {renderSelectOptions}
            </StyledSelect>
            <SelectLabel active={isDropdownActive} onClick={toggleDropdown}>
              {selectedLabel}
            </SelectLabel>
            <SelectItems active={isDropdownActive}>
              {renderSelectItems}
            </SelectItems>
          </SelectWrapper>
        </LabelWrap>
      )}
      {!label && (
        <SelectWrapper w100={w100} ref={selectRef}>
          <StyledSelect
            value={selectedOption}
            onChange={handleSelect}
            placeholder={placeholder}
          >
            {renderSelectOptions}
          </StyledSelect>
          <SelectLabel active={isDropdownActive} onClick={toggleDropdown}>
            {selectedLabel}
          </SelectLabel>
          <SelectItems active={isDropdownActive}>
            {renderSelectItems}
          </SelectItems>
        </SelectWrapper>
      )}
    </>
  );
};
