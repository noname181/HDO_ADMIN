import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';

import { putApi } from 'apis/putApi';
import { defaultUrl } from 'apis/api.helpers';

import { type StateInterface } from 'interfaces/ICommon';
import { type HDOAdminInterface } from 'interfaces/Test/IUser';

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
  HDOId: number | '';
  setHDOId: Dispatch<SetStateAction<number | ''>>;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const HDOAdminEdit = ({ state, setState, HDOId, setHDOId }: ModalProps) => {
  const [form] = Form.useForm();
  const setAuthState = useSetRecoilState(userAuthState);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permissionList, setPermissionList] = useState<any[]>();
  const handleCloseModal = () => {
    form.resetFields();
    setIsModalOpen(false);
    setHDOId('');
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
    useGetDataWtTrigger<HDOAdminInterface>();

  useEffect(() => {
    if (HDOId !== '') {
      getPermissions();
      void getDetail({
        url: `/v1/web/users/${HDOId}`,
      });
    }
  }, [HDOId]);

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

  // const getSapPersonDetail = () => {
  //   const url = `/v1/get_sap_person/185067`;
  //   const accessToken = localStorage.getItem('accessToken') ?? '';
  //   if (!accessToken) return;
  //   const axios = hdoInstance();
  //   axios(url, {
  //     headers: {
  //       Authorization: accessToken,
  //     },
  //   })
  //     .then((result) => {
  //       const data = result?.data?.result;
  //       console.log(data);
  //       if (!data) {
  //         return;
  //       }
  //       form.setFieldsValue({
  //         dept: data?.ORGEH,
  //         name: data?.ENAME,
  //         phoneNo: data?.PHONE,
  //         email: data?.EMAIL,
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setAlertModal({
  //         ...alertModal,
  //         open: true,
  //         type: 'error',
  //         title: error?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
  //         content: error?.message ?? 'api 호출 에러 : 콘솔창 확인',
  //       });
  //     });
  // };
  useEffect(() => {
    if (data !== null) {
      form.setFieldsValue({
        // id: data.id,
        status: data?.status,
        role: data?.role?.id,
        accountId: data?.accountId,
        // dept: data?.dept,
        name: data?.name,
        phoneNo: data?.phoneNo,
        email: data?.email,
        ORG1: data?.Person?.ORG1,
        PHONE2: data?.Person?.PHONE2 !== 'null' ? data?.Person?.PHONE2 : '',
        JKW1: data?.Person?.JKW1,
      });
      // console.log(data);
      setIsModalOpen(true);
    }
  }, [data]);

  async function onFinish(values: any) {
    const editData = {
      status: values.status,
      role: values.role,
      accountId: values.accountId,
    };

    await putApi(
      {
        url: `/v1/web/users/${HDOId}`,
        data: editData,
      },
      setState,
    );
  }
  useEffect(() => {
    if (state.isSuccess) {
      handleCloseModal();
    }
  }, [state]);

  // useEffect(() => {
  //   if (accountId) {
  //     getSapPersonDetail();
  //   }
  // }, [accountId]);
  return (
    <Modal open={isModalOpen} title="HDO관리자 수정" close={handleCloseModal}>
      <StyledForm form={form} name="hdo-admin-edit" colon={false}>
        <StyledFormItem label="사번(ID)" name="accountId">
          <StyledInput readOnly />
        </StyledFormItem>
        <StyledFormItem name="status" label="이용유무" required>
          <StyledSelect>
            <Select.Option value="ACTIVE">이용</Select.Option>
            <Select.Option value="BLOCK">중지</Select.Option>
          </StyledSelect>
        </StyledFormItem>
        <StyledFormItem name="ORG1" label="부서">
          <StyledInput readOnly />
        </StyledFormItem>
        <StyledFormItem name="name" label="이름">
          <StyledInput readOnly />
        </StyledFormItem>
        <StyledFormItem label="이메일" name="email">
          <StyledInput readOnly />
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
        <StyledFormItem name="phoneNo" label="전화번호">
          <StyledInput readOnly />
        </StyledFormItem>
        <StyledFormItem name="PHONE2" label="유선번호">
          <StyledInput readOnly />
        </StyledFormItem>
        <StyledFormItem name="JKW1" label="직급">
          <StyledInput readOnly />
        </StyledFormItem>
        {/* <StyledFormItem
          name="password"
          label="비밀번호"
          rules={[
            { required: false, message: '비밀번호를 입력해주세요.' },
            { min: 8, message: '비밀번호는 최소 8자이상이어야 합니다.' },
          ]}
        >
          <StyledInput type="password" placeholder="비밀번호" />
        </StyledFormItem> */}
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

export default HDOAdminEdit;
