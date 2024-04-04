import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { postApi } from 'apis/postApi';

import { type StateInterface } from 'interfaces/ICommon';
import { Button } from 'components/common/Button/Button';
// 스타일
import { Form, Checkbox, Select } from 'antd';
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import {
  PermissionCol,
  PermissionGrid,
  PermissionItem,
  TitleBox,
} from './styled';
import PermissionInfo from './PermissionInfo';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
import {
  type categoryPermissionsProps,
  type IRules,
} from 'interfaces/Test/IUser';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
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
}

const PermissionAdminRegister = ({ state, setState }: ModalProps) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
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

  const { loading, error, data, getDetail } =
    useGetDataWtTrigger<categoryPermissionsProps>();

  function handleOpenModal() {
    void getDetail({
      url: `/v1/web/auth/permissions`,
    });
  }
  function handleCloseModal() {
    setIsModalOpen(false);
    form.resetFields();
    setItemChecked([]);
  }

  useEffect(() => {
    if (data !== null) {
      const tempArr = addListPermission(data);
      const refactorData = tempArr?.map((obj) => ({
        name: obj.name,
        permissions: obj.permissions.map((permission: any) => ({
          name: permission,
          rules: {
            read: false,
            write: false,
            delete: false,
          },
        })),
      }));
      // console.log(refactorData);
      setNewData(refactorData);
      setIsModalOpen(true);
    }
  }, [data]);

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
      // setItemChecked((value: any) => {
      //   const newCheckRowId = value.filter((item: any) => item !== item?.name);
      //   return newCheckRowId;
      // });
      const mainMenu = form.getFieldValue('mainMenu');
      if (mainMenu === item?.name) {
        form.setFieldsValue({ mainMenu: null });
      }
      // console.log(form.getFieldValue('mainMenu'));
      // form.getFieldValue('mainMenu');
      // console.log(item?.name);
    }
    // console.log('render uncheck');
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
      read: rR,
      write: rW,
      delete: rD,
      mainMenu: values.mainMenu,
    };
    // console.log(postData);
    await postApi(
      {
        url: `/v1/web/auth/roles`,
        data: postData,
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

  useEffect(() => {
    if (state.isSuccess) {
      handleCloseModal();
    }
    if (state?.error) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: state?.error?.errorCode,
        content: state?.error?.errorMessage,
      });
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
      <Button
        size="md"
        color="primary"
        icon="/assets/img/icon/icon-add-w.png"
        alt="등록"
        onClick={handleOpenModal}
      >
        신규등록
      </Button>
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          title="권한관리 등록"
          close={handleCloseModal}
        >
          <StyledForm form={form} name="PARegister" colon={false}>
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
              <StyledInput placeholder="메뉴권한이름 입력" />
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
            okText="확인"
            closeText="취소"
            close={handleCloseModal}
            onOk={handleOk}
          />
        </Modal>
      )}

      <PermissionInfo
        name="PAInfoRegister"
        rules={rules}
        setRules={setRules}
        setPermissionRules={setPermissionRules}
        permissionRules={permissionRules}
      />
    </>
  );
};

export default PermissionAdminRegister;
