import styled, { css } from 'styled-components';
import DashChartTotalKwhThisYear from './DashChartTotalKwhThisYear';
import DashChartTotalKwhThisMonth from './DashChartTotalKwhThisMonth';
import DashChartTotalPaymentThisMonth from './DashChartTotalPaymentThisMonth';
import DashChartTotalPaymentThisYear from './DashChartTotalPaymentThisYear';
import { useEffect, useState } from 'react';
const DataWrap = styled.div`
  width: 100%;
  grid-template-columns: 1fr 1fr;
  display: grid;
  gap: 20px;
`;
type boxType = 'nomal' | 'graph';
interface BoxProps {
  boxType: boxType;
}
const DataBox = styled.div<BoxProps>`
  box-sizing: border-box;
  border: 1px solid var(--btn-gray-300);
  padding: 20px;
  border-radius: 10px;
  overflow: hidden;
  // height: 226px;
  height: 330px;
  ${(props) => {
    switch (props.boxType) {
      case 'nomal':
        return css`
          display: grid;
          gap: 10px;
        `;
      case 'graph':
        return css`
          overflow: hidden;
        `;
    }
  }}
`;
const DHead = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 34px;
`;
const DBody = styled.div`
  box-sizing: border-box;
  // height: calc(100% - 55px);
  overflow-y: scroll;
  /* scroll */
  /* IE and Edge */
  -ms-overflow-style: none;
  /* Firefox */
  scrollbar-width: none;
  &::before,
  &::after {
    /* scroll */
    /* IE and Edge */
    -ms-overflow-style: none;
    /* Firefox */
    scrollbar-width: none;
  }
  &::-webkit-scrollbar {
    /* Chrome, Safari, Opera */
    display: none;
  }
`;
const DTab = styled.div`
  display: flex;
`;
type active = true | false;
interface tabProps {
  tabType: string;
  active: active;
}
const DTabItem = styled.div<tabProps>`
  box-sizing: border-box;
  height: 33px;
  text-align: center;
  line-height: 31px;
  cursor: pointer;
  ${(props) => {
    switch (props.tabType) {
      case 'box':
        return css`
          border: 1px solid transparent;
          width: 82px;
          border-bottom-color: var(--btn-gray-300);
          ${props.active
            ? `color: #484848;
              font-weight: 500; 
              border-color: var(--btn-gray-300);
              border-bottom-color: transparent;
              `
            : `color: #9C9C9C;
              font-weight: 500;
              border-top-color: transparent;`};
          &:not(:first-child) {
            border-left: 0;
          }
        `;
      case 'link':
        return css`
          position: relative;
          width: 53px;
          color: ${props.active ? '#484848' : '#9C9C9C'};
          font-weight: ${props.active ? '500' : '400'};
          &::after {
            position: absolute;
            content: '';
            width: 100%;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 9;
            height: ${props.active ? '2px' : '1px'};
            background-color: ${props.active ? '#0D6EFD' : '#cdd0d3'};
          }
        `;
    }
  }}
`;
const DTitile = styled.div`
  font-size: 16px;
  line-height: 20px;
`;
const DTableBody = styled.div`
  width: 100%;
`;
const DTableRow = styled.div`
  width: 100%;
  grid-template-columns: 50px auto 80px 90px;
  display: grid;
  &:nth-child(odd) {
    background-color: #f5f6f6;
  }
`;

const DTableCell = styled.div`
  height: 40px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  &:nth-child(1),
  &:nth-child(4) {
    justify-content: center;
  }
  &:nth-child(2),
  &:nth-child(3) {
    text-align: left;
  }
`;
interface ProFillProps {
  fillVal: string;
  color: string;
}
interface NumBarProps {
  color: string;
}
const DProcessBar = styled.div`
  width: 150px;
  height: 6px;
  border-radius: 10px;
  display: flex;
`;
const DProcessFill = styled.div<ProFillProps>`
  height: 100%;
  border-radius: 10px;
  ${(props) => {
    return css`
      width: ${props.fillVal ? props.fillVal : '0%'};
      background-color: ${props.color};
    `;
  }}
`;
const DProcessNum = styled.div<NumBarProps>`
  font-size: 14px;
  line-height: 18px;
  color: #fff;
  border-radius: 20px;
  padding: 0px 10px;
  ${(props) => {
    return css`
      background-color: ${props.color};
    `;
  }}
