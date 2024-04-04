import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    border: 0;

    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;

    font-family: 'Pretendard', sans-serif !important;
  }

  *,
  *::before,
  *::after {
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    /* scroll */
    /* IE and Edge */
    // -ms-overflow-style: none;
    /* Firefox */
    // scrollbar-width: none;
  }

  // *::-webkit-scrollbar {
  //   /* Chrome, Safari, Opera */
  //   display: none;
  //   /* width: 8px; */
  // }

  /* *::-webkit-scrollbar-thumb {
    height: 10%;
    background: var(--blue-200);
    border-radius: 10px;
  }

  *::-webkit-scrollbar-track {
    background: var(--btn-gray-100);
  } */

  html {
    width: 100%;
    height: 100%;
    scroll-behavior: smooth;
    overflow-y: hidden;
  }
  
  dl, ol, ul{
    margin: 0;
    padding: 0;
  }
  li{
    list-style: none;
  }

  h1,h2,h3,h4,h5,h6{
    margin-bottom: 0;
  }

  a{
    text-decoration: none;
  }
  a:focus{
    outline: none !important;
    box-shadow: none !important;
  }

  ::placeholder{
    font-weight: 600;
    font-family: 'Pretendard', sans-serif;
  }
  .ant-select-selection-placeholder {
    font-weight: 600;
  }

  input::placeholder {
    color: #CDD0D3;
  }

  textarea::placeholder {
    color: #CDD0D3;
  }
  
  .d-flex {
    display: flex;
  }

  .justify-content-between {
    justify-content: space-between;
  }

  .align-items-center {
    align-items: center;
  }

  /** --------------------------------
-- Color
-------------------------------- */

  :root {
    --dark-default: #484848;
    --gray-100: #F1F3F5;
    --gray-200: #DBE0E9;
    --gray-300: #9B9FA3;
    --gray-400: #8A8A8A;
    --gray-500: #747272;
    --blue-100: #339DFF;
    --blue-200: #0D6EFD;
    --blue-300: #0555CC;
    --blue-400: #1E57C1;
    --blue-500: #002F87;
    --blue-600: #002568;
    --btn-gray-100: #F1F7FD;
    --btn-gray-200: #EFF0F4;
    --btn-gray-300: #CDD0D3;
    --btn-gray-400: #A5A8B1;
    --btn-disabled-gray-bg: #EFF0F4;
    --white: #ffffff;
    --red: #E92C2C;
    --navbar-bg-color: #ffffff;
    --sidebar-bg-color: #ffffff;
    --sidebar-width: 200px;
    --navbar-height: 60px;
  }
  
  .red {
    color: var(--red)
  }
  .nl-lbl {
    font-weight: bold;
    line-height: 40px;
  }
  .nl-card {

  }
  .nl-card-info {
    padding: 20px 24px;
    border: 1px solid var(--gray-200);
    border-radius: 8px 8px 0 0 ;
    display: flex;
  }
  .nl-card-info>div:nth-child(2) {
    padding-left: 20px;
  }
  .nl-card-logo {
    width: 120px;
    height: 60px;
    border: 1px solid var(--gray-100);
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .nl-card-logo img {
    max-width: 100%;
    height: 40px;
  }
  .nl-card-number {
    font-weight: 500;
    margin-bottom: 10px;
  }
  .nl-card-date {
    color:  var(--gray-400);
  }
  .nl-card-action {
    padding: 20px 24px;
    border: 1px solid var(--gray-200);
    border-top: 0;
    border-radius:  0 0 8px 8px;
    display: flex;
    justify-content: space-between;
  }
  .nl-card-action>div:nth-child(2) {
    color: var(--blue-200);
  }
  .nl-ip-pw {
    position: relative;
    &>span {
      top: 29px;
    }
  }
  .nl-list-image {
    display: flex;
    gap: 14px;
    overflow-x: auto;
  }
  .nl-list-image img {
    width: auto;
    height: 100px;
    display: block;
    border: 1px solid var(--btn-gray-300);
    border-radius: 6px;
  }
  .nl-filename {
    text-wrap: wrap;
    overflow-wrap: break-word;
    line-height: 18px;
    margin-top: 4px;
  }
  .nl-table-detail {
    border-collapse: collapse;
    border: 1px solid rgb(205, 208, 211);
    th,
    td {
      border: 1px solid rgb(205, 208, 211);
      padding: 10px;
      height: 61px;
      font-size: 14px;
      // width: 33%;
    }
    th {
      background-color: #f1f3f5;
      width: 120px;
      text-align: left;
      font-weight: 600;
    }
    .ant-form-item {} 
    .ant-row.ant-form-item-row .ant-form-item-explain-error {
      position: static;
    }
     
  }
  .ant-picker-dropdown {
    z-index: 10002 !important;
  }
`;
