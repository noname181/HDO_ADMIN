import { type Dispatch, type SetStateAction, useState, useEffect } from 'react';
import { Form, Select } from 'antd';
import { postApiUpdate, postApi } from 'apis/postApi';
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
import { FaqCategorySelectList } from 'utils/codelookup';
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
  function handleCloseModal() {
    setIsModalOpen(false);
    form.resetFields();
  }
  async function onFinish(values: any) {
    const newData = {
      category: values.category,
      title: values.title,
      content: values.content,
    };
    await postApi(
      {
        url: `/faq`,
        data: newData,
      },
      setState,
    );
    // handleCloseModal();
    // setcateSelected('');
    // settitleInput('');
  }
  function handleOk() {
    form
      .validateFields()
      .then((values: any) => {
        // form.resetFields();
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
  }
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
      {/* <Button
        size="md"
        color="reset"
        icon="/assets/img/icon/icon-trash.png"
        alt="비활성"
      >
        삭제
      </Button> */}
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
      <Modal open={isModalOpen} title="FAQ" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="faqAddData"
          colon={false}
          type="modal"
          gridcol="1fr"
          initialValues={{ category: '' }}
        >
          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            <li>
              <FaqCategorySelectList
                form={true}
                rules={[
                  {
                    required: true,
                    message: '카테고리를 입력해주세요.',
                  },
                ]}
              />
            </li>
            {/* <li>
              <StyledFormItem name="category" label="카테고리">
                <StyledInput />
              </StyledFormItem>
            </li> */}
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
                <StyledInput />
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
                <StyledTextArea rows={4} style={{ resize: 'none' }} />
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
    </>
  );
};
