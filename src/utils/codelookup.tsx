import { Select } from 'antd';
import { LabelWrap } from 'components/common/Form/Form';
import {
  StyledFormItem,
  StyledSelect,
  StyledSelectDB,
  StyledFormItemDB,
} from 'components/common/test/Styled.ant';
import { useGetListWt, useGetListWtTrigger } from 'hooks/useGetListWt';
import {
  type codelookupInterface,
  type OrganizationInterface,
} from 'interfaces/ICommon';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

export const CodeLookUp = () => {
  // 커넥터 타입
  const { data: connectTypeData }: UseGetListResponse<codelookupInterface> =
    useGetListWt({
      url: '/codelookup/con_type',
    });

  const ConnectorTypeList = connectTypeData?.map((item) => ({
    value: item.descVal,
    label: item.descInfo,
    ...item,
  }));

  const ConnectorTypeInfo = (value: number | string) => {
    let info = '등록되지 않은 커넥터 타입';
    connectTypeData?.forEach((item) => {
      if (typeof value === 'string') {
        if (parseInt(value) === item.descVal) {
          info = item.descInfo;
        }
      }
      if (value === item.descVal) {
        info = item.descInfo;
      }
    });
    return info;
  };

  // 제조사
  const { data: manufacturerData }: UseGetListResponse<codelookupInterface> =
    useGetListWt({
      url: '/codelookup/MANUFACT',
    });

  const ManufacturerList = manufacturerData?.map((item) => ({
    value: item.descVal,
    label: item.descInfo,
    ...item,
  }));

  const ManufacturerInfo = (value: number | string) => {
    let info = '등록되지 않은 제조사';
    manufacturerData?.forEach((item) => {
      if (typeof value === 'string') {
        if (parseInt(value) === item.descVal) {
          info = item.descInfo;
        }
      }
      if (value === item.descVal) {
        info = item.descInfo;
      }
    });
    return info;
  };

  // 충전속도
  const { data: speedTypeData }: UseGetListResponse<codelookupInterface> =
    useGetListWt({
      url: '/codelookup/speed_type',
    });

  const SpeedTypeList = speedTypeData?.map((item) => ({
    value: item.descVal,
    label: item.descInfo,
    ...item,
  }));

  const SpeedTypeInfo = (value: number | string) => {
    let info = '등록되지 않은 속도유형';
    speedTypeData?.forEach((item) => {
      if (typeof value === 'string') {
        if (parseInt(value) === item.descVal) {
          info = item.descInfo;
        }
      }
      if (value === item.descVal) {
        info = item.descInfo;
      }
    });
    return info;
  };

  // 충전기 상태
  const { data: chargerStatData }: UseGetListResponse<codelookupInterface> =
    useGetListWt({
      url: '/codelookup/charger_stat',
    });

  const ChargerStatList = chargerStatData?.map((item) => ({
    value: item.descVal,
    label: item.descInfo,
    ...item,
  }));

  const ChargerStatInfo = (value: number | string) => {
    let info = '등록되지 않은 속도유형';
    chargerStatData?.forEach((item) => {
      if (typeof value === 'string') {
        if (parseInt(value) === item.descVal) {
          info = item.descInfo;
        }
      }
      if (value === item.descVal) {
        info = item.descInfo;
      }
    });
    return info;
  };

  // 충전기 충전 속도
  const { data: chargerSpeedData }: UseGetListResponse<codelookupInterface> =
    useGetListWt({
      url: '/codelookup/charger_stat',
    });

  const ChargerSpeedList = chargerSpeedData?.map((item) => ({
    value: item.descVal,
    label: item.descInfo,
    ...item,
  }));

  const ChargerSpeedInfo = (value: number | string) => {
    let info = '등록되지 않은 속도유형';
    chargerSpeedData?.forEach((item) => {
      if (typeof value === 'string') {
        if (parseInt(value) === item.descVal) {
          info = item.descInfo;
        }
      }
      if (value === item.descVal) {
        info = item.descInfo;
      }
    });
    return info;
  };

  return {
    ConnectorTypeInfo,
    ConnectorTypeList,
    ManufacturerInfo,
    ManufacturerList,
    SpeedTypeInfo,
    SpeedTypeList,
    ChargerStatInfo,
    ChargerStatList,
    ChargerSpeedInfo,
    ChargerSpeedList,
  };
};

