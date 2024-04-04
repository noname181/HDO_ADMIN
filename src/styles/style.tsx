import { type ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { Select, Spin } from 'antd';
import { Button } from 'components/common/Button/Button';
import {
  ButtonGroup,
  TableButtonWrap,
} from 'components/common/Button/Button.styled';
import { Label, LabelWrap } from 'components/common/Form/Form';
import {
  StyledRadio,
  StyledRadioBtn,
  StyledSearch,
  StyledSelect,
  StyledInput,
} from 'components/common/test/Styled.ant';
import PropTypes from 'prop-types';
// AUIGrid 엑셀, PDF 바로 다운로딩 처리 모듈
import FileSaver from 'file-saver';
// AUIGrid PDF 처리 모듈
import type AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { userAuthState } from 'recoil/authState';
import { useRecoilState } from 'recoil';
import { hdoInstance } from 'apis/hdoInstance';

const Body = styled.div<{ login?: boolean }>`
  width: 100%;
  // min-width: ${(props) => (props.login ?? false ? '1920px' : '1440px')};
  min-width: 1920px;
  height: 100vh;
  margin: 0;
  position: relative;
  font-family: 'Pretendard', sans-serif;
  color: #191919;
  background-color: #eef0f4;
  font-weight: 400;
  font-size: 0.925rem;
  min-height: 100%;
  zoom: 1;
  /* padding: 14px; */
  white-space: nowrap;
  & *,
  *::before,
  *::after {
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .nl-custom-radio .ant-radio-wrapper::after {
    display: none;
  }
`;

const Container = styled.div<{ login?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  padding: 14px;
  gap: 14px;
  ${(props) =>
    (props.login ?? false) &&
    css`
      position: relative;
      align-items: center;
      background-image: url(/assets/img/login-background.png);
      background-size: cover;
      background-color: #eef0f4;
      padding: 0;
      gap: 0;
    `}
`;

const ContentWrap = styled.section<{ isOpen: boolean }>`
  height: 100%;
  /* transition: width 0.3s ease-in-out; */
  width: ${(props) => (props.isOpen ? 'calc(100% - 214px)' : '100%')};
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  // padding: 14px 0 0;
  margin-top: 14px;
  gap: 14px;
  height: calc(100% - 54px);
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

// 공통
export const FormGrid = styled.div`
  display: grid;
  gap: 10px 20px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;

interface FilterProps {
  children: ReactNode;
  isModal?: boolean;
  sttAdmin?: boolean;
  isBiz?: boolean;
}

const FilterBox = styled.div<{ sttAdmin: boolean }>`
  background-color: var(--white);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: ${(props) => (props.sttAdmin ? '0' : '14px')};
  width: 100%;
`;

const FilterGrid = styled.div<{ isModal: boolean; isBiz?: boolean }>`
  display: grid;
  align-items: center;
  gap: 10px 20px;
  grid-template-columns: ${(props) =>
    props.isModal ? '1fr 1fr 1fr' : '1fr 1fr 1fr 1fr'};
  ${(props) =>
    props.isBiz &&
    css`
      gap: 10px 5rem;
      align-items: unset;
    `}
`;

export const Filter = ({
  children,
  isModal = false,
  sttAdmin = false,
  isBiz,
}: FilterProps) => {
  return (
    <FilterBox sttAdmin={sttAdmin}>
      <FilterGrid isModal={isModal} isBiz={isBiz}>
        {children}
      </FilterGrid>
    </FilterBox>
  );
};

export const GridContainer = styled.div<{
  width?: string;
  height?: string;
  minHeight?: string;
  marginTop?: string;
  containTable?: boolean;
  istopbutton?: boolean;
}>`
  position: relative;
  width: ${(props) => props.width ?? '100%'};
  background-color: var(--white);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 14px;
  height: ${(props) => props.height ?? '773px'};
  overflow-y: scroll;
  min-height: ${(props) => props.minHeight ?? 'unset'};
  margin-top: ${(props) => props.marginTop ?? '0'};

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

  ${(props) =>
    props.containTable &&
    css`
      & > div {
        height: 100%;
      }
    `}
`;
export const AUIGridContainer = styled.div<{
  isTableButton?: boolean;
  from?: string;
}>`
  position: relative;
  & > div {
    height: 100%;
  }
  ${(props) =>
    props.isTableButton &&
    css`
      height: calc(100% - 56px);
    `}
  ${(props) =>
    props.from === 'settlementDetail' &&
    css`
      height: calc(100% - 56px - 120px);
    `}
`;
export { Body, Container, ContentWrap, Content };

interface GridHeaderProps {
  container?: boolean;
  between?: boolean;
  children?: React.ReactNode;
  grid?: boolean;
}

const GridHeaderContainer = styled.div<{ container?: boolean }>`
  background-color: var(--white);
  width: 100%;
  ${(props) =>
    props.container &&
    css`
      padding: 20px;
      border-radius: 10px;
    `}
`;

const GridHeaderWrap = styled.div<{ between?: boolean; grid?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.between ? 'space-between' : '')};
  gap: 10px 20px;

  ${(props) =>
    props.grid &&
    css`
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
    `}
`;

export const GridHeader = ({
  container,
  between,
  children,
  grid,
}: GridHeaderProps) => {
  return (
    <GridHeaderContainer container={container}>
      <GridHeaderWrap between={between} grid={grid}>
        {children}
      </GridHeaderWrap>
    </GridHeaderContainer>
  );
};

export const GridRefetch = ({ refetch, reload, call }: any) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
      <Button
        size="md"
        color="sub"
        icon="/assets/img/icon/icon-reset-blue.png"
        onClick={reload}
      />
      <Button
        size="md"
        color="secondary"
        icon="/assets/img/icon/icon-search-blue.png"
        alt="search"
        onClick={refetch}
      />
      {/* <Button
        size="md"
        color="primary"
        icon="/assets/img/icon/icon-customer-service-a.png"
        alt="search"
        onClick={call}
      /> */}
    </div>
  );
};

