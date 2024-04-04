import styled, { keyframes } from 'styled-components';

export const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 80px 60px;
  gap: 30px;

  width: 500px;
  height: auto;

  background: #ffffff;
  box-shadow: 0px 0px 6px 6px rgba(0, 0, 0, 0.04);
  border-radius: 30px;

  position: absolute;
  /* right: 65%; */
  left: 190px;
`;

const LoginImg = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 360px;
  height: 53px;
  & > img {
    height: 53px;
  }
`;

export function LoginLogo() {
  return (
    <LoginImg>
      <img src="/assets/img/logo_login.png" alt="현대오일뱅크" />
    </LoginImg>
  );
}

export const TogglePassword = styled.span`
  background-image: url('/assets/img/icon/icon-input-view-d.png');
  position: absolute;
  right: 0;
  bottom: -1px;
  margin-bottom: 0;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-size: 18px;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 10;
  cursor: pointer;
  opacity: 0.3;
  &:hover {
    opacity: 1;
  }
`;

// 애니메이션

const Station = styled.div`
  position: absolute;
  right: 0;
  padding-top: 130px;
`;

const CarAnimation = keyframes`
  0% {
        right: 653px;
        bottom: 130px;
    }
  100% {
      right: 480px;
      bottom: 200px;
  }
`;

const CarImg = styled.img`
  position: absolute;
  right: 480px;
  bottom: 200px;
  animation: ${CarAnimation} 10s ease-in-out alternate;
`;

const ChargingStation = styled.img`
  width: 1222px;
`;

export function StationAnimation() {
  return (
    <Station>
      <CarImg src="/assets/img/car.png" alt="자동차" />
      <ChargingStation
        src="/assets/img/charging_station.png"
        alt="충전소 이미지"
      />
    </Station>
  );
}

export const TabWrap = styled.div<{
  type: 'login' | 'content';
}>`
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
`;

export const TabMenu = styled.ul`
  display: flex;
`;

export const TabMenuTitle = styled.li<{ active: boolean }>`
  width: 50%;
  background-color: ${(props) => (props.active ? `white` : `var(--gray-100)`)};
  border-color: ${(props) =>
    props.active ? `#dee2e6 #dee2e6 #fff` : `transparent`};
  color: ${(props) =>
    props.active ? `var(--dark-default)` : `var(--gray-500)`};
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  border-radius: 0;
  padding: 0 10px;
  line-height: 50px;
  margin-bottom: -1px;
  border-width: 1px;
  border-style: solid;
  display: block;
  text-decoration: none;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out;
  cursor: pointer;
`;

export const TabPane = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const AutoLoginWrap = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export const SearchIdPassword = styled.div`
  display: flex;
  width: 80%;
  justify-content: flex-end;
  & > p {
    font-size: 14px;
    line-height: 17px;
    display: flex;
    align-items: center;
    text-align: center;
    color: #747272;
    cursor: pointer;
  }
`;

export const TabContent = styled.div`
  width: 100%;
  height: calc(100% - 60px);
`;

export const ErrorMessage = styled.span`
  position: absolute;
  color: var(--red);
  left: 50%;
  transform: translate(-50%, 100%);
`;
