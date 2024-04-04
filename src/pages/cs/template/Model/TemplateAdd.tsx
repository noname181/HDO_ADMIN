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
  StyledRadio,
  StyledRadioBtn,
} from 'components/common/test/Styled.ant';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { type StateInterface } from 'interfaces/ICommon';
import { Button } from 'components/common/Button/Button';
import { FaqCategorySelectList } from 'utils/codelookup';

interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
}

export const TemplateAdd = ({ state, setState }: ModalProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  function handleCloseModal() {
    setIsModalOpen(false);
    form.resetFields();
  }
  async function onFinish(values: any) {
    const newData = {
      scriptType: values.scriptType,
      scrptContent: values.scrptContent,
      scriptComment: values.scriptComment,
      scriptCategory: values.scriptCategory,
    };
    await postApi(
      {
        url: `/ms-template`,
        data: newData,
      },
      setState,
    );
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
      <Button
        size="md"
        color="primary"
        icon="/assets/img/icon/icon-add-w.png"
        alt="신규등록"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        신규등록
      </Button>
      <Modal open={isModalOpen} title="템플릿 등록" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="TemplateAdd"
          colon={false}
          type="modal"
          gridcol="1fr"
          initialValues={{
            scrptContent: `안녕하세요!
HDO현대오일뱅크 입니다. 
          `,
            scriptType: 'MES',
          }}
        >
          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            <li>
              <StyledFormItem label="카테고리" name="scriptType" required>
                <StyledRadio>
                  <StyledRadioBtn value="MES">문자</StyledRadioBtn>
                  <StyledRadioBtn value="COM">스크립트</StyledRadioBtn>
                </StyledRadio>
              </StyledFormItem>
            </li>
            <li>
              <StyledFormItem
                name="scriptCategory"
                label="카테고리"
                rules={[
                  {
                    required: true,
                    message: '카테고리를 입력해주세요.',
                  },
                ]}
              >
                <StyledSelect placeholder="선택해주세요">
                  <Select.Option value="info">안내 </Select.Option>
                  <Select.Option value="payment">결제 </Select.Option>
                  <Select.Option value="announce">공지 </Select.Option>
                </StyledSelect>
              </StyledFormItem>
            </li>

            <li>
              <StyledFormItem
                name="scrptContent"
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
            <li>
              <StyledFormItem
                name="scriptComment"
                label="설명"
                rules={[
                  {
                    required: true,
                    message: '설명를 입력해주세요.',
                  },
                ]}
              >
                <StyledInput />
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
