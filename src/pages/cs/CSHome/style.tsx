import { type ReactNode } from 'react';
import styled, { css } from 'styled-components';

interface MuteButtonProps {
  isMuted: boolean;
  minWidth?: string;
}

export const DContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  .nl-line {
    border-bottom: 1px solid var(--btn-gray-300);
    margin-top: 20px;
  }
`;
export const DRow = styled.div<{ style?: React.CSSProperties }>`
  display: flex;
  flex-direction: row;
  gap: 14px;
`;
export const DCol = styled.div<{ style?: React.CSSProperties }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 1px solid var(--btn-gray-300);
  padding: 20px;
  border-radius: 6px;
`;
export const DTable = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
export const DTr = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;
export const DTh = styled.div`
  font-weight: 500;
  height: 40px;
  line-height: 20px;
  width: 120px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
export const DTd = styled.div`
  height: 40px;
  line-height: 20px;
  width: calc(100% - 120px);
  display: flex;
  flex-direction: row;
  align-items: center;
`;
interface IItemInfo {
  label: string;
  value?: any;
  children?: ReactNode;
}
export const ItemInfo = ({ label, children }: IItemInfo) => {
  return (
    <DTable>
      <DTr>
        <DTh>{label}</DTh>
        <DTd>{children}</DTd>
      </DTr>
    </DTable>
  );
};

const Card = styled.div`
  position: absolute;
  background-color: var(--white);
  width: calc(100% - 242px);
  padding: 20px;
  border-radius: 10px;
  & + div {
    height: calc(100% - 54px - 58px);
    margin-top: 72px;
  }
`;
type boardType = 'left' | 'right';
interface boardProps {
  position: boardType;
}
const Contain = styled.div<boardProps>`
  ${(props) => {
    switch (props.position) {
      case 'left':
        return css`
          width: 100%;
          
          .cs-info__lbl {
            padding-right: 14px;
            font-weight: 500;
            position: relative;
            &:after {
              content: '';
              position: absolute;
              right: 0;
              top: 0;
              bottom: 0;
              margin: auto;
              height 10px;
              width 1px;
              background-color: var(--gray-300);
            }
          }
          .cs-info__decs {
            span:nth-child(1) {
              padding-right: 6px;
            }
            span:nth-child(2) {
              font-weight: 500;
            }
          }
          .cl-complete {
            color: green;
          }
          .cl-outgoing {
            color: red;
          }
          .cl-unprocessed {
            color: grey;
          }
          .cl-waiting {
            color: red;
            font-size: 1.2em;
            font-weight: bold;
          }
        `;
      case 'right':
        return css`
          width: 200px;
        `;
    }
  }}
`;
const CSInfo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 14px;
  // height: 40px;
  align-items: center;
  border-radius: 6px;
`;
interface CSInfoCellProps {
  type: string;
}
const CSInfoCell = styled.div<CSInfoCellProps>`
  ${(props) => {
    if (props.type === 'title') {
      return css`padding-right: 14px;
      font-weight: 500;
      position: relative;
      &:after {
        content: '';
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        height 10px;
        width 1px;
        background-color: var(--gray-300);
      }`;
    } else if (props.type === 'content') {
      return css`
        span:nth-child(1) {
          padding-right: 6px;
        }
        span:nth-child(2) {
          font-weight: 500;
        }
      `;
    }
  }}
`;
export { Card, Contain, CSInfo, CSInfoCell };
export const EmptyMember = styled.div`
  background-color: rgba(0, 0, 0, 0.85);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;

  button {
    margin-bottom: 20px;
  }
  .nl-text {
    color: #fff;
    line-height: 22px;
    margin-top: 20px;
    &.medium {
      font-size: 22px;
    }
  }
`;

export const MuteButton = styled.button<MuteButtonProps>`
  background-color: ${(props) => (props.isMuted ? 'red' : 'black')};
  color: white;
  height: 40px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold; // 글자를 굵게 표시합니다.
  &:hover {
    opacity: 0.8;
  }
`;
