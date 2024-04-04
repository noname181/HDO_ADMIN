import styled, { css } from 'styled-components';
type pageNum = 'page-01' | 'page-02';
interface PageProps {
  dashPage: pageNum;
}

const BoardContain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  // height: 650px;
  height: calc(100vh - 158px);
  background-color: var(--white);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 0;

  .nl-tbl-vertical {
    border-collapse: collapse;
    border: 1px solid rgb(205, 208, 211);
    width: 100%;
    table-layout: fixed;
    tr {
      th,
      td {
        border: 1px solid rgb(205, 208, 211);
        padding: 10px;
        font-size: 14px;
        white-space: initial;
        text-align: center;
        vertical-align: middle;
      }
      th {
        background-color: #f1f3f5;
        height: 57px;
      }
      td {
        height: 168px;
      }
    }
  }
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
          width: calc(100% / 7 * 4);
        `;
      case 'right':
        return css`
          width: calc(100% / 7 * 3);
        `;
    }
  }}
`;
const BoardRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;
export { BoardContain, BoardBox, BoardRow };
interface BoxProps {
  isTop?: boolean;
}
const Box = styled.div<BoxProps>`
  border: 1px solid rgb(205, 208, 211);
  font-size: 14px;
  width: 100%;
  flex: 1;
  border-radius: 6px;
  height: 122px;
  ${(props) => {
    if (props?.isTop) {
      return css`
        height: 205px;
      `;
    }
  }}
`;
const BoxHead = styled.div`
  padding: 20px 20px 0;
  height: 46px;
  display: flex;
  align-items: flex-start;
  span {
    font-size: 16px;
    line-height: 1;
    // padding-bottom: 6px;
    font-weight: 500;
    color: rgb(72, 72, 72);
    // border-bottom: 1px solid rgb(205, 208, 211);
  }
  .nl-note {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    gap: 20px;
    .note-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      line-height: 14px;
    }
    .box {
      height: 6px;
      width: 16px;
      &.one {
        background-color: rgba(13, 138, 253, 0.6);
      }
      &.two {
        background-color: rgba(0, 174, 66, 0.6);
      }
      &.three {
        background-color: rgba(148, 149, 150, 0.6);
      }
    }
    .text {
      font-size: 12px;
      font-weight: 400;
      line-height: 14px;
      color: #8a8a8a;
      padding-bottom: 0;
    }
  }
`;
interface BoxBodyProps {
  isHead?: boolean;
  isTop?: boolean;
}
const BoxBody = styled.div<BoxBodyProps>`
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  ${(props) => {
    if (props?.isHead) {
      return css`
        height: calc(100% - 46px);
      `;
    }
  }}
  .text {
    font-size: 16px;
    padding-bottom: 6px;
    font-weight: 500;
    color: rgb(72, 72, 72);
  }
  .number {
    font-size: 30px;
    font-weight: 500;
  }
`;
export { Box, BoxHead, BoxBody };
const RateFrame = styled.div`
  position: relative;
  width: 240px;
  margin-bottom: 14px;
  &:before,
  &:after {
    position: absolute;
    z-index: 2;
    color: #8a8a8a;
    bottom: -18px;
  }
  &:after {
    content: '0';
    left: 15px;
  }
  &:before {
    content: '100';
    right: 10px;
  }
`;
const RateContainer = styled.div`
  height: 120px;
  overflow: hidden;
  margin: 0 auto auto;
`;
interface RateBarProps {
  value: number;
}
const RateBar = styled.div<RateBarProps>`
  position: relative;
  overflow: hidden;
  padding: 40px;
  // border: 1px solid var(--gray-200);
  border-bottom: 0;
  border-radius: 50%;
  width: 240px;
  height: 240px;
  z-index: 1;
  background-color: #eaebed;
  &:after {
    position: absolute;
    content: '';
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #0d8afd;
    z-index: 2;
    clip-path: polygon(50% 0%, 50% 100%, 100% 100%, 100% 0%);
    transform: rotate(-270deg);
    border-radius: 50%;

    ${(props) => {
      if (props.value) {
        const rotateVal = -270 + props.value * 1.8;
        return css`
          transform: rotate(${rotateVal}deg);
        `;
      }
    }}
  }
`;
const RateProcess = styled.div`
  position: relative;
  padding: 20px 0 0;
  // border: 1px solid var(--gray-200);
  border-bottom: 0;
  border-radius: 50%;
  color: red;
  height: 100%;
  z-index: 3;
  background: #fff;
`;
const ReteValue = styled.div`
  font-size: 32px;
  font-weight: 500;
  line-height: 26px;
  text-align: center;
  margin-top: 20px;
  color: #484848;
  span {
    font-size: 16px;
    line-height: 26px;
  }
`;
export { RateContainer, RateBar, RateProcess, ReteValue, RateFrame };
