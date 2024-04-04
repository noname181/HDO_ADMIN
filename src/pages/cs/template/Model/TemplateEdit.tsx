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
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
import { putApi } from 'apis/putApi';

interface ModalProps {
  state: StateInterface;
  setState: (param: any) => void;
  setId: Dispatch<SetStateAction<number | ''>>;
  id: number | '';
}

export const TemplateEdit = ({ state, setState, id, setId }: ModalProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  function handleCloseModal() {
    setIsModalOpen(false);
    setId('');
    form.resetFields();
  }
  const { loading, error, data, getData } = useGetDataWtTrigger<any>();

  useEffect(() => {
    // bannereventId를 받아오면 api 호출
    if (id !== '') {
      void getData({
        url: `/ms-template/${id}`,
      });
    }
  }, [id]);

  // api 호출 후 data를 받아오면 실행
  useEffect(() => {
    if (data !== null) {
      // 모달 열림
      form.setFieldsValue({
        scriptType: data.scriptType,
        scrptContent: data.scrptContent,
        scriptComment: data.scriptComment,
        scriptCategory: data.scriptCategory,
      });
      setIsModalOpen(true);
    }
  }, [data]);

  async function onFinish(values: any) {
    const newData = {
      scriptType: form.getFieldValue('scriptType'),
      scriptComment: form.getFieldValue('scriptComment'),
      scrptContent: form.getFieldValue('scrptContent'),
      scriptCategory: form.getFieldValue('scriptCategory'),
    };
    console.log(newData);
    console.log('formData 확인', form.getFieldValue('scrptContent'));
    await putApi(
      {
        url: `/ms-template/${id}`,
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
  // 폼제출 후 state 상태로 분기 처리
  useEffect(() => {
    // 등록 완료
    if (state.isSuccess) {
      // 모달 창 닫기
      handleCloseModal();
    }
  }, [state]);
  return (
    <>
      <Modal open={isModalOpen} title="템플릿 수정" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="TemplateEdit"
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
