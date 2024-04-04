/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { type StateInterface } from 'interfaces/ICommon';
import { DatePicker, Select, ConfigProvider } from 'antd';
import {
  DefaultDiv,
  GridHeader,
  GridRefetch,
  GridHeaderItem,
  type GridHeaderItemProps,
} from 'styles/style';

import { Input } from 'components/common/Input/Input';
import {
  StyledInputDate,
  StyledSelect,
  StyledSelectInput,
} from 'components/common/test/Styled.ant';
import CSHomeGridTable from './CSHomeGridTable';
import dayjs from 'dayjs';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { useLocation } from 'react-router-dom';
import { useGetListAll } from 'hooks/useGetListWt';
import { type Result } from 'interfaces/IConsultant';
import { userAuthState } from 'recoil/authState';

interface consultantFilterInterface {
  rpp: number; // 1page data 조회 갯수
  page: number; // rpp에 따른 조회 페이지 번호
  odby: 'DESC' | 'ASC'; // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
  searchKey: string;
  searchVal: string;
  startDate: string;
  endDate: string;
  ctartDate: string;
  cndDate: string;
  process: string;
  incoming: string;
  csClass: string;
  csCls1: string;
  conResult: string;
}

interface CSHomeListProps {
  setIsDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setFlagParam: React.Dispatch<React.SetStateAction<string | null>>;
  setRegNo: React.Dispatch<React.SetStateAction<string | null>>;
}
// eslint-disable-next-line react/prop-types
const CSHomeList: React.FC<CSHomeListProps> = ({
  setIsDetail,
  setFlagParam,
  setRegNo,
}) => {
  const location = useLocation();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const [queryState, setQueryState] = useState<consultantFilterInterface>({
    rpp: 50,
    page: 1,
    odby: 'DESC',
    searchKey: 'ALL',
    searchVal: '',
    startDate: '',
    endDate: '',
    ctartDate: '',
    cndDate: '',
    process: 'ALL',
    incoming: '',
    csClass: '',
    csCls1: '',
    conResult: 'ALL',
  });

  const prevSearchKeyRef = useRef(queryState.searchKey);

  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 1,
      odby: 'DESC',
      searchKey: 'ALL',
      searchVal: '',
      startDate: '',
      endDate: '',
      ctartDate: '',
      cndDate: '',
      process: 'ALL',
      incoming: '',
      csClass: '',
      csCls1: '',
      conResult: 'ALL',
    });
    refetch();
  };
  const [{ user }] = useRecoilState(userAuthState);

  const { loading, error, data, refetch, totalCount } = useGetListAll<Result>({
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    location: '/cs-home',
    url: `/v1/web/cs-list?select=${queryState.searchKey}
    &search=${queryState.searchVal}
    &csCls1=${queryState.csCls1}
    &startDate=${queryState.startDate}
    &endDate=${queryState.endDate}
    &ctartDate=${queryState.ctartDate}
    &cndDate=${queryState.cndDate}
    &statusCd=${queryState.process}
    &incomingCd=${queryState.incoming}
    &csClass=${queryState.csClass}
    &conResult=${queryState.conResult}
    &rpp=${queryState.rpp}
    &page=${queryState.page}
    `,
  });

  const handleQueryChange = (field: string, value: any) => {
    setQueryState({
      ...queryState,
      [field]: value,
    });
  };

  const gridHeaderData: GridHeaderItemProps[] = [
    {
      type: 'radio',
      label: '회원 분류',
      value: queryState.csCls1,
      onChange(e: any) {
        handleQueryChange('csCls1', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '일반회원',
          value: 'DEF',
        },
        {
          label: '비회원',
          value: 'ETC',
        },
      ],
    },
    {
      type: 'select',
      label: '상담 분류',
      value: queryState.csClass,
      onChange(e: any) {
        handleQueryChange('csClass', e);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '이용방법',
          value: 'CHG',
        },
        {
          label: '결제문의',
          value: 'BRK',
        },
        {
          label: '장애문의',
          value: 'PAY',
        },
        {
          label: '환불',
          value: 'REG',
        },
        {
          label: '단순 문의',
          value: 'CAR',
        },
        {
          label: '기타',
          value: 'ETC',
        },
      ],
    },
    {
      type: 'radio',
      label: '진행상태',
      value: queryState.process,
      onChange(e: any) {
        handleQueryChange('process', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: 'ALL',
        },
        {
          label: '접수',
          value: 'REC',
        },
        {
          label: '진행중',
          value: 'ING',
        },
        {
          label: '처리완료',
          value: 'COM',
        },
      ],
    },
  ];

  // 상담 번호 생성
  const createRegNo = () => {
    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0'); // January is 0!
    const dd = String(now.getDate()).padStart(2, '0');
    const HH = String(now.getHours()).padStart(2, '0');
    const MM = String(now.getMinutes()).padStart(2, '0');
    const SS = String(now.getSeconds()).padStart(2, '0');

    const formattedRegNo = `${yyyy}${mm}${dd}${HH}${MM}${SS}`;
    // regNo 상태를 업데이트합니다.
    // 만약 regNo가 상태로 관리되고 있다면, 해당 상태를 업데이트하는 함수를 호출해야 합니다.
    return formattedRegNo;
  };

  const handleHelpLine = () => {
    setAlertModal({
      ...alertModal,
      open: true,
      type: 'alert',
      title: '상담 전화',
      content: '010-0000-**** 비회원 충전기 결제 오류',
      okText: '전화 받기',
      onOk() {
        // navigate('/consultation');
        const initReg = createRegNo();
        window.open(
          `/consultation?regNo=${initReg}&flag=${'reg' as string}&incoming=${
            'CTP' as string
          }`,
        );
        setAlertModal({
          ...alertModal,
          open: false,
        });
      },
    });
  };

  const search = () => {
    setQueryState({
      ...queryState,
      rpp: 50,
      page: 1,
      odby: 'DESC',
    });
    refetch();
  };
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const validateFromEndDate = (type: string) => {
    const from = new Date(queryState?.startDate);
    const end = new Date(queryState?.endDate);
    if (queryState?.startDate !== '' && queryState?.endDate !== '') {
      if (from.getTime() > end.getTime()) {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: 'Error',
          content: '시작일이 완료일보다 미래로 설정할 수 없습니다.',
        });

        if (type === 'start') {
          setQueryState({
            ...queryState,
            startDate: '',
          });
        } else {
          setQueryState({
            ...queryState,
            endDate: '',
          });
        }
      }
    }
    // Compare the selected date with today
    if (queryState?.startDate > today) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: 'Error',
        content: '오늘일자까지 검색이 가능합니다.',
      });
      setQueryState({
        ...queryState,
        startDate: today,
      });
    }
    if (queryState?.endDate > today) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: 'Error',
        content: '오늘일자까지 검색이 가능합니다.',
      });
      setQueryState({
        ...queryState,
        endDate: today,
      });
    }
  };
  const validateFromEndDateCreate = (type: string) => {
    const from = new Date(queryState?.ctartDate);
    const end = new Date(queryState?.cndDate);
    if (queryState?.ctartDate !== '' && queryState?.cndDate !== '') {
      if (from.getTime() > end.getTime()) {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: 'Error',
          content: '시작일이 완료일보다 미래로 설정할 수 없습니다.',
        });

        if (type === 'start') {
          setQueryState({
            ...queryState,
            ctartDate: '',
          });
        } else {
          setQueryState({
            ...queryState,
            cndDate: '',
          });
        }
      }
    }
    // Compare the selected date with today
    if (queryState?.ctartDate > today) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: 'Error',
        content: '오늘일자까지 검색이 가능합니다.',
      });
      setQueryState({
        ...queryState,
        startDate: today,
      });
    }
    if (queryState?.cndDate > today) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: 'Error',
        content: '오늘일자까지 검색이 가능합니다.',
      });
      setQueryState({
        ...queryState,
        endDate: today,
      });
    }
  };
  useEffect(() => {
    validateFromEndDate('start');
  }, [queryState.startDate]);
  useEffect(() => {
    validateFromEndDate('end');
  }, [queryState?.endDate]);

  useEffect(() => {
    validateFromEndDateCreate('start');
  }, [queryState.ctartDate]);
  useEffect(() => {
    validateFromEndDateCreate('end');
  }, [queryState?.cndDate]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && search) {
      search();
    }
  };
  return (
    <>
      <DefaultDiv>
        {/* 조회 API 호출 */}
        <GridRefetch refetch={search} reload={reload} call={handleHelpLine} />
        <GridHeader container grid>
          <StyledSelectInput>
            <StyledSelect
              value={queryState.searchKey}
              onChange={(value) => {
                setQueryState({
                  ...queryState,
                  searchKey: value as string,
                });
              }}
            >
              <Select.Option value="ALL">전체</Select.Option>
              <Select.Option value="CONTENT">상담내용</Select.Option>
              <Select.Option value="ID">회원 ID</Select.Option>
              <Select.Option value="PHONE">인입 전화번호</Select.Option>
              <Select.Option value="USERPHONE">회원 전화번호</Select.Option>
              <Select.Option value="REGNO">접수번호</Select.Option>
            </StyledSelect>
            <Input
              value={queryState.searchVal}
              onChange={(event) => {
                setQueryState({
                  ...queryState,
                  searchVal: event.target.value,
                });
              }}
              onKeyDown={handleKeyPress}
            />
          </StyledSelectInput>
          <StyledInputDate iNumber={2} style={{ display: 'flex' }}>
            <label>접수 날짜</label>
            <div>
              <DatePicker
                format="YYYY-MM-DD"
                picker="date"
                placeholder="YYYY-MM-DD"
                value={
                  queryState?.startDate ? dayjs(queryState?.startDate) : null
                }
                onChange={(value) => {
                  setQueryState({
                    ...queryState,
                    startDate: value ? dayjs(value).format('YYYY-MM-DD') : '',
                  });
                }}
              />
            </div>
            <ConfigProvider>
              <div>
                <DatePicker
                  format="YYYY-MM-DD"
                  picker="date"
                  placeholder="YYYY-MM-DD"
                  value={
                    queryState?.endDate ? dayjs(queryState?.endDate) : null
                  }
                  onChange={(value) => {
                    setQueryState({
                      ...queryState,
                      endDate: value ? dayjs(value).format('YYYY-MM-DD') : '',
                    });
                  }}
                />
              </div>
            </ConfigProvider>
          </StyledInputDate>
          <StyledInputDate iNumber={2} style={{ display: 'flex' }}>
            <label>완료 날짜</label>
            <div>
              <DatePicker
                format="YYYY-MM-DD"
                picker="date"
                placeholder="YYYY-MM-DD"
                value={
                  queryState?.ctartDate ? dayjs(queryState?.ctartDate) : null
                }
                onChange={(value) => {
                  setQueryState({
                    ...queryState,
                    ctartDate: value ? dayjs(value).format('YYYY-MM-DD') : '',
                  });
                }}
              />
            </div>
            <div>
              <DatePicker
                format="YYYY-MM-DD"
                picker="date"
                placeholder="YYYY-MM-DD"
                value={queryState?.cndDate ? dayjs(queryState?.cndDate) : null}
                onChange={(value) => {
                  setQueryState({
                    ...queryState,
                    cndDate: value ? dayjs(value).format('YYYY-MM-DD') : '',
                  });
                }}
              />
            </div>
          </StyledInputDate>
          {gridHeaderData.map((item, index) => {
            return (
              <GridHeaderItem
                key={index}
                type={item.type}
                label={item.label}
                value={item.value}
                onChange={item.onChange}
                placeholder={item?.placeholder}
                listData={item?.listData}
              />
            );
          })}
        </GridHeader>
        <CSHomeGridTable
          loading={loading}
          data={data}
          state={state}
          setState={setState}
          queryState={queryState}
          setQueryState={setQueryState}
          totalCount={totalCount}
          setIsDetail={setIsDetail}
          setFlagParam={setFlagParam}
          setRegNo={setRegNo}
        />
      </DefaultDiv>
    </>
  );
};
export default CSHomeList;
