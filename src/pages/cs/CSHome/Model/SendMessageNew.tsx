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
import TemplateSendMessageGrid from './TemplateSendMessageGrid';
interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>> | any;
  isEditOpen: boolean;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
  setMessageLogId: Dispatch<SetStateAction<number | ''>>;
  MessageLogId: number | '';
}

interface infoForSendMsgInterface {
  phoneNo: string;
  text_message: string;
  userId: string;
}

export const SendMessageNew = ({
  state,
  setState,
  isEditOpen,
  setIsEditOpen,
  setMessageLogId,
  MessageLogId,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const currentDateTime = formatDateTime(new Date());
  const [infoForSendMsg, setInfoForSendMsg] =
    useState<infoForSendMsgInterface>();

  function formatDateTime(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  function handleCloseModal() {
    setIsEditOpen(false);
    setMessageLogId('');
    form.resetFields();
  }
  const { loading, error, data, getData } = useGetDataWtTrigger<IMessageLog>();
  const [dataTemplate, setDatatemplate] = useState<any>(null);
  useEffect(() => {
    // bannereventId를 받아오면 api 호출
    if (MessageLogId !== '') {
      void getData({
        url: `/v1/messageLogs/${MessageLogId}`,
      });
    }
  }, [MessageLogId]);

  useEffect(() => {
    if (state.data) {
      form.setFieldsValue({
        phoneNo: state.data?.phoneNo,
      });
    }
  }, [state]);

  // api 호출 후 data를 받아오면 실행
  useEffect(() => {
    if (data !== null) {
      // 모달 열림
      form.setFieldsValue({
        sendDt: data?.sendDt,
        annotation: data?.annotation,
        phoneNo: data?.phoneNo,
        text_message: data?.textMessage,
      });
      setIsEditOpen(true);
    }
  }, [data]);
  useEffect(() => {
    if (dataTemplate !== null) {
      // 모달 열림
      form.setFieldsValue({
        text_message: dataTemplate,
      });
    }
  }, [dataTemplate]);
  async function onFinish(values: any) {
    const url = `/v1/web/cs-sms`;
    const accessToken = localStorage.getItem('accessToken') ?? '';
    const formData = form.getFieldsValue();

    const axios = hdoInstance();

    await axios
      .post(url, formData, {
        headers: {
          Authorization: accessToken,
        },
      })
      .then((result) => {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'success',
          title: '문자 전송 상태 알림',
          content: '문자 전송이 완료 되었습니다.',
        });
      })
      .catch((error) => {
        console.log(error);
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: '문자 전송 상태 알림',
          content: '문자 전송에 실패했습니다.',
        });
      });

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
      title="문자 발송"
      close={handleCloseModal}
      style={{ width: '1500px' }}
    >
      <StyledForm
        form={form}
        name="MessageLogEdit"
        colon={false}
        type="modal"
        gridcol="1fr"
        initialValues={{
          type: 'CS',
          phoneCaller: '15515129',
          sendDt: currentDateTime,
          text_message: `안녕하세요!
 HD현대오일뱅크 EV&U 고객센터입니다.`,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridGap: '20px',
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
              <StyledFormItem
                name="type"
                label="구분"
                rules={[
                  {
                    required: true,
                    message: '구분를 입력해주세요.',
                  },
                ]}
              >
                <StyledInput readOnly />
              </StyledFormItem>
            </li>
            <li>
              <StyledFormItem
                name="phoneCaller"
                label="발신번호"
                rules={[
                  {
                    required: true,
                    message: '발신번호를 입력해주세요.',
                  },
                ]}
              >
                <StyledInput readOnly />
              </StyledFormItem>
            </li>
            <li>
              <StyledFormItem
                name="sendDt"
                label="발송일자"
                // rules={[
                //   {
                //     required: true,
                //     message: '발송일자를 입력해주세요.',
                //   },
                // ]}
              >
                <StyledInput readOnly />
              </StyledFormItem>
            </li>
            <li>
              <StyledFormItem
                name="phoneNo"
                label="수신 번호"
                rules={[
                  {
                    required: true,
                    pattern: /^[0-9]+$/g,
                    message: '숫자만 입력해주세요.',
                  },
                ]}
              >
                <StyledInput />
              </StyledFormItem>
            </li>
            <li>
              <StyledFormItem name="text_message" label="내용">
                <StyledTextArea
                  rows={4}
                  style={{ resize: 'none', height: '158px' }}
                />
              </StyledFormItem>
            </li>
            <label>* 문자 발송 번호는 숫자만 기입해 주세요.</label>
          </ul>
          <TemplateSendMessageGrid
            setDatatemplate={setDatatemplate}
          ></TemplateSendMessageGrid>
        </div>
      </StyledForm>

      <ModalFooter
        okText="발송"
        closeText="취소"
        close={handleCloseModal}
        onOk={handleOk}
        // onDelete={handleDelete}
      />
    </Modal>
  );
};