export const Area = () => {
  const { data }: UseGetListResponse<codelookupInterface> = useGetListWt({
    url: '/codelookup/code/area',
  });

  const AreaList = data?.map((item) => ({
    value: item.descVal,
    label: item.descInfo,
    ...item,
  }));

  const AreaInfo = (value: number | string) => {
    let info = '등록되지 않은 부문';
    data?.forEach((item) => {
      if (typeof value === 'string') {
        if (parseInt(value) === item.descVal) {
          info = item.descInfo;
        }
      }
      if (value === item.descVal) {
        info = item.descInfo;
      }
    });
    return info;
  };

  return { AreaList, AreaInfo };
};

export const Branch = () => {
  const { data }: UseGetListResponse<codelookupInterface> = useGetListWt({
    url: '/codelookup/branch',
  });

  const BranchList = data?.map((item) => ({
    value: item.descVal,
    label: item.descInfo,
    ...item,
  }));

  const BranchInfo = (value: number | string) => {
    let info = '등록되지 않은 지사';
    data?.forEach((item) => {
      if (typeof value === 'string') {
        if (parseInt(value) === item.descVal) {
          info = item.descInfo;
        }
      }
      if (value === item.descVal) {
        info = item.descInfo;
      }
    });
    return info;
  };

  return { BranchList, BranchInfo };
};

export const ConnectorType = () => {
  const { data }: UseGetListResponse<codelookupInterface> = useGetListWt({
    url: '/codelookup/con_type',
  });

  const ConnectorTypeList = data?.map((item) => ({
    value: item.descVal,
    label: item.descInfo,
    ...item,
  }));

  const ConnectorTypeInfo = (value: number | string) => {
    let info = '등록되지 않은 커넥터 타입';
    data?.forEach((item) => {
      if (typeof value === 'string') {
        if (parseInt(value) === item.descVal) {
          info = item.descInfo;
        }
      }
      if (value === item.descVal) {
        info = item.descInfo;
      }
    });
    return info;
  };

  return { ConnectorTypeList, ConnectorTypeInfo };
};

export const Manufacturer = () => {
  const { data }: UseGetListResponse<codelookupInterface> = useGetListWt({
    url: '/codelookup/MANUFACT',
  });

  const ManufacturerList = data?.map((item) => ({
    value: item.descVal,
    label: item.descInfo,
    ...item,
  }));

  const ManufacturerInfo = (value: number | string) => {
    let info = '등록되지 않은 제조사';
    data?.forEach((item) => {
      if (typeof value === 'string') {
        if (parseInt(value) === item.descVal) {
          info = item.descInfo;
        }
      }
      if (value === item.descVal) {
        info = item.descInfo;
      }
    });
    return info;
  };

  return { ManufacturerList, ManufacturerInfo };
};

export const SpeedType = () => {
  const { data }: UseGetListResponse<codelookupInterface> = useGetListWt({
    url: '/codelookup/speed_type',
  });

  const SpeedTypeList = data?.map((item) => ({
    value: item.descVal,
    label: item.descInfo,
    ...item,
  }));

  const SpeedTypeInfo = (value: number | string) => {
    let info = '등록되지 않은 속도유형';
    data?.forEach((item) => {
      if (typeof value === 'string') {
        if (parseInt(value) === item.descVal) {
          info = item.descInfo;
        }
      }
      if (value === item.descVal) {
        info = item.descInfo;
      }
    });
    return info;
  };

  return { SpeedTypeList, SpeedTypeInfo };
};

export const areaText = (area: number | string | undefined | any) => {
  // switch (area) {
  //   case 1:
  //     return '중부';
  //   case 2:
  //     return '남부';
  //   default:
  //     return '-';
  // }
  if (area === 1) {
    return '중부';
  } else if (area === 2) {
    return '남부';
  } else if (area === 0) {
    return '';
  } else {
    return area;
  }
};

