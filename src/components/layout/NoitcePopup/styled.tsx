import styled from 'styled-components';

const ListFile = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  .nl-filename {
    position: relative;
    padding: 0 10px 0 10px;
    cursor: pointer;
    width: calc(100% / 3 - 15px);
    text-wrap: wrap;
    overflow-wrap: break-word;
    line-height: 18px;

    &:after {
      content: '';
      position: absolute;
      height: 4px;
      width: 4px;
      border-radius: 50%;
      background-color: #333;
      top: 6px;
      left: 0;
    }
  }
`;
const Container = styled.div`
  position: relative;
  padding: 0 20px;
`;
const NextSlide = styled.button`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 40px;
  height: 50px;
  background-image: url(/assets/img/icon/icon-page-next-d.png);
  background-size: 30px;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  background-color: transparent;
  border-radius: 6px;
  &:hover {
    background-color: var(--white);
    border: 1px solid var(--dark-default) !important;
  }
`;
const PrevSlide = styled.button`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 40px;
  height: 50px;
  background-image: url(/assets/img/icon/icon-page-prev-d.png);
  background-size: 30px;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  background-color: transparent;
  border-radius: 6px;
  &:hover {
    background-color: var(--white);
    border: 1px solid var(--dark-default) !important;
  }
`;
const TitleBoard = styled.div`
  overflow-wrap: break-word;
  text-wrap: wrap;
`;
const NoticeBoard = styled.div`
  table tr th {
    width: 120px;
  }
  table tr td {
    width: calc(100% - 120px);
    overflow-wrap: break-word;
    text-wrap: wrap;
    div {
      p {
        white-space: pre;
        text-wrap: wrap;
        }
      }
    }
  }
  .nl-filename {
    max-width: calc(100% / 3 - 10px);
  }
`;

export { ListFile, Container, NextSlide, PrevSlide, TitleBoard, NoticeBoard };
