import styled, { css } from 'styled-components';

const DRow = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 -20px;
  height: 100%;
`;
const DColumn = styled.div<{ width: string }>`
  width: ${(props) => props.width};
  padding: 0 20px;
`;
const TableButtonContainer = styled.div`
  height: 56px;
`;
export { DRow, DColumn, TableButtonContainer };