export const branchText = (branch: number | string | undefined) => {
  // switch (branch) {
  //   case 101:
  //     return '서울';
  //   case 102:
  //     return '경기북부';
  //   case 103:
  //     return '경기남부';
  //   case 104:
  //     return '인천';
  //   case 105:
  //     return '강원';
  //   case 106:
  //     return '충북';
  //   case 201:
  //     return '대전';
  //   case 202:
  //     return '충남';
  //   case 203:
  //     return '부산';
  //   case 204:
  //     return '대구경북';
  //   case 205:
  //     return '경남';
  //   case 206:
  //     return '광주전남';
  //   case 207:
  //     return '전북';
  //   default:
  //     return '-';
  // }
  if (branch === 101) {
    return '서울';
  } else if (branch === 102) {
    return '경기북부';
  } else if (branch === 103) {
    return '경기남부';
  } else if (branch === 104) {
    return '인천';
  } else if (branch === 105) {
    return '강원';
  } else if (branch === 106) {
    return '충북';
  } else if (branch === 201) {
    return '대전';
  } else if (branch === 202) {
    return '충남';
  } else if (branch === 203) {
    return '부산';
  } else if (branch === 204) {
    return '대구경북';
  } else if (branch === 205) {
    return '경남';
  } else if (branch === 206) {
    return '광주전남';
  } else if (branch === 207) {
    return '전북';
  } else if (branch === 0) {
    return '';
  } else {
    return branch;
  }
};
export const connectorType = (value: string | undefined) => {
  switch (value) {
    case '1':
      return 'DC차데모';
    case '2':
      return 'AC완속';
    case '3':
      return 'DC차데모+AC3상';
    case '4':
      return 'DC콤보';
    case '5':
      return 'DC차데모+DC콤보';
    case '6':
      return 'DC차데모+AC3상+DC콤보';
    case '7':
      return 'AC3상';
    default:
      return '-';
  }
};

interface AreaSelectListProps {
  value?: any;
  placeholder?: number | string;
  onChange?: (value: any) => void;
  form?: boolean;
  disabled?: boolean;
  location?: any;
  rules?: any;
}

export const AreaSelectList = ({
  value,
  placeholder,
  onChange,
  form = false,
  disabled = false,
  location,
  rules,
}: AreaSelectListProps) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  const { loading, error, data } = useGetListWt<codelookupInterface>({
    location: location,
    // url: '/codelookup/area',
    url: '/code/branch/upper-div-code',
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
    <StyledFormItem name="area" label="부문" rules={rules}>
      <StyledSelect
        loading={loading}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {data?.map((item) => {
          return (
            <Select.Option key={item.upperDivCode} value={item.upperDivCode}>
              {item.upperDivCode}
            </Select.Option>
          );
        })}
      </StyledSelect>
    </StyledFormItem>
  ) : (
    <LabelWrap label="부문">
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
          <Select.Option key={item.upperDivCode} value={item.upperDivCode}>
            {item.upperDivCode}
          </Select.Option>
        ))}
      </StyledSelect>
    </LabelWrap>
  );
};

