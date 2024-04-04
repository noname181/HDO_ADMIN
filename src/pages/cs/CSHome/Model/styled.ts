import styled, { css } from 'styled-components';

export const CPHContainer = styled.div`
  max-height: calc(100vh - 350px);
  overflow-y: scroll;
  .nl-lbl {
    color: #484848;
    font-weight: 500;
    font-size: 14px;
    line-height: 40px;
    margin-bottom: 0;
    margin-top: 0;
  }
  .nl-tbl-detail {
    border-collapse: collapse;
    border: 1px solid rgb(205, 208, 211);
    width: 100%;
    margin-bottom: 20px;
    table-layout: fixed;
    tr {
      th,
      td {
        border: 1px solid rgb(205, 208, 211);
        padding: 10px;
        height: 40px;
        font-size: 14px;
        white-space: initial;
      }
      th {
        width: 120px;
        background-color: #f1f3f5;
      }
      td {
        width: calc(100% / 3 - 120px);
        input {
          height: 40px;
        }
      }
    }
  }
  .nl-tbl-vertical {
    border-collapse: collapse;
    border: 1px solid rgb(205, 208, 211);
    width: 100%;
    margin-bottom: 20px;
    table-layout: fixed;
    tr {
      th,
      td {
        border: 1px solid rgb(205, 208, 211);
        padding: 10px;
        height: 40px;
        font-size: 14px;
        white-space: initial;
      }
      th {
        background-color: #f1f3f5;
      }
    }
  }
  .nl-form-control {
    height: 40;
    font-weight: 500;
    font-size: 14;
    line-height: 40px;
    padding: 0px 10px;
    border-radius: 6;
    background-color: '#fff';
    border: 1px solid #cdd0d3;
    color: #484848;
    width: 100%;
    border-radius: 6px;
  }
  .ant-form-item-explain-error {
    position: static !important;
  }
`;
