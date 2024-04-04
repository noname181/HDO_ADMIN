import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
// import { useRecoilState } from 'recoil';
// import { alertModalState } from 'recoil/modalState';

// import { putApi } from 'apis/putApi';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import { StyledForm } from 'components/common/test/Styled.ant';
import { PermissionGrid, PermissionCol } from './styled';
import { Form, Checkbox } from 'antd';
import { type IRules } from 'interfaces/Test/IUser';
interface ModalProps {
  rules: IRules;
  setRules: Dispatch<SetStateAction<IRules>>;
  permissionRules: any[];
  setPermissionRules: Dispatch<SetStateAction<any[]>>;
  name: string;
}

const PermissionInfo = ({
  rules,
  setRules,
  permissionRules,
  setPermissionRules,
  name,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [isModalInfoOpen, setIsModalInfoOpen] = useState(false);
  // const [isReadAll, setIsReadAll] = useState<boolean>(false);
  // const [isReadLimit, setIsReadLimit] = useState<boolean>(false);
  const [isWrite, setIsWrite] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const handleCloseModal = () => {
    setIsModalInfoOpen(false);
    setRules({
      name: '',
      rules: {
        read: false,
        write: false,
        delete: false,
      },
    });
    form.resetFields();
    // setIsReadLimit(false);
    // setIsReadAll(false);
    setIsWrite(false);
    setIsDelete(false);
  };
  const handleOk = () => {
    form
      .validateFields()
      .then((values: any) => {
        void onFinish(values);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  async function onFinish(values: any) {
    // console.log(values);
    if (permissionRules) {
      const arr = permissionRules;
      const rIndex = arr.findIndex((value: any) => value?.name === rules?.name);
      arr.splice(rIndex, 1, {
        name: rules.name,
        rules: {
          read: values?.read,
          write: values?.write,
          delete: values?.delete,
        },
      });
      setPermissionRules(arr);
    }

    // console.log(arr);
    // console.log(permissionRules);
    handleCloseModal();
  }

  // const onChange = (checkedValues: CheckboxValueType[]) => {
  //   console.log('checked = ', checkedValues);
  // };
  useEffect(() => {
    if (rules?.name !== '') {
      form.setFieldsValue({
        // list: rules?.rules?.list,
        read: rules?.rules?.read,
        write: rules?.rules?.write,
        delete: rules?.rules?.delete,
      });
      // if (rules?.rules?.read) {
      //   setIsReadAll(true);
      // }
      // if (rules?.rules?.list) {
      //   setIsReadLimit(true);
      // }
      if (rules?.rules?.write) {
        setIsWrite(true);
      }
      if (rules?.rules?.delete) {
        setIsDelete(true);
      }
      setIsModalInfoOpen(true);
    }
  }, [rules]);

  return (
    <Modal
      open={isModalInfoOpen}
      title="권한지정"
      close={handleCloseModal}
      style={{ width: 400 }}
    >
      <StyledForm form={form} name={name} colon={false} gridcol="1fr">
        <PermissionGrid gridCol="1fr">
          <PermissionCol permission={true}>
            <Form.Item name="read" valuePropName="checked">
              <Checkbox
                onChange={(e) => {
                  form.setFieldsValue({
                    read: e.target.checked,
                  });
                  // setIsReadAll(e.target.checked);
                }}
                disabled={isDelete || isWrite}
              >
                읽기
              </Checkbox>
            </Form.Item>
            {/* <Form.Item name="list" valuePropName="checked">
              <Checkbox
                onChange={(e) => {
                  form.setFieldsValue({
                    list: e.target.checked,
                  });
                  e.target.checked &&
                    form.setFieldsValue({
                      read: !e.target.checked,
                      write: !e.target.checked,
                      delete: !e.target.checked,
                    });
                  setIsReadLimit(e.target.checked);
                }}
                disabled={isReadAll || isDelete || isWrite}
              >
                읽기 제한 (개인정보를 볼 수 없습니다.)
              </Checkbox>
            </Form.Item> */}
            <Form.Item name="write" valuePropName="checked">
              <Checkbox
                onChange={(e) => {
                  form.setFieldsValue({
                    write: e.target.checked,
                    read: e.target.checked,
                  });

                  setIsWrite(e.target.checked);
                }}
                disabled={isDelete}
              >
                쓰기
              </Checkbox>
            </Form.Item>
            <Form.Item name="delete" valuePropName="checked">
              <Checkbox
                onChange={(e) => {
                  form.setFieldsValue({
                    delete: e.target.checked,
                    write: e.target.checked,
                    read: e.target.checked,
                  });

                  setIsDelete(e.target.checked);
                  !e.target.checked && setIsWrite(false);
                }}
              >
                삭제
              </Checkbox>
            </Form.Item>
          </PermissionCol>
        </PermissionGrid>
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

export default PermissionInfo;