export const AreaSelectListDashBoard = ({
  value,
  placeholder,
  onChange,
  form = false,
  disabled = false,
}: AreaSelectListProps) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const { loading, error, data } = useGetListWt<codelookupInterface>({
    url: '/codelookup/area',
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

  return (
    <StyledFormItemDB style={{ display: 'block' }}>
      <StyledSelectDB
        loading={loading}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        defaultValue=""
        disabled={disabled}
      >
        <Select.Option value="">전체</Select.Option>
        {data?.map((item) => (
          <Select.Option key={item.descVal} value={item.descVal}>
            {item.descInfo}
          </Select.Option>
        ))}
      </StyledSelectDB>
    </StyledFormItemDB>
  );
};

interface BranchSelectListProps {
  value?: any;
  areaNo: number | string;
  placeholder?: string;
  onChange?: (value: any) => void;
  form?: boolean;
  disabled?: boolean;
  location?: any;
  rules?: any;
}

export const BranchSelectList = ({
  value,
  areaNo,
  placeholder,
  onChange,
  form = false,
  disabled = false,
  location,
  rules,
}: BranchSelectListProps) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const { loading, error, data, getData } =
    useGetListWtTrigger<codelookupInterface>();

  useEffect(() => {
    if (areaNo !== '') {
      void getData({ location: location, url: `/codelookup/area/${areaNo}` });
    }
  }, [areaNo]);

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
    <StyledFormItem name="branch" label="지사" rules={rules}>
      <StyledSelect
        loading={loading}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
      >
        {data?.map((item) => (
          <Select.Option key={item.descVal} value={item.descVal}>
            {item.descInfo}
          </Select.Option>
        ))}
      </StyledSelect>
    </StyledFormItem>
  ) : (
    <LabelWrap label="지사">
      <StyledSelect
        loading={loading}
        onChange={onChange}
        value={value}
        defaultValue=""
        placeholder={placeholder}
        disabled={areaNo === ''}
      >
        <Select.Option value="">전체</Select.Option>
        {data?.map((item) => (
          <Select.Option key={item.descVal} value={item.descVal}>
            {item.descInfo}
          </Select.Option>
        ))}
      </StyledSelect>
    </LabelWrap>
  );
};

export const BranchSelectListDashBoard = ({
  value,
  areaNo,
  placeholder,
  onChange,
  form = false,
  disabled = false,
}: BranchSelectListProps) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const { loading, error, data, getData } =
    useGetListWtTrigger<codelookupInterface>();

  useEffect(() => {
    if (areaNo !== '') {
      void getData({ url: `/codelookup/area/${areaNo}` });
    }
  }, [areaNo]);

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

  return (
    <StyledFormItemDB style={{ display: 'block' }}>
      <StyledSelectDB
        loading={loading}
        onChange={onChange}
        value={value}
        defaultValue=""
        placeholder={placeholder}
        disabled={areaNo === ''}
      >
        <Select.Option value="">전체</Select.Option>
        {data?.map((item) => (
          <Select.Option key={item.descVal} value={item.descVal}>
            {item.descInfo}
          </Select.Option>
        ))}
      </StyledSelectDB>
    </StyledFormItemDB>
  );
};

interface ManufacturerProps {
  value?: any;
  placeholder?: number | string;
  onChange?: (value: any) => void;
  form?: boolean;
  rules?: any;
}

export const ManufacturerSelectList = ({
  value,
  placeholder,
  onChange,
  form = false,
  rules,
}: ManufacturerProps) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const { loading, error, data } = useGetListWt<codelookupInterface>({
    url: '/codelookup/MANUFACT',
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
    <StyledFormItem name="manufacturerId" label="제조사" rules={rules}>
      <StyledSelect
        loading={loading}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      >
        {data?.map((item) => (
          <Select.Option key={item.descVal} value={item.descVal}>
            {item.descInfo}
          </Select.Option>
        ))}
      </StyledSelect>
    </StyledFormItem>
  ) : (
    <LabelWrap label="제조사">
      <StyledSelect
        loading={loading}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        defaultValue=""
      >
        <Select.Option value="">전체</Select.Option>
        {data?.map((item) => (
          <Select.Option key={item.descVal} value={item.descVal}>
            {item.descInfo}
          </Select.Option>
        ))}
      </StyledSelect>
    </LabelWrap>
  );
};

interface ConTypeSelectListProps {
  value?: any;
  placeholder?: number | string;
  onChange?: (value: any) => void;
  form?: boolean;
  disabled?: boolean;
  rules?: any;
}
export const ConTypeSelectList = ({
  value,
  placeholder,
  onChange,
  form = false,
  disabled = false,
  rules,
}: ConTypeSelectListProps) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const { loading, error, data } = useGetListWt<codelookupInterface>({
    url: '/codelookup/con_type',
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
    <StyledFormItem name="connectorType" label="커넥터 타입" rules={rules}>
      <StyledSelect
        loading={loading}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {data?.map((item) => (
          <Select.Option key={item.descVal} value={item.descVal}>
            {item.descInfo}
          </Select.Option>
        ))}
      </StyledSelect>
    </StyledFormItem>
  ) : (
    <LabelWrap label="커넥터 타입">
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
          <Select.Option key={item.descVal} value={item.descVal}>
            {item.descInfo}
          </Select.Option>
        ))}
      </StyledSelect>
    </LabelWrap>
  );
};
interface SpeedTypeSelectListProps {
  value?: any;
  placeholder?: number | string;
  onChange?: (value: any) => void;
  form?: boolean;
  disabled?: boolean;
  rules?: any;
}

