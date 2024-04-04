import { useState, useEffect } from 'react';

// 패키지
import { Form, Select } from 'antd';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledRadio,
  StyledRadioBtn,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { putApi } from 'apis/putApi';
import { hdoInstance } from 'apis/hdoInstance';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
import { type ExternalAdminInterface } from 'interfaces/Test/IUser';

const ClientAdminEdit = ({
  clientAdminData,
  setClientAdminData,
  state,
  setState,
  name,
}: any) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [permissionList, setPermissionList] = useState<any[]>();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  function handleCloseModal() {
    setIsModalOpen(false);
    setClientAdminData('');
    form.resetFields();
  }
  const { loading, error, data, getDetail } =
    useGetDataWtTrigger<ExternalAdminInterface>();

  useEffect(() => {
    if (clientAdminData !== '') {
      getPermissions();
      void getDetail({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/v1/web/users/${clientAdminData.id}`,
      });
    }
  }, [clientAdminData]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        status: data?.status,
        name: data?.name,
        phoneNo: data?.phoneNo,
        role: data?.role?.id,
        accountId: data?.accountId,
      });
      // 모달 열림
      setIsModalOpen(true);
    }
  }, [data]);

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

  async function onFinish(values: any) {
    if (clientAdminData !== '') {
      const editData = {
        status: values.status,
        name: values.name,
        phoneNo: values.phoneNo,
        role: values.role,
        accountId: values.accountId,
      };

      await putApi(
        {
          url: `/v1/web/users/${clientAdminData.id as string}`,
          data: editData,
        },
        setState,
      );
    }
  }

  function handleOk() {
    form
      .validateFields()
      .then((values: any) => {
        void onFinish(values);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (state.isSuccess) {
      handleCloseModal();
    }
  }, [state]);

  return (
    <Modal open={isModalOpen} title="관리자 계정 수정" close={handleCloseModal}>
      <StyledForm form={form} name={name ?? 'client-admin-edit'} colon={false}>
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
          <StyledInput placeholder="이메일 입력" readOnly />
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
          ]}
        >
          <StyledInput placeholder="전화번호 입력" />
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

export default ClientAdminEdit;
