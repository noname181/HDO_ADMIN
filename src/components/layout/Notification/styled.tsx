import styled from 'styled-components';

const NoticeBell = styled.div`
  position: relative;

  & > img {
    height: 20px;
  }
`;

const AlertCircle = styled.span`
  box-sizing: border-box;
  position: absolute;
  left: 53.33%;
  right: 0%;
  top: 0%;
  bottom: 53.33%;
  background: #e92c2c;
  border: 1.5px solid #ffffff;
  border-radius: 10px;
  pointer-events: none;
`;
const ItemEmpty = styled.div`
  padding: 10px 20px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const NoticeList = styled.div`
  position: absolute;
  top: 43px;
  right: -58px;
  background-color: #fff;
  border-radius: 10px;
  min-height: 100px;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 3px 3px 12px rgba(0, 0, 0, 0.12);
  z-index: 199;
  max-height: 600px;
  overflow-y: auto;
`;
export { NoticeBell, AlertCircle, ItemEmpty, NoticeList };
