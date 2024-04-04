import { Navigate, useLocation } from 'react-router-dom';
import {
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
} from './styled';
import { Button } from 'components/common/Button/Button';
import { hdoInstance } from 'apis/hdoInstance';
import {
  StyledFormItem,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { Select } from 'antd';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { userAuthState } from 'recoil/authState';
// import { Notification } from 'components/layout/Notification';
import SearchStation from 'components/layout/Station';
import { useEffect, useState } from 'react';
import { alertModalState } from 'recoil/modalState';
import { ChangePassword } from '../ChangePassword/ChangePassword';
import { handleCheckPermisstion } from 'utils/permission';
import { NoitcePopup } from '../NoitcePopup';

interface NavbarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}
export const Navbar = ({ isOpen, toggleSidebar }: NavbarProps) => {
  const [isModalChangePw, setIsModalChangePw] = useState<boolean>(false);
  const setAuthState = useSetRecoilState(userAuthState);
  const [{ user }] = useRecoilState(userAuthState);
  const [selectedOption, setSelectedOption] = useState<string>('로그인');
  const [resetTime, setResetTime] = useState<any>(
    localStorage.getItem('resetTime'),
  );
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  const location = useLocation();
  const url = location.pathname;
  const signOut = async () => {
    try {
      const newData = {
        type: 'LOGOUT',
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
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('resetTime');
      sessionStorage.removeItem('loggedIn');
      localStorage.removeItem('showedNotice');
      setResetTime('0');
      setAuthState({
        isAuthenticated: false,
        user: null,
      });
      setAlertModal({
        ...alertModal,
        open: false, // 모달을 닫음
      });
      return <Navigate to="/login" />;
    } catch (error) {
      console.log('로그아웃 실패 : ', error);
    }
  };
  useEffect(() => {
    if (
      localStorage.getItem('autoLogin') === 'true' &&
      localStorage.getItem('accessToken')
    ) {
      sessionStorage.setItem('loggedIn', 'true');
    } else if (!sessionStorage.getItem('loggedIn')) {
      void signOut();
    }
  }, []);
  useEffect(() => {
    if (user?.Org?.category !== 'CS') {
      const timer = setInterval(() => {
        if (localStorage.getItem('resetTime') === resetTime) {
          const rstime = (
            parseInt(localStorage.getItem('resetTime') ?? '3600000') - 1000
          ).toString();
          setResetTime(rstime);
          localStorage.setItem('resetTime', rstime);
        } else {
          const rstime = (
            parseInt(localStorage.getItem('resetTime') ?? '3600000') - 0
          ).toString();
          setResetTime(rstime);
          localStorage.setItem('resetTime', rstime);
        }
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [resetTime]);

  useEffect(() => {
    if (parseInt(resetTime) === 300000) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'alert',
        title: '상태 변경',
        content: `5분 뒤 세션이 만료됩니다.
      로그인 연장 하시겠습니까?`,
        okText: '예',
        cancelText: '아니요',
        onCancel() {
          setAlertModal({
            ...alertModal,
            open: false, // 모달을 닫음
          });
        },
        onOk() {
          setResetTime('3600000');
          localStorage.setItem('resetTime', '3600000');
          setAlertModal({
            ...alertModal,
            open: false, // 모달을 닫음
          });
        },
      });
    } else if (parseInt(resetTime) < 0) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'alert',
        title: '상태 변경',
        content: `세션이 만료 되었습니다.`,
        cancelText: '확인',
        onCancel() {
          void signOut();
          // localStorage.setItem('resetTime', '3600000');
        },
        isOk: false,
      });
    }
    if (!localStorage.getItem('accessToken')) {
      void signOut();
    }
  }, [resetTime]);

  // 옵션 값이 변경될 때 실행될 함수
  const handleSelectChange = (value: unknown) => {
    if (typeof value === 'string') {
      const currentSelectedOption = selectedOption; // 현재 값을 로컬 변수에 저장
      setSelectedOption(value); // 새로운 값을 설정

      setAlertModal({
        ...alertModal,
        open: true,
        type: 'alert',
        title: '상태 변경',
        content: `${value} 상태로 변경 하시겠습니까?`,
        okText: '변경',
        onCancel() {
          // 취소를 눌렀을 때 로컬 변수의 값을 이용하여 이전 값으로 복원
          setSelectedOption(currentSelectedOption);
          // console.log('취소 클릭', currentSelectedOption);
        },
        onOk() {
          // console.log('변경 클릭');
          setAlertModal({
            ...alertModal,
            open: false, // 모달을 닫음
          });
        },
      });
    }
  };

  useEffect(() => {
    const isCheckPermisstion = handleCheckPermisstion(url, user);
    if (user?.status === 'BLOCK' || isCheckPermisstion) void signOut();
  }, [user]);
  // console.log(user);

  function msToHMS(ms: any = '3600000') {
    // 1- Convert to seconds:
    let seconds = ms / 1000;
    // 2- Extract hours:
    const hours = parseInt((seconds / 3600).toString()); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    const minutes = parseInt((seconds / 60).toString()); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = seconds % 60;
    let result =
      (minutes < 10 ? `0${minutes.toString()}` : minutes.toString()) +
      ':' +
      (seconds < 10 ? `0${seconds.toString()}` : seconds.toString());
    if (result === '00:00' && ms >= 3600000) {
      result = '60:00';
    } else if (ms < 0) {
      result = '00:00';
    }
    return result;
  }

  return (
    <>
      <NavbarWrap>
        <NavbarBox>
          <NavbarLeft>
            <ShowSideButton isOpen={isOpen} onClick={toggleSidebar}>
              <img src="/assets/img/icon/menu-toggle.png" alt="메뉴 아이콘" />
            </ShowSideButton>
            <SearchStation />
          </NavbarLeft>
          <NavbarRight>
            {/* {user?.Org.category === 'CS' && user?.Org.id !== 552 && (
            <StyledFormItem label="상담사 상태" name="category">
              <StyledSelect
                key={selectedOption}
                value={selectedOption} // value prop에 selectedOption을 바인딩
                onChange={handleSelectChange} // 옵션 변경시 이벤트 처리
                defaultValue={selectedOption} // 초기 상태 설정
              >
                <Select.Option key="1" value="대기">
                  대기
                </Select.Option>
                <Select.Option key="2" value="자리비움">
                  자리비움
                </Select.Option>
                <Select.Option key="7" value="후처리">
                  후처리
                </Select.Option>
                <Select.Option key="14" value="휴식">
                  휴식
                </Select.Option>
                <Select.Option key="5" value="식사">
                  식사
                </Select.Option>
              </StyledSelect>
            </StyledFormItem>
          )} */}
            {user?.Org?.category !== 'CS' && <p>{msToHMS(resetTime)}</p>}
            {user?.Org?.category !== 'CS' && (
              <Button
                size="md"
                color="reset"
                alt="비활성"
                onClick={() => {
                  setResetTime('3600000');
                  localStorage.setItem('resetTime', '3600000');
                }}
              >
                로그인 연장
              </Button>
            )}
            <UserLabel>
              {user?.type === 'HDO' && (
                <>
                  <UserTeam>{user?.Person?.ORG1?.toLocaleUpperCase()}</UserTeam>
                  <UserName>{user?.name?.toLocaleUpperCase()}</UserName>
                  <UserName>{user?.Person?.JKW1?.toLocaleUpperCase()}</UserName>
                </>
              )}
              {user?.type === 'ORG' && (
                <>
                  <UserTeam>{user?.Org?.name?.toLocaleUpperCase()}</UserTeam>
                  <UserName>{user?.name?.toLocaleUpperCase()}</UserName>
                </>
              )}
            </UserLabel>
            <UserStatus>
              {user?.type !== 'HDO' && (
                <>
                  <UserAvatar
                    onClick={() => {
                      setIsModalChangePw(true);
                    }}
                  >
                    <img
                      src="/assets/img/icon/icon-user-avatar.png"
                      alt="프로필"
                    />
                  </UserAvatar>

                  <ChangePassword
                    isModalChangePw={isModalChangePw}
                    setIsModalChangePw={setIsModalChangePw}
                  />
                </>
              )}

              {/* <Notification /> */}
              <Logout
                onClick={() => {
                  void signOut();
                }}
              >
                <img src="/assets/img/icon/icon-logout.png" alt="로그아웃" />
              </Logout>
            </UserStatus>
          </NavbarRight>
        </NavbarBox>
      </NavbarWrap>
      <NoitcePopup />
    </>
  );
};
