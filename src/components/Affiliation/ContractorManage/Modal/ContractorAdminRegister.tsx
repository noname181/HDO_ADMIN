import { useState, useEffect } from 'react';

// 패키지
import { Form, Select } from 'antd';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { Button } from 'components/common/Button/Button';
import { postApi } from 'apis/postApi';
import { hdoInstance } from 'apis/hdoInstance';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

export const ContractorAdminRegister = ({
  contractorData,
  state,
  setState,
}: any) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [permissionList, setPermissionList] = useState<any[]>();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    form.resetFields();
  }

  async function onFinish(values: any) {
    if (contractorData !== '') {
      const contractorUserData = {
        status: values.status,
        name: values.name,
        phoneNo: values.phoneNo,
        role: values.role,
        accountId: values.accountId,
        orgId: contractorData.id,
      };

      await postApi(
        {
          url: `/v1/web/auth/accounts/external/requests`,
          data: contractorUserData,
        },
        setState,
      );
    }
  }
  const getPermissions = () => {
    const url = `/v1/web/auth/roles`;
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) return;
    const axios = hdoInstance();
    axios(url, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((result) => {
        const data = result?.data?.result?.map((item: any) => ({
          ...item,
        }));
        setPermissionList(data);
      })
      .catch((error) => {
        console.log(error);
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: error?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
          content: error?.message ?? 'api 호출 에러 : 콘솔창 확인',
        });
      });
  };
  function handleOk() {
    form
      .validateFields()
      .then((values: any) => {
        // form.resetFields();
        void onFinish(values);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    getPermissions();
  }, [isModalOpen]);
  useEffect(() => {
    if (state.isSuccess) {
      handleCloseModal();
    }
    if (state.error?.errorCode) {
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
      <Button onClick={handleOpenModal}>신규등록</Button>
      <Modal
        open={isModalOpen}
        title="관리자 계정 등록"
        close={handleCloseModal}
      >
        <StyledForm
          form={form}
          name="contractor-user-register"
          colon={false}
          type="modal"
          initialValues={{
            status: 'ACTIVE',
          }}
        >
          <StyledFormItem
            name="status"
            label="이용유무"
            rules={[
              {
                required: true,
                message: '이용유무을 선택해주세요.',
              },
            ]}
          >
            <StyledSelect>
              <Select.Option value="ACTIVE">이용</Select.Option>
              <Select.Option value="BLOCK">중지</Select.Option>
            </StyledSelect>
          </StyledFormItem>
          <StyledFormItem
            name="role"
            label="권한"
            rules={[
              {
                required: true,
                message: '권한을 입력해주세요.',
              },
            ]}
          >
            <StyledSelect>
              {permissionList?.map((item: any, index: any) => {
                return (
                  <Select.Option value={item?.id} key={index}>
                    {item?.name}
                  </Select.Option>
                );
              })}
            </StyledSelect>
          </StyledFormItem>
          <div></div>
          <StyledFormItem
            label="이메일(ID)"
            name="accountId"
            rules={[
              {
                required: true,
                message: '이메일을 입력해주세요.',
              },
              {
                type: 'email',
                message: '이메일 형식이 아닙니다.',
              },
            ]}
          >
            <StyledInput placeholder="이메일 입력" />
          </StyledFormItem>
          <StyledFormItem
            label="이름"
            name="name"
            rules={[
              {
                required: true,
                message: '이름을 입력해주세요.',
              },
            ]}
          >
            <StyledInput placeholder="이름 입력" />
          </StyledFormItem>
          <StyledFormItem
            label="전화번호"
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
              // {
              //   pattern: /^\d{9,11}/,
              //   message: '숫자는 9자리 이상 11이하로 입력하세요',
              // },
            ]}
          >
            <StyledInput
              placeholder="전화번호 입력"
              maxLength={11}
              minLength={9}
            />
          </StyledFormItem>
        </StyledForm>
        <ModalFooter
          okText="등록"
          closeText="취소"
          close={handleCloseModal}
          onOk={handleOk}
        />
      </Modal>
    </>
  );
};
