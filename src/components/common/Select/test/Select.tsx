import Select from 'react-select';

import { LabelWrapTest } from 'components/common/Form/FormTest';
import { selectStyles } from './style';

const options = {
  area: [
    { defaultValue: 'all', label: '전체' },
    { value: 'center', label: '중부' },
    { value: 'south', label: '남부' },
  ],
  branch: [
    { value: 'all', label: '전체' },
    { value: 'v1', label: '경기' },
    { value: 'v2', label: '대구' },
    { value: 'v3', label: '서울' },
    { value: 'v4', label: '부산' },
    { value: 'v4', label: '등등' },
  ],
  role: [
    { value: 'all', label: '전체' },
    { value: 'v1', label: '임원' },
    { value: 'v2', label: '관리자' },
    { value: 'v3', label: '마케팅' },
    { value: 'v4', label: '시스템 운영' },
    { value: 'v4', label: 'CS' },
  ],
};

const Area = () => (
  <LabelWrapTest label="부문">
    <Select
      placeholder="전체"
      options={options.area}
      isSearchable
      noOptionsMessage={() => 'Not found...'}
      styles={selectStyles}
    />
  </LabelWrapTest>
);

const Branch = () => (
  <LabelWrapTest label="지사">
    <Select
      placeholder="전체"
      options={options.branch}
      isSearchable
      noOptionsMessage={() => 'Not found...'}
      styles={selectStyles}
    />
  </LabelWrapTest>
);

const Role = () => (
  <LabelWrapTest label="권한">
    <Select
      placeholder="전체"
      options={options.role}
      isSearchable
      noOptionsMessage={() => 'Not found...'}
      styles={selectStyles}
    />
  </LabelWrapTest>
);

export { Area, Branch, Role };
