import styled, { css } from 'styled-components';

export const PermissionGrid = styled.div<{ gridCol?: string }>`
  display: grid;
  gap: 10px;
  grid-template-columns: ${(props) => props.gridCol ?? '1fr 1fr 1fr'};
`;
export const PermissionCol = styled.div<{ permission?: boolean }>`
  & .ant-checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .ant-checkbox-wrapper {
    margin-right: 5px;
  }
  ${(props) => {
    if (props?.permission) {
      return css`
        display: flex;
        flex-direction: column;
        gap: 10px;
        .ant-checkbox-wrapper {
          display: flex;
          font-size: 14px;
          line-height: 40px;
          padding: 0px 10px;
          border-radius: 6px;
          border: 1px solid var(--btn-gray-300);
          color: var(--dark-default);

          flex-direction: row-reverse;
          & span:nth-child(1) {
            margin-left: auto;
          }
        }
      `;
    }
  }}
`;
export const PermissionItem = styled.div`
  padding: 0px 8px;
  border-radius: 6px;
  border: 1px solid var(--btn-gray-300);
  margin-bottom: 5px;
  font-size: 13.5px;
  line-height: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
export const TitleBox = styled.div`
  font-weight: 500;
  margin-bottom: 10px;
`;
