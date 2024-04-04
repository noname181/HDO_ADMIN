import Select from 'react-select';

import { selectStyles } from './Select.styled';
import { LabelWrap } from '../Form/Form';
import { type ReactSelectProps } from 'interfaces/common/ISelect';

export const ReactSelect = ({
  label,
  options,
  placeholder = '선택',
  onChange,
  loading = false,
  isSearchable = false,
  isVertical = false,
  isRequired = false,
  requiredMark = true,
}: ReactSelectProps) => {
  return (
    <>
      {label ? (
        <LabelWrap
          label={label}
          isVertical={isVertical}
          isRequired={isRequired}
          requiredMark={requiredMark}
        >
          <Select
            isLoading={loading}
            placeholder={placeholder}
            options={options}
            isSearchable={isSearchable}
            noOptionsMessage={() => '선택 옵션이 존재하지 않습니다.'}
            styles={selectStyles}
            onChange={onChange}
          />
        </LabelWrap>
      ) : (
        <Select
          isLoading={loading}
          placeholder={placeholder}
          options={options}
          isSearchable={isSearchable}
          noOptionsMessage={() => '선택 옵션이 존재하지 않습니다.'}
          styles={selectStyles}
          onChange={onChange}
        />
      )}
    </>
  );
};
