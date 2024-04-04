import {
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
  useEffect,
  useState,
} from 'react';

import { Form, notification, Select } from 'antd';
import { postApi } from 'apis/postApi';
import { defaultUrl } from 'apis/api.helpers';
import { putApi } from 'apis/putApi';
import { type StateInterface, type IMessageLog } from 'interfaces/ICommon';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  RemoveIMGButton,
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledTextArea,
  StyltedIMG,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { StyledButtonUpload } from 'components/common/Button/Button.styled';
import { hdoInstance } from 'apis/hdoInstance';
import { CloseButton } from 'components/common/Button/CloseButton';
import TemplateGrid from './TemplateGrid';
interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>> | any;
  isEditOpen: boolean;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
  setMessageLogId: Dispatch<SetStateAction<number | ''>>;
  MessageLogId: number | '';
  messageType: string;
}

export const MessageLogEdit = ({
  state,
  setState,
  isEditOpen,
  setIsEditOpen,
  setMessageLogId,
  MessageLogId,
  messageType,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  function handleCloseModal() {
    setIsEditOpen(false);
    setMessageLogId('');
    form.resetFields();
  }
  const { loading, error, data, getData } = useGetDataWtTrigger<IMessageLog>();

  useEffect(() => {
    // bannereventId를 받아오면 api 호출
    if (MessageLogId !== '') {
      void getData({
        url: `/v1/messageLogs/${MessageLogId}`,
      });
    }
  }, [MessageLogId]);

  // api 호출 후 data를 받아오면 실행
  useEffect(() => {
    if (data !== null) {
      // console.log(data);
      // 모달 열림
      form.setFieldsValue({
        sendDt: data?.sendDt,
        annotation: data?.annotation,
        phoneNo: data?.phoneNo,
        textMessage: data?.textMessage,
        csId: data?.csId ? 'CS' : '시스템',
      });
      setIsEditOpen(true);
    }
  }, [data]);

  async function onFinish(values: any) {
    const newData = {
      sendDt: values?.sendDt,
      annotation: values?.annotation,
      phoneNo: values?.phoneNo,
      textMessage: values?.textMessage,
    };
    await putApi(
      {
        url: `/v1/messageLogs/${MessageLogId}`,
        data: newData,
      },
      setState,
    );
    handleCloseModal();
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
  function handleDelete() {
    // delete function
  }
  return (
    <Modal
      open={isEditOpen}
      title={messageType === 'MESSAGE' ? '문자 발송' : '알림톡 발송'}
      close={handleCloseModal}
      style={{ width: '1500px' }}
    >
      <StyledForm
        form={form}
        name="MessageLogEdit"
        colon={false}
        type="modal"
        gridcol="1fr"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
          }}
        >
          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            {messageType === 'MESSAGE' && (
              <li>
                <StyledFormItem
                  name="csId"
                  label="구분"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: '수신 번호를 입력해주세요.',
                  //   },
                  // ]}
                >
                  <StyledInput />
                </StyledFormItem>
              </li>
            )}

            <li>
              <StyledFormItem
                name="sendDt"
                label="발송일자"
                rules={[
                  {
                    required: true,
                    message: '발송일자를 입력해주세요.',
                  },
                ]}
              >
                <StyledInput readOnly />
              </StyledFormItem>
            </li>
            {/* <li>
              <StyledFormItem
                name="annotation"
                label="발신 번호"
                // rules={[
                //   {
                //     required: true,
                //     message: '발신 번호를 입력해주세요.',
                //   },
                // ]}
              >
                <StyledSelect>
                  <Select.Option value="">
                    (대표번호) 02-1551-1111
                  </Select.Option>
                  <Select.Option value="2">
                    (대표번호) 03-6666-1234
                  </Select.Option>
                </StyledSelect>
              </StyledFormItem>
            </li> */}
            <li>
              <StyledFormItem
                name="phoneNo"
                label="수신 번호"
                rules={[
                  {
                    required: true,
                    message: '수신 번호를 입력해주세요.',
                  },
                  {
                    pattern: /^[0-9]+$/g,
                    message: '숫자만 입력하세요',
                  },
                ]}
              >
                <StyledInput readOnly />
              </StyledFormItem>
            </li>
            <li>
              <StyledFormItem
                name="textMessage"
                label="내용"
                rules={[
                  {
                    required: true,
                    message: '내용를 입력해주세요.',
                  },
                ]}
              >
                <StyledTextArea
                  rows={4}
                  style={{ resize: 'none', height: '142px' }}
                  readOnly
                />
              </StyledFormItem>
            </li>
            {messageType === 'MESSAGE' && (
              <label>* 문자 발송 번호는 숫자만 기입해 주세요.</label>
            )}
          </ul>
          {/* <TemplateGrid></TemplateGrid> */}
        </div>
      </StyledForm>

      <ModalFooter
        // okText="재발송"
        closeText="닫기"
        close={handleCloseModal}
        // onOk={handleOk}
        isOk={false}
        // onDelete={handleDelete}
      />
    </Modal>
  );
};