`;
interface TabProp {
  id: string;
  label: string;
  type: string;
}
interface TabProps {
  tabs: TabProp[];
  setActiveTabDashChartLeft?: any;
  setActiveTabDashChartRight?: any;
  setActiveTabDashChartPayment?: any;
}

const Tab = ({ tabs, setActiveTabDashChartRight }: TabProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <>
      {tabs.map((tab) => (
        <div key={tab.id}>
          <DTabItem
            active={activeTab === tab.id}
            onClick={() => {
              // console.log(tab.id);
              handleTabClick(tab.id);
              setActiveTabDashChartRight(tab.id);
            }}
            tabType={tab.type}
          >
            <span>{tab.label}</span>
          </DTabItem>
        </div>
      ))}
    </>
  );
};
const Tab2 = ({ tabs, setActiveTabDashChartPayment }: TabProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };
  return (
    <>
      {tabs.map((tab) => (
        <div key={tab.id}>
          <DTabItem
            active={activeTab === tab.id}
            onClick={() => {
              handleTabClick(tab.id);
              setActiveTabDashChartPayment(tab.id);
            }}
            tabType={tab.type}
          >
            <span>{tab.label}</span>
          </DTabItem>
        </div>
      ))}
    </>
  );
};
const TabBox = ({ tabs, setActiveTabDashChartLeft }: TabProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };
  return (
    <>
      {tabs.map((tab) => (
        <div key={tab.id}>
          <DTabItem
            active={activeTab === tab.id}
            onClick={() => {
              handleTabClick(tab.id);
              setActiveTabDashChartLeft(tab.id);
            }}
            tabType={tab.type}
          >
            <span>{tab.label}</span>
          </DTabItem>
        </div>
      ))}
    </>
  );
};
interface Props {
  data: any;
}
const DashChargerOrder = ({ data }: Props) => {
  const [activeTabDashChartLeft, setActiveTabDashChartLeft] =
    useState<any>('0');
  const [activeTabDashChartRight, setActiveTabDashChartRight] =
    useState<any>('2');

  const [activeTabDashChartPayment, setActiveTabDashChartPayment] =
    useState<any>('0');
  return (
    <DataWrap>
      <DataBox boxType="nomal">
        <DHead>
          <DTab>
            <TabBox
              tabs={[
                { id: '0', label: '사용량', type: 'box' },
                { id: '1', label: '매출액', type: 'box' },
              ]}
              setActiveTabDashChartLeft={setActiveTabDashChartLeft}
            />
          </DTab>
          <DTab>
            <Tab
              tabs={[
                { id: '2', label: '일별', type: 'link' },
                { id: '3', label: '월별', type: 'link' },
              ]}
              setActiveTabDashChartRight={setActiveTabDashChartRight}
            />
          </DTab>
        </DHead>
        <DBody>
          {activeTabDashChartLeft === '0' &&
            activeTabDashChartRight === '2' && (
              <DashChartTotalKwhThisMonth
                dataChart={data?.totalKwhAllDayThisMonth}
              ></DashChartTotalKwhThisMonth>
            )}
          {activeTabDashChartLeft === '0' &&
            activeTabDashChartRight === '3' && (
              <DashChartTotalKwhThisYear
                dataChart={data?.totalKwhAllMonthThisYear}
              ></DashChartTotalKwhThisYear>
            )}
          {activeTabDashChartLeft === '1' &&
            activeTabDashChartRight === '2' && (
              <DashChartTotalPaymentThisMonth
                dataChart={data?.totalPaymentAllDayThisMonth}
              ></DashChartTotalPaymentThisMonth>
            )}
          {activeTabDashChartLeft === '1' &&
            activeTabDashChartRight === '3' && (
              <DashChartTotalPaymentThisYear
                dataChart={data?.totalPaymentAllMonthThisYear}
              ></DashChartTotalPaymentThisYear>
            )}
        </DBody>
      </DataBox>
      <DataBox boxType="nomal">
        <DHead>
          <DTitile>충전량 순</DTitile>
          <DTab>
            <Tab2
              tabs={[
                { id: '0', label: '일별', type: 'link' },
                { id: '1', label: '월별', type: 'link' },
              ]}
              setActiveTabDashChartPayment={setActiveTabDashChartPayment}
            />
          </DTab>
        </DHead>
        <DBody style={{ height: 258 }}>
          <DTableRow style={{ background: '#fff' }}>
            <DTableCell>순위</DTableCell>
            <DTableCell>충전소명</DTableCell>
            <DTableCell>충전 건수</DTableCell>
            <DTableCell>충전량 kWh</DTableCell>
          </DTableRow>
          <hr style={{ border: 0, borderBottom: '1px solid #CDD0D3' }} />
          <DTableBody>
            {data && (
              <>
                {(activeTabDashChartPayment === '0' &&
                  data.totalAmountKwhAllStationsToday?.length > 0) ||
                (activeTabDashChartPayment === '1' &&
                  data.totalAmountKwhAllStationsThisMonth?.length > 0) ? (
                  <>
                    {activeTabDashChartPayment === '0' &&
                      data.totalAmountKwhAllStationsToday?.map(
                        (item: any, index: number) => (
                          <DTableRow key={index}>
                            <DTableCell>
                              {data.totalAmountKwhAllStationsToday.length -
                                index}
                            </DTableCell>
                            <DTableCell>{item?.chgs_name}</DTableCell>
                            <DTableCell>{item?.totalCount}</DTableCell>
                            <DTableCell>{item?.totalAmountKwh}</DTableCell>
                          </DTableRow>
                        ),
                      )}
                    {activeTabDashChartPayment === '1' &&
                      data.totalAmountKwhAllStationsThisMonth?.map(
                        (item: any, index: number) => (
                          <DTableRow key={index}>
                            <DTableCell>
                              {data.totalAmountKwhAllStationsThisMonth.length -
                                index}
                            </DTableCell>
                            <DTableCell>{item?.chgs_name}</DTableCell>
                            <DTableCell>{item?.totalCount}</DTableCell>
                            <DTableCell>{item?.totalAmountKwh}</DTableCell>
                          </DTableRow>
                        ),
                      )}
                  </>
                ) : (
                  <div
                    style={{
                      height: '200px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    데이터가 없습니다
                  </div>
                )}
              </>
            )}
          </DTableBody>
        </DBody>
      </DataBox>
    </DataWrap>
  );
};
export default DashChargerOrder;
