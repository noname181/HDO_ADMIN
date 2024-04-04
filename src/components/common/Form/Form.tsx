import styled, { css } from 'styled-components';

interface LabelWrapProps {
  label: string;
  isVertical?: boolean;
  isRequired?: boolean;
  width?: number | string;
  requiredMark?: boolean;
  children: React.ReactNode;
}

const LabelForm = styled.div<{ isVertical?: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
  position: relative;
  & .ant-input-affix-wrapper {
    border-radius: 6px !important;
    height: 40px;
  }
  & .ant-btn {
    // background: var(--blue-200);
    border: 0;
    position: absolute;
    right: 1px;
    top: 1px;
    bottom: 1px;
    z-index: 9;
    border-radius: 6px;
    height: 38px !important;
  }
  & > input {
    width: calc(100% - 150px);
  }
  ${(props) =>
    props.isVertical &&
    css`
      &:first-child {
        margin-top: 0px;
      }
      margin-top: 20px;
      flex-direction: column;
      align-items: flex-start;
      & > label {
        line-height: 14px;
        width: 100%;
      }
    `}
`;

export const Label = styled.label<{ width?: number | string }>`
  color: var(--dark-default);
  font-weight: 500;
  font-size: 14px;
  line-height: 40px;
  margin-bottom: 0;
  width: ${(props) => props.width ?? '140px'};
`;

const RequiredMark = styled.span`
  color: var(--red);
  padding-left: 4px;
`;

export const LabelWrap = ({
  label,
  isVertical,
  isRequired,
  children,
  width,
  requiredMark = true,
}: LabelWrapProps) => {
  return (
    <LabelForm isVertical={isVertical}>
      <Label width={width}>
        {label}
        {isRequired && requiredMark && <RequiredMark>*</RequiredMark>}
      </Label>
      {children}
    </LabelForm>
  );
};

export const FormFooterWrap = styled.div`
  border-top: none;
  justify-content: right;
  gap: 10px;
  padding-top: 20px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-shrink: 0;
  align-items: right;
  border-bottom-right-radius: calc(0.3rem - 1px);
  border-bottom-left-radius: calc(0.3rem - 1px);
  & > button {
    margin: 0;
    min-width: 65px;
  }
`;