export const DefaultDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

type GridHeaderItemType = 'radio' | 'search' | 'select' | 'input';
export interface GridHeaderItemChildren {
  label: string;
  value: string;
}

export interface GridHeaderItemProps {
  type: GridHeaderItemType;
  label: string;
  value?: any;
  onChange?: any;
  placeholder?: string;
  listData?: GridHeaderItemChildren[];
  onKeyDown?: any;
}

export const GridHeaderItem = ({
  type,
  label,
  value,
  onChange,
  placeholder,
  listData,
  onKeyDown,
}: GridHeaderItemProps) => {
  return (
    <LabelWrap label={label}>
      {type === 'radio' && (
        <StyledRadio value={value} onChange={onChange}>
          {listData?.map((item) => (
            <StyledRadioBtn key={item.value} value={item.value}>
              {item.label}
            </StyledRadioBtn>
          ))}
        </StyledRadio>
      )}
      {type === 'search' && (
        <StyledSearch
          placeholder={placeholder}
          size="large"
          value={value}
          onSearch={onChange}
        />
      )}
      {type === 'select' && (
        <StyledSelect value={value} onChange={onChange}>
          {listData?.map((item) => (
            <Select.Option key={item.value} value={item.value}>
              {item.label}
            </Select.Option>
          ))}
        </StyledSelect>
      )}
      {type === 'input' && (
        <StyledInput
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      )}
    </LabelWrap>
  );
};
interface IProps {
  myGrid: any;
  xlsxProps: any;
  excelText?: string;
  label?: string;
}

declare global {
  interface Window {
    saveAs: any;
  }
}

// FileSaver 전역처리화
window.saveAs = FileSaver.saveAs;
interface GridButtonProps {
  children?: React.ReactNode;
  label?: string;
  onExcel?: (value?: any) => void;
  onDelete?: (value?: any) => void;
  onReload?: (value?: any) => void;
  excelText?: string;
  deleteText?: string;
  myGrid: any;
  isExcel?: boolean;
}

export const GridButton = ({
  children,
  label = '',
  onExcel,
  excelText = '엑셀 다운로드',
  onDelete,
  deleteText = '삭제',
  isExcel = true,
  // isExcel,
  myGrid,
  onReload,
}: GridButtonProps) => {
  const [{ user }] = useRecoilState(userAuthState);

  function getCurrentDateTime() {
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}`;
  }

  // 엑셀로 내보내기
  const exportClick = () => {
    const grid = myGrid.current as AUIGrid;
    // const date: Date = new Date();
    // const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
    // const day: string = date.getDate().toString().padStart(2, '0');
    // const hour: string = date.getHours().toString().padStart(2, '0');
    // const minute: string = date.getMinutes().toString().padStart(2, '0');
    // const formattedDate: string =
    //   date.getFullYear().toString() + month.toString() + day + hour + minute;

    const name = label + '_' + getCurrentDateTime();
    // console.log(formattedDate);
    // 내보내기 실행
    grid.exportToXlsx({ fileName: name, progressBar: true });
    const newData = {
      type: 'EXCEL_DOWNLOAD',
    };
    const accessToken = localStorage.getItem('accessToken') ?? '';
    const axios = hdoInstance();
    axios
      .post(`/users/logs`, newData, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
        },
      })
      .then((res: any) => {})
      .catch((err) => {
        console.log('error-', err);
      });
  };
  return (
    <TableButtonWrap>
      <ButtonGroup>
        {label !== undefined && <Label width={'none'}>{label}</Label>}
        {isExcel &&
          user?.Org.category !== 'CS' &&
          user?.Org.category !== 'AS' && (
            <Button
              size="md"
              color="reset"
              icon="/assets/img/icon/icon-excel.png"
              alt="엑셀"
              onClick={exportClick}
            >
              {excelText}
            </Button>
          )}
        {onReload && (
          <Button
            size="md"
            color="reset"
            onClick={onReload}
            style={{ marginRight: 'auto' }}
          >
            새로고침
          </Button>
        )}
      </ButtonGroup>
      <ButtonGroup>
        {onDelete !== undefined && (
          <Button
            size="md"
            color="reset"
            icon="/assets/img/icon/icon-trash.png"
            onClick={onDelete}
          >
            {deleteText}
          </Button>
        )}
        {children}
      </ButtonGroup>
    </TableButtonWrap>
  );
};

const SpinnerGroup = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  z-index: 199;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
`;

type sizeType = 'small' | 'default' | 'large' | undefined;
interface sizeProps {
  size?: sizeType;
}
export const Spinner = ({ size = 'large' }: sizeProps) => {
  return (
    <SpinnerGroup>
      <Spin size={size} />
    </SpinnerGroup>
  );
};
