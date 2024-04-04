import styled, { css } from 'styled-components';
import { hdoInstance } from 'apis/hdoInstance';
import { useState, useEffect } from 'react';

export const SelectBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 10px;
  width: 100%;
`;

type pageNum = 'page-01' | 'page-02';
interface PageProps {
  dashPage: pageNum;
}
const DashPage = styled.div<PageProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;

  ${(props) => {
    switch (props.dashPage) {
      case 'page-01':
        return css`
          gap: 20px;
        `;
      case 'page-02':
        return css`
          gap: 0px;
        `;
    }
  }}
`;

const BoardContain = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
  // height: 650px;
  height: calc(100vh - 158px);
  background-color: var(--white);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 0;
`;
type boardType = 'left' | 'right';
interface boardProps {
  position: boardType;
}
const BoardBox = styled.div<boardProps>`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;

  ${(props) => {
    switch (props.position) {
      case 'left':
        return css`
          width: 440px;
        `;
      case 'right':
        return css`
          gap: 20px;
          width: calc(100% - 440px);
        `;
    }
  }}
`;
const MapStatus = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  & ul {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;
  }
  & li {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  & span {
    font-weight: 500;
    font-size: 14px;
    line-height: 30px;
    color: var(--dark-default);
  }
`;
type mapNum = '01' | '02' | '03' | '04' | '05';
interface MapNumProps {
  number: mapNum;
}
const MapNum = styled.div<MapNumProps>`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;
  width: 30px;
  height: 30px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: var(--white);
  ${(props) => {
    switch (props.number) {
      case '01':
        return css`
          background: #002f87;
          border: 4px solid #bed5ff;
        `;
      case '02':
        return css`
          background: #0d6efd;
          border: 4px solid #cee7ff;
        `;
      case '03':
        return css`
          background: #ff9920;
          border: 4px solid #ffe5c7;
        `;
      case '04':
        return css`
          background: #00ae42;
          border: 4px solid #cff5e0;
        `;
      case '05':
        return css`
          background: #e92c2c;
          border: 4px solid #ffd4c7;
        `;
    }
  }}
`;
const MapContain = styled.div`
  position: relative;
  width: 100%;
  // height: calc(100% - 110px);
  // height: 100%;
  height: 755px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
  border: 1px solid var(--btn-gray-300);
  svg {
    height: 100%;
    width: 100%;
  }
  path:not(.nl-city-name):hover,
  .hovered {
    cursor: pointer;
    font-weight: bold;
    fill: rgb(45, 142, 255);
  }
  .nl-city-name {
    pointer-events: none;
  }
  path.active {
    fill: #2d8eff;
  }
  path.active + .nl-city-name {
    fill: #fff;
  }
`;
const MapImg = styled.img.attrs({
  src: '/assets/img/dashboard-map.png',
})`
  height: 100%;
  width: 100%;
  object-fit: contain;
  margin: 0 auto;
  display: block;
  vertical-align: middle;
`;

export { MapStatus, MapNum, MapContain, MapImg };
const DTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  color: #484848;
  margin-bottom: 10px;
`;
const DSeeMore = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 15.4px;
  color: #8a8a8a;
  margin-bottom: 10px;
`;
const DRow = styled.div`
  display: flex;
  justify-content: space-between;
`;
const DArrowRight = styled.div`
  height: 6px;
  width: 6px;
  transform: rotate(-45deg);
  border-right: 1px solid #a8a8a8;
  border-bottom: 1px solid #a8a8a8;
  margin-top: 4px;
  margin-left: 6px;
`;
export {
  DashPage,
  BoardBox,
  BoardContain,
  DTitle,
  DSeeMore,
  DRow,
  DArrowRight,
};
