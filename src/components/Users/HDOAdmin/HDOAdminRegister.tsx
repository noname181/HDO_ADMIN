import { useState, type Dispatch, type SetStateAction, useEffect } from 'react';

import { Form, Select } from 'antd';
import { postApi } from 'apis/postApi';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { type StateInterface } from 'interfaces/ICommon';
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledSelect,
} from 'components/common/test/Styled.ant';

import { Button } from 'components/common/Button/Button';
import { hdoInstance } from 'apis/hdoInstance';
import { useGetListWt } from 'hooks/useGetListWt';

interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
}
interface ISapUser {
  PERNR: string;
  ENAME: string;
  EMAIL: string;
  ORG: string;
  ORG1: string;
  GESCH: string;
  BUKRS: string;
  ORGEH: string;
  HIRE_DATE: string;
  JKW: string;
  JKW1: string;
  JKG: string;
  JKG1: string;
  ZZJKC: string;
  ZJKC1: string;
  PHONE: string;
  PHONE2: string;
  CDATE: string;
  MDATE: string;
  DPT: string;
  DPT1: string;
}
const HDOAdminRegister = ({ state, setState }: ModalProps) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [permissionList, setPermissionList] = useState<any[]>();
  const [sapPerson, setSapPerson] = useState<ISapUser[]>();
  const [sapPersonPERNR, setSapPersonPERNR] = useState<string | null>('');
  const [searchValue, setSearchValue] = useState<any>(null);
  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setSearchValue('');
    setIsModalOpen(false);
    form.resetFields();
  }

  async function onFinish(values: any) {
    const HDOAdminData = {
      retired: values.retired,
      dept: values.dept,
      accountId: values.accountId,
      name: values.name,
      role: values.role,
      phoneNo: values.phoneNo,
      // password: values.password,
      email: values.email,
      status: values.status,
    };

    await postApi(
      {
        url: `/v1/web/auth/hdo/register`,
        data: HDOAdminData,
      },
      setState,
    );
  }

  function handleOk() {
    form
      .validateFields()
      .then((values: any) => {
        void onFinish(values);
      })
      .catch((error: any) => {
        console.log(error);
      });
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
  const getSapPerson = () => {
    const url = `/v1/get_sap_person?rpp=10000000000&page=1&odby=DESC`;
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) return;
    const axios = hdoInstance();
    axios(url, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((result) => {
        const data = result?.data?.result?.rows;
        setSapPerson(data);
        // console.log(data);
        setSapPersonPERNR(result?.data?.result?.rows?.PERNR);
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
  const getSapPersonDetail = () => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/v1/get_sap_person/${sapPersonPERNR}`;
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) return;
    const axios = hdoInstance();
    axios(url, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((result) => {
        const data = result?.data?.result;
        // console.log(data);
        if (!data) {
          return;
        }
        form.setFieldsValue({
          // dept: data?.ORGEH,
          name: data?.ENAME,
          phoneNo: data?.PHONE,
          email: data?.EMAIL,
          ORG1: data?.ORG1,
          PHONE2: data?.PHONE2,
          JKW1: data?.JKW1,
        });
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
    if (isModalOpen) {
      getPermissions();
      getSapPerson();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen && sapPersonPERNR) {
      // console.log(setSapPersonPERNR);
      getSapPersonDetail();
    }
  }, [sapPersonPERNR]);

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

  function isNumeric(str: number) {
    if (typeof str !== 'string') return false; // we only process strings!
    return (
      !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
  }

  return (
    <>
      <Button
        size="md"
        color="primary"
        icon="/assets/img/icon/icon-add-w.png"
        alt="등록"
        onClick={handleOpenModal}
      >
        권한등록
      </Button>
      <Modal open={isModalOpen} title="HDO관리자 등록" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="hdo-admin-register"
          colon={false}
          initialValues={{
            status: 'ACTIVE',
            // role: 'ADMIN',
          }}
        >
          <StyledFormItem
            name="accountId"
            label="사번(ID)"
            rules={[
              {
                required: true,
                message: '사번을 입력해주세요.',
              },
            ]}
          >
            <StyledSelect
              showSearch
              // loading={loading}
              optionFilterProp="children"
              filterOption={(input: any, option) => {
                if (isNumeric(input)) {
                  return option?.key === input.trim();
                } else {
                  return (
                    option?.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }
              }}
              placeholder="사번(ID)"
              onChange={(e, props: any) => {
                setSapPersonPERNR(e as string);
              }}
              onSearch={(value: string) => {
                setSearchValue(value);
              }}
              onSelect={() => {
                setTimeout(() => {
                  setSearchValue(null);
                }, 200);
              }}
            >
              {sapPerson?.map((item) => {
                return searchValue ? (
                  <Select.Option key={item.PERNR} value={item.PERNR}>
                    {item.PERNR + ' | ' + item.ENAME + ' | ' + item.ORG1}
                  </Select.Option>
                ) : null;
              })}
            </StyledSelect>
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
          <StyledFormItem
            name="phoneNo"
            label="전화번호"
            // rules={[
            //   {
            //     pattern: /^[0-9]+$/g,
            //     message: '숫자만 입력하세요',
            //   },
            // ]}
          >
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
              { required: true, message: '비밀번호를 입력해주세요.' },
              { min: 8, message: '비밀번호는 최소 8자이상이어야 합니다.' },
            ]}
          >
            <StyledInput type="password" placeholder="비밀번호" />
          </StyledFormItem> */}
        </StyledForm>
        <ModalFooter
          okText="확인"
          closeText="취소"
          close={handleCloseModal}
          onOk={handleOk}
        />
      </Modal>
    </>
  );
};

export default HDOAdminRegister;
