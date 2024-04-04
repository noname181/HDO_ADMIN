import { type Dispatch, type SetStateAction, useState, useRef } from 'react';
import { Form, Select } from 'antd';
import { postApiUpdate } from 'apis/postApi';
import { defaultUrl } from 'apis/api.helpers';
// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledTextArea,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import {
  type UpdateStateInterface,
  type StateInterface,
} from 'interfaces/ICommon';
import { Button } from 'components/common/Button/Button';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { useGetListWt } from 'hooks/useGetListWt';

// interface ModalProps {
//   state: StateInterface;
//   setState: Dispatch<SetStateAction<StateInterface>>;
//   isModalOpen: boolean;
//   setIsModalOpen: Dispatch<SetStateAction<boolean>>;
// }
interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
  settitleInput: any;
  setcateSelected: any;
}

export const AddData = ({
  state,
  setState,
  setcateSelected,
  settitleInput,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const [contentData, setContentData] = useState<string>('');
  function handleCloseModal() {
    setIsModalOpen(false);
    setContent('');
    setContentData('');
    form.resetFields();
  }
  // const { loading, error, data, refetch } = useGetListWt<any>({
  //   url: '/terms?rpp=10000000000&page=0&odby=DESC&select=ALL&search=',
  // });
  async function onFinish(values: any) {
    const newData = {
      category: values.category,
      title: values.title,
      content: content,
      // parentId: values?.parentId,
    };
    await postApiUpdate(
      {
        url: `/terms`,
        data: newData,
      },
      setState,
    );
    handleCloseModal();
    setcateSelected('');
    settitleInput('');
  }
  function handleOk() {
    form
      .validateFields()
      .then((values: any) => {
        // form.resetFields();
        void onFinish(values);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
  const validateContent = async (_: any, value: any) => {
    const regExp = /<\/?[^>]+(>|$)/g;
    if (!regExp.test(value)) {
      return await Promise.reject(new Error('내용를 입력해주세요.'));
    }
    await Promise.resolve();
  };
  return (
    <>
      <Button
        size="md"
        color="primary"
        icon="/assets/img/icon/icon-add-w.png"
        alt="등록"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        {/* 신규등록 */} 등록
      </Button>
      {isModalOpen && (
        <Modal open={isModalOpen} title="정책 및 약관" close={handleCloseModal}>
          <StyledForm
            form={form}
            name="termspolicyAddData"
            colon={false}
            type="modal"
            gridcol="1fr"
          >
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              {/* <li>
              <StyledFormItem
                name="parentId"
                label="Parent data"
                rules={[
                  {
                    required: true,
                    message: '카테고리를 입력해주세요.',
                  },
                ]}
              >
                <StyledSelect>
                  {data?.map((item) => {
                    if (item.parentId === null) {
                      return (
                        <Select.Option key={item.id} value={item.id}>
                          {item.title}
                        </Select.Option>
                      );
                    }
                    return null;
                  })}
                </StyledSelect>
              </StyledFormItem>
            </li> */}
              <li>
                <StyledFormItem
                  name="category"
                  label="카테고리"
                  rules={[
                    {
                      required: true,
                      message: '카테고리를 선택하세요.',
                    },
                  ]}
                >
                  <StyledSelect>
                    <Select.Option value="필수약관">필수약관</Select.Option>
                    <Select.Option value="선택약관">선택약관</Select.Option>
                    <Select.Option value="카드약관">카드약관</Select.Option>
                    <Select.Option value="결제약관">결제약관</Select.Option>
                  </StyledSelect>
                </StyledFormItem>
              </li>
              <li>
                <StyledFormItem
                  name="title"
                  label="제목"
                  rules={[
                    {
                      required: true,
                      message: '제목를 입력해주세요.',
                    },
                  ]}
                >
                  <StyledInput maxLength={76} />
                </StyledFormItem>
              </li>
              <li>
                <StyledFormItem
                  name="content"
                  label="내용"
                  rules={[
                    {
                      required: true,
                      message: '내용를 입력해주세요.',
                    },
                  ]}
                >
                  <SunEditor
                    height="400px"
                    onChange={(content) => {
                      const regex = /(<([^>]+)>)/gi;
                      const hasText = !!content.replace(regex, '').length;
                      if (hasText) {
                        form.setFieldValue('content', content);
                        setContent(content);
                      } else {
                        form.setFieldValue('content', null);
                        setContent('');
                      }
                    }}
                    setOptions={{
                      buttonList: [
                        // default
                        ['undo', 'redo'],
                        ['fontSize'],
                        ['bold', 'underline', 'italic'],
                        ['fontColor', 'hiliteColor'],
                        ['indent', 'outdent'],
                        ['align', 'horizontalRule'],
                        // ["table", "link", "image", "codeView"],
                        ['table', 'link', 'list'],
                        ['removeFormat'],
                        ['fullScreen'],
                      ],
                    }}
                  />
                </StyledFormItem>
              </li>
            </ul>
          </StyledForm>
          <ModalFooter
            okText="저장"
            closeText="취소"
            close={handleCloseModal}
            onOk={handleOk}
          />
        </Modal>
      )}
    </>
  );
};
