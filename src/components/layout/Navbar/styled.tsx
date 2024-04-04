import styled, { css } from 'styled-components';

const NavbarWrap = styled.nav`
  background-color: var(--navbar-bg-color) !important;
  border: none !important;
  border-radius: 10px;
  padding: 10px 20px;
  height: var(--navbar-height);
  width: auto;
  display: flex;
  justify-content: space-between;
`;
const NavbarBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 0;
  width: 100%;
`;

const NavbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ShowSideButton = styled.div<{ isOpen: boolean }>`
  width: 18px;
  height: 18px;
  display: grid;
  align-items: center;
  cursor: pointer;
  & > img {
    width: 18px;
    ${(props) =>
      !props.isOpen &&
      css`
        transform: rotate(180deg);
      `}
  }
`;

const NavbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  .ant-form-item {
    margin-bottom: 0;
    width: 220px;
    .ant-form-item-label > label {
      height: 40px;
    }
  }
  .ant-row.ant-form-item-row {
    display: grid;
    grid-template-columns: auto calc(100% - 90px);
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding-bottom: unset;
    padding-top: 0;
  }
  .nl-ctn-change-pw .ant-form-item {
    width: 100%;
  }
  .nl-ctn-change-pw .ant-row.ant-form-item-row {
    grid-template-columns: auto calc(100% - 120px);
  }
`;

const UserLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 4px;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
`;

const UserTeam = styled.span`
  color: var(--gray-300);
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
`;
const UserName = styled.span`
  color: var(--dark-default);
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
`;

const UserStatus = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  gap: 20px;
  & > a {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const UserAvatar = styled.div`
  cursor: pointer;
  img {
    width: 20px;
  }
`;

const Logout = styled.div`
  cursor: pointer;
  & > img {
    width: 18px;
  }
`;

export {
  NavbarWrap,
  NavbarBox,
  NavbarLeft,
  NavbarRight,
  ShowSideButton,
  UserLabel,
  UserTeam,
  UserName,
  UserStatus,
  UserAvatar,
  Logout,
};
