import styled from 'styled-components';
import { Select } from 'components/common/Select/Select';
import type { ReactNode } from 'react';

const FtContain = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;
const ShowList = styled.div`
  display: flex;
  gap: 8px;
  padding: 0;
  align-items: center;
  & > span {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: var(--dark-default);
    padding: 0;
  }
`;
interface footerProps {
  children: ReactNode;
}
const HdSelect = styled.div`
  position: relative,
  width: 70px !important;
  height: 30px !important;
  line-height: 30px !important;
  padding: 0;
  & select {
    display: none;
    word-wrap: normal;
    text-transform: none;
    margin: 0;
  }
  & span {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: var(--dark-default);
    padding: 0;
  }
`;
// const SelectSelected = styled.div`
//   line-height: 30px;
//   color: var(--dark-default);
//   background-color: var(--white);
//   border-radius: 4px;
//   padding: 0 10px;
//   cursor: pointer;
//   border: 1px solid var(--btn-gray-300);
//   font-size: 14px;
//   &:after {
//     width: 30px;
//     height: 30px;
//     position: absolute;
//     content: '';
//     top: 0;
//     right: 0;
//     width: 40px;
//     height: 40px;
//     background-image: url('assets/img/icon/icon-arrow-up-rounded-d.png');
//     background-size: 20px;
//     background-position: center;
//     background-repeat: no-repeat;
//     transform: rotate(0deg);
//   }
// `;
// const HideOption = styled.div`
//   top: unset;
//   bottom: 36px;
//   display: none;
//   position: absolute;
//   left: 0;
//   right: 0;
//   z-index: 99;
//   filter: drop-shadow(1px 1px 4px rgba(0, 0, 0, 0.15));
//   border-radius: 6px;
//   overflow: hidden;
//   & * {
//     color: var(--dark-default);
//     padding: 0 10px;
//     cursor: pointer;
//     background-color: var(--white);
//     font-weight: 500;
//     font-size: 14px;
//     line-height: 40px;
//   }
// `;
export const FtFilter = ({ children }: footerProps) => {
  return <HdSelect>{children}</HdSelect>;
};
export const TbFooter = () => {
  return (
    <FtContain>
      <ShowList>
        <span>Showing</span>
        <FtFilter>
          <Select
            label=""
            options={[
              { value: '0', label: '100' },
              { value: '1', label: '200' },
              { value: '2', label: '300' },
            ]}
          />
          {/* <SelectSelected>100</SelectSelected>
          <HideOption>
            <div>1</div>
            <div>2</div>
            <div>3</div>
          </HideOption> */}
          <span>Users out of 100</span>
        </FtFilter>
      </ShowList>
    </FtContain>
  );
};
