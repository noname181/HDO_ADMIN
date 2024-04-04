import { Select } from 'antd';
import { LabelWrap } from 'components/common/Form/Form';
import {
  StyledFormItem,
  StyledSelect,
  StyledSelectDB,
  StyledFormItemDB,
} from 'components/common/test/Styled.ant';
import { useGetListWt, useGetListWtTrigger } from 'hooks/useGetListWt';
import { type fileInterface } from 'interfaces/ICommon';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

interface FileSelectListProps {
  value?: any;
  placeholder?: number | string;
  onChange?: (value: any) => void;
  form?: boolean;
  disabled?: boolean;
  location?: any;
}

export const FileSelectList = ({
  value,
  placeholder,
  onChange,
  form = false,
  disabled = false,
  location,
}: FileSelectListProps) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  const { loading, error, data } = useGetListWt<fileInterface>({
    location: location,
    url: '/file-to-update?division=TM',
  });

  useEffect(() => {
    if (error !== null) {
      console.log(error);
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: 'API 호출 에러',
        content: 'API 호출 에러',
      });
    }
  }, [error]);

  return form ? (
    <StyledSelect
      loading={loading}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      {data?.map((item) => (
        <Select.Option key={item.version} value={item.version}>
          {item.version}
        </Select.Option>
      ))}
    </StyledSelect>
  ) : (
    <StyledSelect
      loading={loading}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      defaultValue=""
      disabled={disabled}
    >
      <Select.Option value="">전체</Select.Option>
      {data?.map((item) => (
        <Select.Option key={item.version} value={item.version}>
          {item.version}
        </Select.Option>
      ))}
    </StyledSelect>
  );
};

export const ChargerListSelectList = ({
  value,
  placeholder,
  onChange,
  form = false,
  disabled = false,
  location,
}: FileSelectListProps) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  const { loading, error, data } = useGetListWt<fileInterface>({
    location: location,
    url: '/charger-ocpp-log-select?division=TM',
  });

  useEffect(() => {
    if (error !== null) {
      console.log(error);
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: 'API 호출 에러',
        content: 'API 호출 에러',
      });
    }
  }, [error]);

  return form ? (
    <StyledSelect
      loading={loading}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      {data?.map((item) => (
        <Select.Option key={item.version} value={item.version}>
          {item.version}
        </Select.Option>
      ))}
    </StyledSelect>
  ) : (
    <StyledSelect
      loading={loading}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      defaultValue=""
      disabled={disabled}
    >
      <Select.Option value="">전체</Select.Option>
      {data?.map((item) => (
        <Select.Option key={item.version} value={item.version}>
          {item.version}
        </Select.Option>
      ))}
    </StyledSelect>
  );
};
