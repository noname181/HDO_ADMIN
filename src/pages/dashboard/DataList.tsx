import { hdoInstance } from 'apis/hdoInstance';
import styled, { css } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
interface Props {
  data: any;
}
export const DataList = ({ data }: Props) => {
  // console.log(data);
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}.${month}.${day}`;
  const getYesterday = new Date();
  getYesterday.setDate(now.getDate() - 1);
  const yearY = String(getYesterday.getFullYear());
  const monthY = String(getYesterday.getMonth() + 1).padStart(2, '0');
  const dayY = String(getYesterday.getDate()).padStart(2, '0');
  const yesterday = `${yearY}.${monthY}.${dayY}`;
  const getMonthAgo = new Date();
  getMonthAgo.setMonth(getMonthAgo.getMonth() - 1);
  const yearMonthAgo = String(getMonthAgo.getFullYear());
  const monthAgo = String(getMonthAgo.getMonth() + 1).padStart(2, '0');
  // handle the day before yestergay
  const getBeforeYesterday = new Date();
  getBeforeYesterday.setDate(now.getDate() - 2);
  const yearBY = String(getBeforeYesterday.getFullYear());
  const monthBY = String(getBeforeYesterday.getMonth() + 1).padStart(2, '0');
  const dayBY = String(getBeforeYesterday.getDate()).padStart(2, '0');
  const beforeYesterday = `${yearBY}.${monthBY}.${dayBY}`;

  function formatNumber(number: number) {
    const numberFormat = new Intl.NumberFormat('en-US').format(number);
    return numberFormat;
  }
  return (
    <DataWrap>
      {/* <DataBox boxType="nomal">
        <Dhead upDown={'up'}>
          <img src="assets/img/icon/icon-nav-charger-d.png" />일 판매이익
          <span>
            <img src="assets/img/icon/icon-trending-up.png" />
            8.5%
          </span>
        </Dhead>
        <Dcont>
          <Dlabel>
            전전일
            <span>{beforeYesterday}</span>
          </Dlabel>
          <Dresult>
            <span></span>
            <span>10,000,000</span>
            <span>원</span>
          </Dresult>
        </Dcont>
        <Dcont>
          <Dlabel>
            전일
            <span>{yesterday}</span>
          </Dlabel>
          <Dresult>
            <span></span>
            <span>10,000,000</span>
            <span>원</span>
          </Dresult>
        </Dcont>
      </DataBox>
      <DataBox boxType="nomal">
        <Dhead upDown={'down'}>
          <img src="assets/img/icon/icon-nav-charger-d.png" />일 판매이익
          <span>
            <img src="assets/img/icon/icon-trending-down.png" />
            3.2%
          </span>
        </Dhead>
        <Dcont>
          <Dlabel>
            전월
            <span>{yearMonthAgo + '.' + monthAgo}</span>
          </Dlabel>
          <Dresult>
            <span></span>
            <span>10,000,000</span>
            <span>원</span>
          </Dresult>
        </Dcont>
        <Dcont>
          <Dlabel>
            당월
            <span>{year + '.' + month}</span>
          </Dlabel>
          <Dresult>
            <span></span>
            <span>10,000,000</span>
            <span>원</span>
          </Dresult>
        </Dcont>
      </DataBox>
      <DataBox boxType="nomal">
        <Dhead upDown={'up'}>
          <img src="assets/img/icon/icon-nav-charger-d.png" />일 영업이익
          <span>
            <img src="assets/img/icon/icon-trending-up.png" />
            8.5%
          </span>
        </Dhead>
        <Dcont>
          <Dlabel>
            전전일
            <span>{beforeYesterday}</span>
          </Dlabel>
          <Dresult>
            <span></span>
            <span>10,000,000</span>
            <span>원</span>
          </Dresult>
        </Dcont>
        <Dcont>
          <Dlabel>
            전일
            <span>{yesterday}</span>
          </Dlabel>
          <Dresult>
            <span></span>
            <span>10,000,000</span>
            <span>원</span>
          </Dresult>
        </Dcont>
      </DataBox>
      <DataBox boxType="nomal">
        <Dhead upDown={'down'}>
          <img src="assets/img/icon/icon-nav-charger-d.png" />월 영업이익
          <span>
            <img src="assets/img/icon/icon-trending-down.png" />
            3.2%
          </span>
        </Dhead>
        <Dcont>
          <Dlabel>
            전월
            <span>{yearMonthAgo + '.' + monthAgo}</span>
          </Dlabel>
          <Dresult>
            <span></span>
            <span>10,000,000</span>
            <span>원</span>
          </Dresult>
        </Dcont>
        <Dcont>
          <Dlabel>
            당월
            <span>{year + '.' + month}</span>
          </Dlabel>
          <Dresult>
            <span></span>
            <span>10,000,000</span>
            <span>원</span>
          </Dresult>
        </Dcont>
      </DataBox> */}
      <DataBox boxType="nomal">
        <Dhead upDown={parseInt(data?.increaseKwhToday) > 0 ? 'up' : 'down'}>
          <img src="assets/img/icon/icon-nav-charger-d.png" />일 사용량
          <span>
            {parseInt(data?.increaseKwhToday) > 0 ? (
              <img src="assets/img/icon/icon-trending-up.png" />
            ) : (
              <img src="assets/img/icon/icon-trending-down.png" />
            )}
            {data?.increaseKwhToday}%
          </span>
        </Dhead>
        <Dcont>
          <Dlabel>
            전전일
            <span>{beforeYesterday}</span>
          </Dlabel>
          <Dresult>
            <span>{data?.totalCountYesterday}회</span>
            <span>{formatNumber(data?.totalKwhYesterday || 0)}</span>
            <span>kWh</span>
          </Dresult>
        </Dcont>
        <Dcont>
          <Dlabel>
            전일
            <span>{yesterday}</span>
          </Dlabel>
          <Dresult>
            <span>{data?.totalCountToday}회</span>
            <span>{formatNumber(data?.totalKwhToday || 0)}</span>
            <span>kWh</span>
          </Dresult>
        </Dcont>
      </DataBox>
      <DataBox boxType="nomal">
        <Dhead
          upDown={parseInt(data?.increaseKwhThisMonth) > 0 ? 'up' : 'down'}
        >
          <img src="assets/img/icon/icon-nav-charger-d.png" />월 사용량
          <span>
            {parseInt(data?.increaseKwhThisMonth) > 0 ? (
              <img src="assets/img/icon/icon-trending-up.png" />
            ) : (
              <img src="assets/img/icon/icon-trending-down.png" />
            )}
            {data?.increaseKwhThisMonth}%
          </span>
        </Dhead>
        <Dcont>
          <Dlabel>
            전월
            <span>{yearMonthAgo + '.' + monthAgo}</span>
          </Dlabel>
          <Dresult>
            <span>{data?.totalCountLastMonth}회</span>
            <span>{formatNumber(data?.totalKwhLastMonth || 0)}</span>
            <span>kWh</span>
          </Dresult>
        </Dcont>
        <Dcont>
          <Dlabel>
            당월
            <span>{year + '.' + month}</span>
          </Dlabel>
          <Dresult>
            <span>{data?.totalCountThisMonth}회</span>
            <span>{formatNumber(data?.totalKwhThisMonth || 0)}</span>
            <span>kWh</span>
          </Dresult>
        </Dcont>
      </DataBox>
      <DataBox boxType="nomal">
        <Dhead
          upDown={parseInt(data?.increasePaymentToday) > 0 ? 'up' : 'down'}
        >
          <img src="assets/img/icon/icon-nav-charger-d.png" />일 매출액
          <span>
            {parseInt(data?.increasePaymentToday) > 0 ? (
              <img src="assets/img/icon/icon-trending-up.png" />
            ) : (
              <img src="assets/img/icon/icon-trending-down.png" />
            )}
            {data?.increasePaymentToday}%
          </span>
        </Dhead>
        <Dcont>
          <Dlabel>
            전전일
            <span>{beforeYesterday}</span>
          </Dlabel>
          <Dresult>
            <span></span>
            <span>{formatNumber(data?.totalPaymentYesterday || 0)}</span>
            <span>원</span>
          </Dresult>
        </Dcont>
        <Dcont>
          <Dlabel>
            전일
            <span>{yesterday}</span>
          </Dlabel>
          <Dresult>
            <span></span>
            <span>{formatNumber(data?.totalPaymentToday || 0)}</span>
            <span>원</span>
          </Dresult>
        </Dcont>
      </DataBox>
      <DataBox boxType="nomal">
        <Dhead
          upDown={parseInt(data?.increasePaymentThisMonth) > 0 ? 'up' : 'down'}
        >
          <img src="assets/img/icon/icon-nav-charger-d.png" />월 매출액
          <span>
            {parseInt(data?.increasePaymentThisMonth) > 0 ? (
              <img src="assets/img/icon/icon-trending-up.png" />
            ) : (
              <img src="assets/img/icon/icon-trending-down.png" />
            )}
            {data?.increasePaymentThisMonth}%
          </span>
        </Dhead>
        <Dcont>
          <Dlabel>
            전월
            <span>{yearMonthAgo + '.' + monthAgo}</span>
          </Dlabel>
          <Dresult>
            <span></span>
            <span>
              {formatNumber(parseInt(data?.totalPaymentLastMonth || 0))}
            </span>
            <span>원</span>
          </Dresult>
        </Dcont>
        <Dcont>
          <Dlabel>
            당월
            <span>{year + '.' + month}</span>
          </Dlabel>
          <Dresult>
            <span></span>
            <span>
              {formatNumber(parseInt(data?.totalPaymentThisMonth || 0))}
            </span>
            <span>원</span>
          </Dresult>
        </Dcont>
      </DataBox>
      {/* <DataBox boxType="graph">
          <BoardGraph></BoardGraph>
        </DataBox> */}
    </DataWrap>
  );
};
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
  // max-height: 118px;
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
type upDown = 'up' | 'down';
interface udProps {
  readonly upDown: any;
}
const Dhead = styled.div<udProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  & > img {
    width: 18px;
    vertical-align: middle;
  }
  & span {
    color: var(--blue-200);
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    ${(props) => {
      switch (props.upDown) {
        case 'up':
          return css`
            color: var(--blue-200);
          `;
        case 'down':
          return css`
            color: #e92c2c;
          `;
      }
    }}
  }
  & span img {
    width: 24px;
    height: 24px;
    vertical-align: middle;
  }
`;
const Dcont = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Dlabel = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 48px;
  display: flex;
  align-items: center;
  color: #9c9c9c;
  span {
    padding-left: 10px;
    font-weight: 500;
    font-size: 14px;
    line-height: 48px;
    color: var(--dark-default);
  }
`;
const Dresult = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  & span:first-child {
    font-weight: 500;
    font-size: 14px;
    line-height: 48px;
    color: var(--dark-default);
  }
  & span:nth-child(2) {
    font-weight: 500;
    font-size: 28px;
    line-height: 48px;
    display: flex;
    align-items: center;
    color: var(--dark-default);
  }
  & span:last-child {
    font-weight: 500;
    font-size: 14px;
    line-height: 48px;
    display: flex;
    align-items: center;
    color: #9c9c9c;
  }
`;
