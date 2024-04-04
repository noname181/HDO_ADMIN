import { DashPage, BoardContain, BoardBox, SelectBox } from './styled';
import Tab from 'components/common/Tab/Tab';
import DashChargerOrder from './DashChargerOrder';
import { useRecoilState } from 'recoil';
import { userAuthState } from 'recoil/authState';
import { Navigate } from 'react-router-dom';
import { DataList } from './DataList';
import { hdoInstance } from 'apis/hdoInstance';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import DashboardMap from './DashboardMap';
const DashboardContainer = () => {
  const [{ isAuthenticated, user }] = useRecoilState(userAuthState);
  // const [areaNo, setAreaNo] = useState('');
  // const [branchNo, setBranchNo] = useState('');
  // const [category, setCategory] = useState('');
  const [queryState, setQueryState] = useState({
    region: '',
    // branch: '',
    categoryName: '',
  });
  const [data, setData] = useState<any>();

  const getPayment1Month = () => {
    const url = `/payment/history/user/month/all?region=${queryState.region}&categoryName=${queryState.categoryName}`;
    const axios = hdoInstance();
    const accessToken = localStorage.getItem('accessToken') ?? '';

    axios
      .get(url, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'multipart/form-data',
          Location: '/',
        },
      })
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getPayment1Month();
    // console.log('queryState');
  }, [queryState]);

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" />;
  }

  return (
    <Tab
      hideSearchButton={true}
      tabs={[
        {
          id: 'charger',
          label: '충전기 매출',
          content: (
            <DashPage dashPage="page-01">
              <BoardContain>
                <BoardBox position="left">
                  <DashboardMap
                    data={data}
                    getPayment1Month={getPayment1Month}
                    setQueryState={setQueryState}
                    queryState={queryState}
                  />
                  <SelectBox>
                    {/* <Select
                      w100
                      options={[
                        {
                          label: '중부리테일',
                          value: '0',
                        },
                        {
                          label: '목록',
                          value: '1',
                        },
                        {
                          label: '목록',
                          value: '2',
                        },
                      ]}
                    /> */}
                    {/* <AreaSelectListDashBoard
                      onChange={(e: any) => {
                        setAreaNo(e);
                      }}
                    />
                    <BranchSelectListDashBoard
                      areaNo={areaNo}
                      onChange={(e: any) => {
                        setBranchNo(e);
                      }}
                    /> */}
                    {/* <Select
                      w100
                      options={[
                        {
                          label: '전체',
                          value: '0',
                        },
                        {
                          label: '서울',
                          value: '1',
                        },
                        {
                          label: '경기',
                          value: '2',
                        },
                        {
                          label: '대구',
                          value: '3',
                        },
                        {
                          label: '부산',
                          value: '4',
                        },
                      ]}
                    /> */}
                    {/* <Select
                      w100
                      options={[
                        {
                          label: '전체',
                          value: '',
                        },
                        {
                          label: '직영점',
                          value: 'STT_DIR',
                        },
                        {
                          label: '자영점',
                          value: 'STT_FRN',
                        },
                      ]}
                      onChange={(e: any) => {
                        setCategory(e.value);
                      }}
                    /> */}
                    {/* <SelectFrame>
                      <StyledSelect
                        value={category}
                        onChange={(value) => {
                          // console.log(value);
                          setCategory(String(value));
                        }}
                      >
                        <Select.Option value="">전체</Select.Option>
                        <Select.Option value="STT_DIR">직영점</Select.Option>
                        <Select.Option value="STT_FRN">자영점</Select.Option>
                      </StyledSelect>
                    </SelectFrame> */}

                    {/* <StationDB
                      AreaNo={areaNo}
                      BranchNo={branchNo}
                      Category={category}
                      onChange={(e: any) => {}}
                    /> */}
                  </SelectBox>
                </BoardBox>
                <BoardBox position="right">
                  <DataList data={data} />
                  <DashChargerOrder data={data} />
                </BoardBox>
              </BoardContain>
              {/* <SampleDefault /> */}
            </DashPage>
          ),
        },
        // {
        //   id: 'wash',
        //   label: '세차권 매출',
        //   content: <></>,
        // },
      ]}
    />
  );
};

export default DashboardContainer;
const SelectFrame = styled.div`
  .ant-select {
    width: 100%;
  }
`;