export const SpeedTypeSelectList = ({
  value,
  placeholder,
  onChange,
  form = false,
  disabled = false,
  rules,
}: SpeedTypeSelectListProps) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const { loading, error, data } = useGetListWt<codelookupInterface>({
    url: '/codelookup/speed_type',
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
    <StyledFormItem name="speedType" label="속도유형" rules={rules}>
      <StyledSelect
        loading={loading}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {data?.map((item) => (
          <Select.Option key={item.descVal} value={item.descVal}>
            {item.descInfo}
          </Select.Option>
        ))}
      </StyledSelect>
    </StyledFormItem>
  ) : (
    <LabelWrap label="충전유형">
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
          <Select.Option key={item.descVal} value={item.descVal}>
            {item.descInfo}
          </Select.Option>
        ))}
      </StyledSelect>
    </LabelWrap>
  );
};

interface FaqCategorySelectListProps {
  value?: any;
  placeholder?: number | string;
  onChange?: (value: any) => void;
  form?: boolean;
  disabled?: boolean;
  rules?: any;
}
export const FaqCategorySelectList = ({
  value,
  placeholder,
  onChange,
  form = false,
  disabled = false,
  rules,
}: FaqCategorySelectListProps) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const { loading, error, data } = useGetListWt<codelookupInterface>({
    url: '/codelookup/FAQ_CATEGORY',
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
    <StyledFormItem name="category" label="카테고리" rules={rules}>
      <StyledSelect
        loading={loading}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {data?.map((item) => (
          <Select.Option key={item.descVal} value={item.descVal}>
            {item.descInfo}
          </Select.Option>
        ))}
      </StyledSelect>
    </StyledFormItem>
  ) : (
    <LabelWrap label="카테고리">
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
          <Select.Option key={item.descVal} value={item.descVal}>
            {item.descInfo}
          </Select.Option>
        ))}
      </StyledSelect>
    </LabelWrap>
  );
};

interface StationSelectDB {
  value?: any;
  AreaNo: number | string;
  placeholder?: string;
  onChange?: (value: any) => void;
  form?: boolean;
  disabled?: boolean;
  BranchNo: number | string;
  Category: number | string;
}

export const StationDB = ({
  value,
  AreaNo,
  BranchNo,
  Category,
  placeholder,
  onChange,
  form = false,
  disabled = false,
}: StationSelectDB) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const { loading, error, data, getData } =
    useGetListWtTrigger<OrganizationInterface>();
  useEffect(() => {
    void getData({
      url:
        '/orgs?rpp=10000&cate=' +
        String(Category || 'station') +
        '&area=' +
        String(AreaNo || '') +
        '&branch=' +
        String(BranchNo || ''),
      headers: {
        Location: '/station',
      },
    });
  }, [AreaNo, BranchNo, Category]);
  useEffect(() => {
    // if (error !== null) {
    //   console.log(error);
    //   setAlertModal({
    //     ...alertModal,
    //     open: true,
    //     type: 'error',
    //     title: 'API 호출 에러',
    //     content: error?.message || 'API 호출 에러',
    //   });
    // }
  }, [error]);
  return (
    <StyledFormItemDB>
      <StyledSelectDB
        loading={loading}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        defaultValue=""
        disabled={disabled}
      >
        <Select.Option value="">전체</Select.Option>
        {data?.map((item) => (
          <Select.Option key={item.id} value={item.id}>
            {item.name}
          </Select.Option>
        ))}
      </StyledSelectDB>
    </StyledFormItemDB>
  );
};
