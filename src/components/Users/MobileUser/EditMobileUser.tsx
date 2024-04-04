import { type Dispatch, type SetStateAction, useState, useEffect } from 'react';
import { Form, Select, DatePicker } from 'antd';
import { putApi } from 'apis/putApi';
// 스타일
import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledSelect,
  StyledRadio,
  StyledRadioBtn,
} from 'components/common/test/Styled.ant';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { type MobileInterface } from 'interfaces/Test/IUser';
import { type StateInterface } from 'interfaces/ICommon';
import { Button } from 'components/common/Button/Button';
import dayjs from 'dayjs';
import { CPHContainer } from '../../../pages/cs/CSHome/Model/styled';
import axios from 'axios';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { hdoInstance } from 'apis/hdoInstance';
import moment from 'moment';
interface ModalProps {
  state: StateInterface;
  setState: (param: any) => void;
  isEditOpen: boolean;
  setIsEditOpen: (param: any) => void;
  setIsCarManagerOpen: (param: any) => void;
  setUserid: Dispatch<SetStateAction<number | ''>>;
  userId: number | '';
  queryState: any;
  refetch: () => void;
}

export const EditMobileUser = ({
  state,
  setState,
  isEditOpen,
  setIsEditOpen,
  setUserid,
  setIsCarManagerOpen,
  userId,
  queryState,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [disableButton, setdisableButton] = useState(false);
  const open = useDaumPostcodePopup();
  const [appleLinkDate, setAppleLinkDate] = useState('-');
  const [googleLinkDate, setGoogleLinkDate] = useState('-');
  const [naverLinkDate, setNaverLinkDate] = useState('-');
  const [kakaoLinkDate, setKakaoLinkDate] = useState('-');

  async function onOpenPopUp() {
    open({
      onComplete: (data) => {
        handleComplete(data);
      },
    })
      .then((data) => {})
      .catch((error) => {
        // Handle errors if needed
        console.error(error);
      });
  }
  const handleComplete = (data: any) => {
    // console.log(data);
    form.setFieldsValue({
      address: data.address,
      zipCode: data.zonecode,
    });
  };
  function handleOpenDaumPopUp() {
    void onOpenPopUp();
  }
  function handleCloseModal() {
    setIsEditOpen(false);
    setUserid('');
    form.resetFields();
  }
  function OpenCarManager() {
    setIsCarManagerOpen(true);
  }

  const { loading, error, data, getDetail } =
    useGetDataWtTrigger<MobileInterface>();

  useEffect(() => {
    // bannereventId를 받아오면 api 호출
    if (userId !== '') {
      void getDetail({
        url: `/v1/web/users/${userId}`,
      });
    }
  }, [userId]);

  useEffect(() => {
    setAppleLinkDate('-');
    setGoogleLinkDate('-');
    setNaverLinkDate('-');
    setKakaoLinkDate('-');
    if (data) {
      const googleAcc = data?.userOauths?.find(
        (item: any) => item.provider === 'GOOGLE',
      );
      if (googleAcc)
        setGoogleLinkDate(
          moment(googleAcc.createdAt, 'YYYY-MM-DD HH:mm:ss').format(
            'YYYY.MM.DD',
          ),
        );
      const appleAcc = data?.userOauths?.find(
        (item: any) => item.provider === 'APPLE',
      );
      if (appleAcc)
        setAppleLinkDate(
          moment(appleAcc.createdAt, 'YYYY-MM-DD HH:mm:ss').format(
            'YYYY.MM.DD',
          ),
        );
      const naverAcc = data?.userOauths?.find(
        (item: any) => item.provider === 'NAVER',
      );
      if (naverAcc)
        setNaverLinkDate(
          moment(naverAcc.createdAt, 'YYYY-MM-DD HH:mm:ss').format(
            'YYYY.MM.DD',
          ),
        );
      const kakaoAcc = data?.userOauths?.find(
        (item: any) => item.provider === 'KAKAO',
      );
      if (kakaoAcc)
        setKakaoLinkDate(
          moment(kakaoAcc.createdAt, 'YYYY-MM-DD HH:mm:ss').format(
            'YYYY.MM.DD',
          ),
        );
    }
  }, [data]);

  // api 호출 후 data를 받아오면 실행
  useEffect(() => {
    if (data !== null) {
      // 모달 열림
      setdisableButton(!(data?.vehicles?.length > 0));
      // console.log(data?.vehicles?.length > 0);
      form.setFieldsValue({
        status: data?.status,
        name: data?.name,
        phoneNo: data?.phoneNo,
        accountId: data?.accountId,
        email: data?.email,
        birth: data?.birth ? dayjs(data?.birth) : '',
        gender: data?.gender ? data?.gender : '1',
        zipCode: data?.zipCode,
        address: data?.address,
        detailAddress: data?.detailAddress,
      });
      // setIsEditOpen(true);
    }
  }, [data]);
  const handleResetPassword = async () => {
    await getDetail({
      url: `/v1/web/users/${userId}`,
    });
    setAlertModal({
      ...alertModal,
      open: true,
      type: 'alert',
      title: '초기화',
      content: String(data?.phoneNo) + ' 로 임시 비밀번호를 전송하시겠습니까?',
      okText: '확인',
      onOk() {
        setAlertModal({
          ...alertModal,
          open: false,
        });
        void resetUserPassword(data?.phoneNo);
      },
    });
  };
  const resetUserPassword = async (phone: any) => {
    const url = '/v1/web/auth/reset-password';
    const data = {
      user_id: form.getFieldValue('accountId'),
      phoneNo: phone,
    };
    const accessToken = localStorage.getItem('accessToken') ?? '';

    const axios = hdoInstance();
    await axios
      .put(url, data, {
        headers: {
          Authorization: accessToken,
        },
      })
      .then((result) => {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'success',
          title: '저장 상태 알림',
          content: '회원 비밀번호가 초기화 되었습니다.',
          okText: '확인',
        });
      })
      .catch((error) => {
        console.log(error);
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: '저장 상태 알림',
          content: '회원 비밀번호 초기화에 실패했습니다. 관리자에게 문의하세요',
          okText: '확인',
        });
      });
  };
  function onSearchAddress(address: string) {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${address}&analyze_type=simmilar&size=15&page=1`;
    if (address) {
      axios
        .get(url, {
          headers: {
            Authorization: 'KakaoAK b56e43936b4c0602e01dcf52949c0512',
          },
        })
        .then((result: any) => {
          const addreses = result?.data?.documents;
          var next = true;
          if (addreses.length > 0) {
            addreses.forEach(function (address: any) {
              if (address.road_address_name) {
                next = false;
              }
            });
          }
          // if (addreses.length > 0 && !next) {
          // } else {
          // }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setTimeout(() => {}, 500);
    }
  }
  async function onFinish(values: any) {
    const editData = {
      status: values.status,
      name: values.name,
      phoneNo: values.phoneNo,
      // accountId: values?.accountId,
      email: values?.email,
      // password: values.password,
      gender: values?.gender,
      birth: values?.birth,
      zipCode: values?.zipCode,
      address: values?.address,
      detailAddress: values?.detailAddress,
    };
    await putApi(
      {
        url: `/v1/web/users/${userId}`, // edit later
        data: editData,
      },
      setState,
    );
    setAlertModal({
      ...alertModal,
      open: false,
    });
  }

  function handleOk() {
    form
      .validateFields()
      .then((values: any) => {
        // form.resetFields();
        if (values?.status === 'SLEEP' && values?.status !== data?.status) {
          setAlertModal({
            ...alertModal,
            open: true,
            type: 'alert',
            title: '저장',
            content:
              '해당 회원을 탈퇴하시겠습니까? 탈퇴 후에는 회원정보를 원복 할 수 없습니다. ',
            okText: '저장',
            onOk() {
              void onFinish(values);
            },
          });
        } else {
          void onFinish(values);
        }
      })
      .catch((error: any) => {
        setAlertModal({
          ...alertModal,
          type: 'error',
          title: 'Form 에러',
          content: error,
        });
      });
  }
  useEffect(() => {
    if (state.isSuccess) {
      handleCloseModal();
    }
    if (state.error) {
      const textError = state?.error?.errorMessage ?? state?.error?.message;
      console.log(state.error);
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: state.error?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
        content: textError ?? 'api 호출 에러 : 콘솔창 확인',
      });
    }
  }, [state]);
  return (
    <>
      <Modal open={isEditOpen} title="수정" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="EditMobileUser"
          colon={false}
          type="modal"
          gridcol="1fr"
        >
          {/* <StyledFormItem name="status" label="이용유무">
            <StyledSelect>
              <Select.Option value="ACTIVE">이용</Select.Option>
              <Select.Option value="BLOCK">중지</Select.Option>
            </StyledSelect>
          </StyledFormItem>
          <StyledFormItem
            name="accountId"
            label="유저 ID"
            rules={[
              {
                required: true,
                message: '사번을 입력해주세요.',
              },
            ]}
          >
            <StyledInput readOnly />
          </StyledFormItem>
          <StyledFormItem
            name="name"
            label="이름"
            rules={[
              {
                required: true,
                message: '이름를 입력해주세요.',
              },
            ]}
          >
            <StyledInput />
          </StyledFormItem>

          <StyledFormItem
            name="phoneNo"
            label="전화번호"
            rules={[
              {
                required: true,
                message: '전화번호을 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
          >
            <StyledInput maxLength={11} />
          </StyledFormItem>

          <StyledFormItem
            name="email"
            label="이메일"
            rules={[
              {
                required: true,
                message: '이메일를 입력해주세요.',
              },
              {
                type: 'email',
                message: '이메일 형식이 아닙니다.',
              },
            ]}
          >
            <StyledInput />
          </StyledFormItem> */}
          {/* <StyledFormItem
            name="email"
            label="이메일"
            rules={[
              {
                required: true,
                message: '이메일를 입력해주세요.',
              },
              {
                type: 'email',
                message: '이메일 형식이 아닙니다.',
              },
            ]}
          >
            <StyledInput />
          </StyledFormItem> */}
          {/* <StyledFormItem name="birth" label="생년월일">
            <StyledInput readOnly />
          </StyledFormItem>
          <StyledFormItem name="gender" label="성별">
            <StyledInput readOnly />
          </StyledFormItem> */}
          {/* <StyledFormItem
            name="password"
            label="비밀번호"
            rules={[
              {
                required: false,
                message: '비밀번호를 입력해주세요.',
              },
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z!@#$%^&*\d]{8,12}$/g,
                message: '영문,숫자,특수문자 조합으로 입력해주세요',
              },
            ]}
          >
            <StyledInput type="password" />
          </StyledFormItem> */}
          {/* {queryState.category === 'BIZ' && (
            <>
              <StyledFormItem name="d" label="ID">
                <div style={{ display: 'flex' }}>
                  <StyledInput readOnly />
                  <div style={{ marginLeft: '10px' }}>
                    <Button size="md" color="error">
                      PW 초기화
                    </Button>
                  </div>
                </div>
              </StyledFormItem>
              <StyledFormItem name="e" label="RF카드번호">
                <div style={{ display: 'flex' }}>
                  <StyledInput readOnly />
                  <div style={{ marginLeft: '10px' }}>
                    <Button size="md" color="error">
                      분실 신고
                    </Button>
                  </div>
                </div>
              </StyledFormItem>
            </>
          )}
          <StyledFormItem
            name="gender"
            label="성별"
            // rules={[
            //   {
            //     required: true,
            //     message: '사번을 입력해주세요.',
            //   },
            // ]}
          >
            <StyledInput readOnly />
          </StyledFormItem>
          <StyledFormItem
            name="birth"
            label="생년월일"
            // rules={[
            //   {
            //     required: true,
            //     message: '사번을 입력해주세요.',
            //   },
            // ]}
          >
            <StyledInput readOnly />
          </StyledFormItem>
          <StyledFormItem
            name="address"
            label="주소"
            // rules={[
            //   {
            //     required: true,
            //     message: '사번을 입력해주세요.',
            //   },
            // ]}
          >
            <StyledInput readOnly />
          </StyledFormItem>
          <StyledFormItem
            name="detailAddress"
            label="상세주소"
            // rules={[
            //   {
            //     required: true,
            //     message: '사번을 입력해주세요.',
            //   },
            // ]}
          >
            <StyledInput readOnly />
          </StyledFormItem>
          <StyledFormItem
            name="zipCode"
            label="우편번호"
            // rules={[
            //   {
            //     required: true,
            //     message: '사번을 입력해주세요.',
            //   },
            // ]}
          >
            <StyledInput readOnly />
          </StyledFormItem> */}
          <CPHContainer style={{ overflow: 'auto' }}>
            <table className="nl-tbl-detail">
              <tbody>
                <tr>
                  <th>회원 구분</th>
                  <td>회원</td>
                  <th>상태값</th>
                  <td>
                    <StyledFormItem name="status">
                      <StyledSelect disabled={data?.status === 'SLEEP'}>
                        <Select.Option value="ACTIVE">정상</Select.Option>
                        <Select.Option value="BLOCK">정지</Select.Option>
                        <Select.Option value="SLEEP">탈퇴</Select.Option>
                      </StyledSelect>
                    </StyledFormItem>
                  </td>
                  <th></th>
                  <td></td>
                </tr>
                <tr>
                  <th>회원 ID</th>
                  <td>
                    {/* <StyledFormItem
                      name="accountId"
                      rules={[
                        {
                          required: true,
                          message: '사번을 입력해주세요.',
                        },
                      ]}
                    >
                      <StyledInput readOnly />
                    </StyledFormItem> */}
                    {data?.accountId}
                  </td>
                  <th>비밀번호</th>
                  <td>
                    <Button
                      size="md"
                      color="secondary"
                      minWidth="100px"
                      type="button"
                      onClick={() => {
                        // onSearchAddress();
                        void handleResetPassword();
                      }}
                    >
                      초기화
                    </Button>
                  </td>
                  <th></th>
                  <td></td>
                </tr>
                <tr>
                  <th>회원 명</th>
                  <td>
                    <StyledFormItem
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: '이름를 입력해주세요.',
                        },
                      ]}
                    >
                      <StyledInput />
                    </StyledFormItem>
                  </td>
                  <th>성별</th>
                  <td>
                    <StyledFormItem name="gender" required>
                      <StyledRadio>
                        <StyledRadioBtn value={'1'}>남자</StyledRadioBtn>
                        <StyledRadioBtn value={'0'}>여자</StyledRadioBtn>
                      </StyledRadio>
                    </StyledFormItem>
                  </td>
                  <th>생년월일</th>
                  <td>
                    <StyledFormItem
                      name="birth"
                      rules={[
                        {
                          required: true,
                          message: '생년월일 입력해주세요.',
                        },
                      ]}
                    >
                      <DatePicker
                        format="YYYY-MM-DD"
                        picker="date"
                        placeholder="YYYY-MM-DD"
                        onChange={() => {}}
                      />
                    </StyledFormItem>
                  </td>
                </tr>
                <tr>
                  <th>이메일</th>
                  <td>
                    <StyledFormItem
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: '이메일를 입력해주세요.',
                        },
                        {
                          type: 'email',
                          message: '이메일 형식이 아닙니다.',
                        },
                      ]}
                    >
                      <StyledInput />
                    </StyledFormItem>
                  </td>
                  <th>연락처</th>
                  <td>
                    <StyledFormItem
                      name="phoneNo"
                      rules={[
                        {
                          required: true,
                          message: '전화번호을 입력해주세요.',
                        },
                        {
                          pattern: /^[0-9]+$/g,
                          message: '숫자만 입력하세요',
                        },
                      ]}
                    >
                      <StyledInput maxLength={11} />
                    </StyledFormItem>
                  </td>
                  <th>차량정보</th>
                  <td>
                    <Button
                      size="md"
                      color="secondary"
                      minWidth="100px"
                      type="button"
                      disabled={disableButton}
                      onClick={() => {
                        OpenCarManager();
                        // onSearchAddress();
                      }}
                    >
                      등록
                    </Button>
                  </td>
                </tr>
                <tr>
                  <th>가입일</th>
                  <td>{data?.createdAt}</td>
                  <th>마지막 이용일</th>
                  <td>{data?.lastOnline}</td>
                  <th></th>
                  <td></td>
                </tr>
                <tr>
                  <th>주소</th>
                  <td colSpan={5}>
                    <div style={{ display: 'flex' }}>
                      <StyledFormItem
                        name="zipCode"
                        style={{
                          marginRight: '10px',
                        }}
                        gridcol=" 100% 0"
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: '사번을 입력해주세요.',
                        //   },
                        // ]}
                      >
                        <StyledInput readOnly />
                      </StyledFormItem>
                      <Button
                        size="md"
                        color="secondary"
                        minWidth="100px"
                        type="button"
                        onClick={() => {
                          handleOpenDaumPopUp();
                        }}
                      >
                        주소 찾기
                      </Button>
                    </div>
                    <div style={{ margin: '10px 0' }}>
                      <StyledFormItem
                        name="address"
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: '사번을 입력해주세요.',
                        //   },
                        // ]}
                      >
                        <StyledInput style={{ width: '500px' }} readOnly />
                      </StyledFormItem>
                    </div>
                    <div>
                      <StyledFormItem
                        name="detailAddress"
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: '상세주소을 입력해주세요.',
                        //   },
                        // ]}
                      >
                        <StyledInput style={{ width: '500px' }} />
                      </StyledFormItem>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <ModalHeader title="SNS 계정 연동" />
            <table className="nl-tbl-detail" style={{ marginTop: 20 }}>
              <tbody>
                <tr>
                  <th>네이버</th>
                  <td>{naverLinkDate}</td>
                  <th>카카오</th>
                  <td>{kakaoLinkDate}</td>
                  <th>구글</th>
                  <td>{googleLinkDate}</td>
                  <th>애플</th>
                  <td>{appleLinkDate}</td>
                </tr>
              </tbody>
            </table>
          </CPHContainer>
        </StyledForm>

        <ModalFooter
          okText="저장"
          closeText="취소"
          close={handleCloseModal}
          onOk={handleOk}
        />
      </Modal>
    </>
  );
};
