import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';

import { putApi } from 'apis/putApi';

import { type StateInterface } from 'interfaces/ICommon';
import {
  type IRules,
  type PermissionAdminInterface,
} from 'interfaces/Test/IUser';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import {
  PermissionGrid,
  PermissionCol,
  TitleBox,
  PermissionItem,
} from './styled';
import { Form, Checkbox, Select } from 'antd';
import PermissionInfo from './PermissionInfo';
import { hdoInstance } from 'apis/hdoInstance';
import { userAuthState } from 'recoil/authState';
import {
  addListPermission,
  handleCheckAllRules,
  handleSetChecked,
  isActualServer,
  isHidePageOnActualServer,
} from 'utils/permission';
interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
  rolesId: string;
  setRolesId: Dispatch<SetStateAction<string>>;
}
const PermissionAdminEdit = ({
  state,
  setState,
  rolesId,
  setRolesId,
}: ModalProps) => {
  const [form] = Form.useForm();
  const setAuthState = useSetRecoilState(userAuthState);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newData, setNewData] = useState<any>();
  const [permissionRules, setPermissionRules] = useState<any[]>([]);
  const [itemChecked, setItemChecked] = useState<any[]>([]);
  const [rules, setRules] = useState<IRules>({
    name: '',
    rules: {
      read: false,
      write: false,
      delete: false,
    },
  });
  const handleCloseModal = () => {
    setItemChecked([]);
    setIsModalOpen(false);
    setRolesId('');
    form.resetFields();
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
  const { loading, error, data, getDetail } =
    useGetDataWtTrigger<PermissionAdminInterface>();

  useEffect(() => {
    if (rolesId !== '') {
      form.resetFields();
      void getDetail({
        url: `/v1/web/auth/roles/${rolesId}`,
      });
    }
  }, [rolesId]);

  useEffect(() => {
    if (data !== null) {
      form.setFieldsValue({
        name: data?.name,
        mainMenu: data?.mainMenu,
      });

      const tempArr = addListPermission(data);
      setNewData(tempArr);
      tempArr?.length > 0 &&
        tempArr?.forEach((element: any) => {
          element?.permissions?.forEach((item: any) => {
            handleSetChecked(item, form);
            if (
              item?.rules?.read ||
              item?.rules?.write ||
              item?.rules?.delete
            ) {
              setItemChecked((value: any) => [...value, item?.name]);
            }
          });
        });
      // console.log(data);

      setIsModalOpen(true);
    }
  }, [data]);

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

  async function onFinish(values: any) {
    const rR: any[] = [];
    const rW: any[] = [];
    const rD: any[] = [];

    newData?.length > 0 &&
      newData.forEach((element: any) => {
        element?.permissions?.forEach((item: any) => {
          item?.rules?.read && rR.push(item?.name);
          item?.rules?.write && rW.push(item?.name);
          item?.rules?.delete && rD.push(item?.name);
        });
      });

    const postData = {
      name: values?.name,
      mainMenu: values?.mainMenu,
      read: rR,
      write: rW,
      delete: rD,
    };
    // console.log(newData2);
    await putApi(
      {
        url: `/v1/web/auth/roles/${rolesId}`,
        data: postData,
      },
      setState,
    );
  }
  async function resetRules(category: any, item: any) {
    // handlePermissionRules(cate);
    const arr = category?.permissions;
    const rIndex = arr.findIndex((value: any) => value?.name === item?.name);
    arr.splice(rIndex, 1, {
      name: item?.name,
      rules: {
        read: false,
        write: false,
        delete: false,
      },
    });
    // console.log(arr);
  }
  const handleOnChange = (e: any, item: any, category: any) => {
    if (e?.target.checked) {
      setRules({
        name: item?.name,
        rules: item?.rules,
      });
      setPermissionRules(category?.permissions);
      // console.log(category);
    } else {
      setRules({
        name: '',
        rules: {
          read: false,
          write: false,
          delete: false,
        },
      });
      void resetRules(category, item);
      const mainMenu = form.getFieldValue('mainMenu');
      if (mainMenu === item?.name) {
        form.setFieldsValue({ mainMenu: null });
      }
      // console.log(arr);
      // console.log('render uncheck');
    }
    // permissionRules.splice(rIndex, 1, rules);
    // console.log(systemSetting?.permissions);
  };
  const handleOnClick = (item: any, category: any) => {
    setRules({
      name: item?.name,
      rules: item?.rules,
    });
    setPermissionRules(category?.permissions);
    // console.log(category);

    // permissionRules.splice(rIndex, 1, rules);
    // console.log(systemSetting?.permissions);
  };
  useEffect(() => {
    if (state.isSuccess) {
      handleCloseModal();
    }
  }, [state]);

  useEffect(() => {
    if (rules?.name === '' && newData?.length > 0) {
      setItemChecked([]);
      newData?.forEach((element: any) => {
        element?.permissions?.forEach((item: any) => {
          handleSetChecked(item, form);
          if (handleCheckAllRules(item?.rules)) {
            setItemChecked((value: any) => [...value, item?.name]);
          }
        });
      });
    }
  }, [rules]);

  return (
    <>
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          title="권한관리 수정"
          close={handleCloseModal}
        >
          <StyledForm form={form} name="PAdEdit" colon={false}>
            <StyledFormItem
              name="name"
              label="메뉴권한이름"
              rules={[
                {
                  required: true,
                  message: '메뉴권한이름을 입력해주세요.',
                },
              ]}
            >
              <StyledInput readOnly />
            </StyledFormItem>
            <StyledFormItem
              name="mainMenu"
              label="초기 메뉴 설정"
              rules={[
                {
                  required: true,
                  message: '초기 메뉴 설정을 선택해주세요.',
                },
              ]}
            >
              <StyledSelect placeholder="초기 메뉴 설정 선택">
                {itemChecked?.map((item, index) => {
                  return (
                    <Select.Option key={index} value={item}>
                      {item}
                    </Select.Option>
                  );
                })}
              </StyledSelect>
            </StyledFormItem>
            <div></div>
            <div style={{ gridColumn: '4 span / 5' }}>
              <PermissionGrid gridCol="1fr 1fr 1fr 1fr">
                {newData?.map((category: any, index: any) => {
                  return (
                    <PermissionCol key={index}>
                      <TitleBox>{category?.name}</TitleBox>
                      {category?.permissions?.map((item: any, index: any) => {
                        // console.log(item);
                        if (isActualServer()) {
                          return (
                            <div key={index}>
                              {!isHidePageOnActualServer(item?.name) && (
                                <PermissionItem
                                  style={{ marginBottom: '5px' }}
                                  onClick={() => {
                                    handleOnClick(item, category);
                                  }}
                                >
                                  <Form.Item
                                    name={item?.name}
                                    key={index}
                                    valuePropName="checked"
                                  >
                                    <Checkbox
                                      onChange={(e) => {
                                        handleOnChange(e, item, category);
                                      }}
                                    ></Checkbox>
                                  </Form.Item>
                                  {item?.name}
                                  {item?.rules?.read ||
                                  item?.rules?.write ||
                                  item?.rules?.delete
                                    ? ' ('
                                    : ''}
                                  {item?.rules?.read && '읽기'}
                                  {item?.rules?.read &&
                                    item?.rules?.write &&
                                    ', '}
                                  {item?.rules?.write && '쓰기'}
                                  {(item?.rules?.write &&
                                    item?.rules?.delete) ||
                                  (item?.rules?.read && item?.rules?.delete)
                                    ? ', '
                                    : ''}
                                  {item?.rules?.delete && '삭제'}
                                  {item?.rules?.read ||
                                  item?.rules?.write ||
                                  item?.rules?.delete
                                    ? ')'
                                    : ''}
                                </PermissionItem>
                              )}
                            </div>
                          );
                        } else {
                          return (
                            <PermissionItem
                              key={index}
                              style={{ marginBottom: '5px' }}
                              onClick={() => {
                                handleOnClick(item, category);
                              }}
                            >
                              <Form.Item
                                name={item?.name}
                                key={index}
                                valuePropName="checked"
                              >
                                <Checkbox
                                  onChange={(e) => {
                                    handleOnChange(e, item, category);
                                  }}
                                ></Checkbox>
                              </Form.Item>
                              {item?.name}
                              {item?.rules?.read ||
                              item?.rules?.write ||
                              item?.rules?.delete
                                ? ' ('
                                : ''}
                              {item?.rules?.read && '읽기'}
                              {item?.rules?.read && item?.rules?.write && ', '}
                              {item?.rules?.write && '쓰기'}
                              {(item?.rules?.write && item?.rules?.delete) ||
                              (item?.rules?.read && item?.rules?.delete)
                                ? ', '
                                : ''}
                              {item?.rules?.delete && '삭제'}
                              {item?.rules?.read ||
                              item?.rules?.write ||
                              item?.rules?.delete
                                ? ')'
                                : ''}
                            </PermissionItem>
                          );
                        }
                      })}
                    </PermissionCol>
                  );
                })}
              </PermissionGrid>
            </div>
          </StyledForm>
          <ModalFooter
            okText="수정"
            closeText="취소"
            close={handleCloseModal}
            onOk={handleOk}
          />
        </Modal>
      )}

      <PermissionInfo
        name="PAInfoEdit"
        rules={rules}
        setRules={setRules}
        setPermissionRules={setPermissionRules}
        permissionRules={permissionRules}
      />
    </>
  );
};

export default PermissionAdminEdit;
