import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';

import { putApi } from 'apis/putApi';

import { type StateInterface } from 'interfaces/ICommon';
import { type ExternalAdminInterface } from 'interfaces/Test/IUser';

// 스타일
import { Form, Select } from 'antd';
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { hdoInstance } from 'apis/hdoInstance';
import { userAuthState } from 'recoil/authState';

interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
  userId: number | '';
  setUserId: Dispatch<SetStateAction<number | ''>>;
}

const ExternalAdminEdit = ({
  state,
  setState,
  userId,
  setUserId,
}: ModalProps) => {
  const [form] = Form.useForm();
  const setAuthState = useSetRecoilState(userAuthState);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permissionList, setPermissionList] = useState<any[]>();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserId('');
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) return;
    const axios = hdoInstance();
    axios
      .get(`/v1/admin/users/me`, {
        headers: {
          Authorization: accessToken,
        },
      })
      .then((response1) => {
        setAuthState({
          isAuthenticated: true,
          user: response1.data,
        });
      })
      .catch(() => {
        setAuthState({
          isAuthenticated: false,
          user: null,
        });
      });
  };
  const handleOk = () => {
    form
      .validateFields()
      .then((values: any) => {
        void onFinish(values);
      })
      .catch((error: any) => {
        setAlertModal({
          ...alertModal,
          type: 'error',
          title: 'Form 에러',
          content: error,
        });
      });
  };

  const { loading, error, data, getDetail } =
    useGetDataWtTrigger<ExternalAdminInterface>();

  useEffect(() => {
    if (userId !== '') {
      form.resetFields();
      getPermissions();
      void getDetail({
        url: `/v1/web/users/${userId}`,
      });
    }
  }, [userId]);

  useEffect(() => {
    if (data !== null) {
      form.setFieldsValue({
        // id: data.id,
        status: data?.status,
        accountId: data?.accountId,
        name: data?.name,
        role: data?.role?.id,
        phoneNo: data?.phoneNo,
      });
      setIsModalOpen(true);
      // console.log(data);
    }
  }, [data]);

  async function onFinish(values: any) {
    const editData = {
      status: values.status,
      name: values.name,
      phoneNo: values.phoneNo,
      role: values.role,
    };

    await putApi(
      {
        url: `/v1/web/users/${userId}`,
        data: editData,
      },
      setState,
    );
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
    <Modal open={isModalOpen} title="외부 관리자 수정" close={handleCloseModal}>
      <StyledForm form={form} name="hdo-admin-edit" colon={false}>
        <StyledFormItem name="status" label="이용유무" required>
          <StyledSelect>
            <Select.Option value="ACTIVE">이용</Select.Option>
            <Select.Option value="BLOCK">중지</Select.Option>
          </StyledSelect>
        </StyledFormItem>
        <StyledFormItem
          name="name"
          label="이름"
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
        {/* <StyledFormItem name="role" label="권한">
          <StyledInput readOnly />
        </StyledFormItem> */}
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
          <StyledInput placeholder="전화번호 입력" />
        </StyledFormItem>
        <StyledFormItem
          name="accountId"
          label="이메일"
          rules={[
            {
              required: true,
              message: '전화번호을 입력해주세요.',
            },
          ]}
          style={{ gridColumn: 'auto / span 2' }}
        >
          <StyledInput readOnly />
        </StyledFormItem>
      </StyledForm>
      <ModalFooter
        okText="수정"
        closeText="취소"
        close={handleCloseModal}
        onOk={handleOk}
      />
    </Modal>
  );
};

export default ExternalAdminEdit;
