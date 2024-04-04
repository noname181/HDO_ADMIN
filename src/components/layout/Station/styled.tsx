import styled, { css } from 'styled-components';

const NavbarSearch = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 20px;
  gap: 10px;
  width: 400px;
  height: 34px;
  background: #f1f3f5;
  border-radius: 50px;
  & > img {
    width: 16px;
    height: 16px;
  }
  & > input {
    background-color: transparent;
    border: none;
    font-weight: 400;
    font-size: 14px;
    line-height: 40px;
    color: #747272;
    padding: 0;
    width: 100%;
    &:focus {
      background-color: transparent;

      outline: 0;
      box-shadow: none;
    }
    &::placeholder {
      color: #747272;
    }
  }
  & > input:focus {
    outline: 0;
    box-shadow: none;
  }
`;
const SearchModel = styled.div`
  position: absolute;
  top: 47px;
  right: 0;
  left: 0;
  background-color: #fff;
  border-radius: 10px;
  min-width: 300px;
  box-shadow: 3px 3px 12px rgba(0, 0, 0, 0.12);
  overflow-y: hidden;
  padding: 10px 0;
  z-index: 1990;
`;
const ListStation = styled.div<{ isOpen?: boolean }>`
  max-height: 310px;
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
const ItemRow = styled.div<{ isActive?: boolean; isEmpty?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  &:hover {
    background: #f9f9f9;
  }
  &:not(:first-child) {
    border-top: 1px solid var(--btn-gray-200);
  }
  ${(props) => {
    if (props.isActive)
      return css`
        background: var(--btn-gray-100);
      `;
  }}
  ${(props) => {
    if (props.isEmpty)
      return css`
        justify-content: center;
        min-height: 60px;
      `;
  }}
`;
const ItemRowHead = styled.div`
  display: flex;
  padding: 10px 20px 0;
`;
const ItemRowBody = styled.div`
  display: flex;
  padding: 4px 20px 10px;
  flex-wrap: nowrap;
`;
const Column = styled.div`
  color: var(--btn-gray-400);
  // &:nth-child(1) {
  //   width: calc(100% - 100px);
  //   text-align: left;
  // }
  // &:nth-child(2) {
  //   width: 100px;
  //   text-align: right;
  // }
`;
const ItemColumn = styled.div<{ col: string; status?: any }>`
  ${(props) => {
    if (props.col === 'left') {
      return css`
        width: calc(100% - 80px);
      `;
    } else {
      if (props.status === 'INACTIVE') {
        return css`
          width: 80px;
          padding-right: 20px;
          text-align: right;
          color: var(--red);
        `;
      } else
        return css`
          width: 80px;
          padding-right: 20px;
          text-align: right;
          color: #00ae42;
        `;
    }
  }}
`;

export {
  NavbarSearch,
  SearchModel,
  ListStation,
  ItemRow,
  ItemColumn,
  Column,
  ItemRowHead,
  ItemRowBody,
};
