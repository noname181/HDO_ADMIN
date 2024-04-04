import { type ReactNode } from 'react';
import styled, { css } from 'styled-components';
export const ItemContainer = styled.div<{
  width?: string;
  height?: string;
  minHeight?: string;
}>`
  width: ${(props) => props.width ?? '100%'};
  background-color: var(--white);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 14px;
  height: ${(props) => props.height ?? 'calc(100vh - 9.8rem)'};
  overflow-y: scroll;
  min-height: ${(props) => props.minHeight ?? 'unset'};

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
export const ItemBody = styled.div`
  display: flex;
  width: 100%;
`;
export const InputBox = styled.input<{
  width?: string;
  margin?: string;
}>`
  width: ${(props) => props.width ?? '100%'};
  margin: ${(props) => props.margin ?? '0'};
  height: 40px;
  font-weight: 500;
  font-size: 14px;
  line-height: 40px;
  padding: 0px 10px;
  border-radius: 6px;
  border: 1px solid var(--btn-gray-300);
  color: var(--dark-default);
  & .antitem-row {
    justify-content: unset;
  }
  &:focus,
  &:hover {
    border-color: #4096ff;
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
    border-inline-end-width: 1px;
    outline: 0;
  }
  &:hover {
    transition: all 0.2s;
  }
  ${(props) =>
    props.readOnly &&
    css`
      background-color: var(--btn-gray-100);
      color: #8f9295;
      border: none;
      box-shadow: none;
      &:focus {
        border-color: none;
        box-shadow: none;
        border-inline-end-width: none;
        outline: 0;
      }
    `}
  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;
      background-color: #f3f3f5 !important;
      border: none !important;
    `}
`;
export const ItemSide = styled.div<{
  right?: string;
}>`
  flex: 1;
  margin-right: ${(props) => props.right ?? '0'};
`;
export const ItemForm = styled.div<{
  paddingBottom?: string;
  paddingTop?: string;
}>`
  display: flex;
  justify-content: start;
  padding-bottom: ${(props) => props.paddingBottom ?? 'unset'};
  padding-top: ${(props) => props.paddingTop ?? '0'};
`;
interface FilterProps {
  title: string;
}
export const Title = ({ title }: FilterProps) => {
  return (
    <label
      style={{
        width: '150px',
        minWidth: '150px',
        color: 'var(--dark-default)',
        fontWeight: '500',
        marginTop: '12px',
      }}
    >
      {title}
    </label>
  );
};
// export const FormSelect = styled.div`
//   width: 100%;
//   background: #fff;
//   padding: 20px;
//   min-height: 162px;
//   border: 1px solid #cdd0d3;
//   border-radius: 6px;
//   position: relative;
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 10px 0;
// `;
interface FormSelectProps {
  disabled?: boolean;
  readonly?: boolean;
  children?: ReactNode;
  minHeight?: string;
}
export const FormSelect = ({
  disabled,
  readonly,
  children,
  minHeight,
}: FormSelectProps) => {
  return (
    <div
      style={{
        width: '100%',
        background: disabled ? '#F3F3F5' : '#fff',
        padding: '20px',
        minHeight: minHeight ?? '162px',
        border: disabled ? 'unset' : '1px solid #cdd0d3',
        borderRadius: '6px',
        position: 'relative',
      }}
    >
      {!readonly ? (
        <div
          style={{
            display: disabled ? 'none' : 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px 0',
          }}
        >
          {children}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
interface EffectProps {
  operation: boolean;
}
export const Effect = ({ operation = false }: EffectProps) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10px',
        right: '15px',
        cursor: 'pointer',
        display: operation ? 'none' : 'block',
      }}
    >
      <span style={{ color: '#8A8A8A' }}>선택 삭제</span>
      <span style={{ marginLeft: '5px', color: '#0D6EFD' }}>저장</span>
    </div>
  );
};
