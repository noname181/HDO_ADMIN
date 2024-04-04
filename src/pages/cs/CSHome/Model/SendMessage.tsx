import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';

import { Form } from 'antd';
import { postApi } from 'apis/postApi';
import { defaultUrl } from 'apis/api.helpers';

import { type StateInterface } from 'interfaces/ICommon';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledTextArea,
} from 'components/common/test/Styled.ant';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { Button } from 'components/common/Button/Button';
import MemberSearchGrid from './MemberSearchGrid';
import { hdoInstance } from 'apis/hdoInstance';

interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>> | any;
  isSendModel: boolean;
  setIsSendModel: Dispatch<SetStateAction<boolean>>;
}

interface infoForSendMsgInterface {
  phoneNo: string;
  text_message: string;
  userId: string;
}

export const SendMessage = ({
  state,
  setState,
  isSendModel,
  setIsSendModel,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [infoForSendMsg, setInfoForSendMsg] =
    useState<infoForSendMsgInterface>();
  function handleCloseModal() {
    setIsSendModel(false);
    form.resetFields();
  }
  useEffect(() => {
    if (state.data) {
      setInfoForSendMsg(state.data);
      form.setFieldsValue({
        phoneNo: state.data.phoneNo,
        text_message: state.data.text_message,
        userId: state.data.userId,
      });
    }
    form.setFieldsValue({});
  }, [state]);
  function handleOk() {
    // 핸드폰 번호 확인
    // 메세지 확인
    // API 호출
    // 성공시 handleSave()
    void handleSave();
    // 실패시 setAlertModal --> 실패
  }
  const handleSave = async () => {
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
  };
  return (
    <Modal open={isSendModel} title="메세지 확인" close={handleCloseModal}>
      <StyledForm form={form} name="SendMessage" colon={false} type="modal">
        <div style={{ gridColumn: '1 / 4' }}>
          아래 내용의 문자메세지를 보내시겠습니까?
        </div>
        <StyledFormItem
          name="phoneNo"
          label="전화번호"
          rules={[
            {
              pattern: /^[0-9]+$/g,
              message: '숫자만 입력하세요',
            },
          ]}
        >
          <StyledInput />
        </StyledFormItem>
        <StyledFormItem name="userId" label="회원 ID">
          <StyledInput readOnly />
        </StyledFormItem>
        <StyledFormItem
          name="text_message"
          style={{ gridColumn: '1 / 4', width: '100%' }}
          gridcol="100%"
        >
          <StyledTextArea
            style={{ height: 200, width: '100%' }}
          ></StyledTextArea>
        </StyledFormItem>
      </StyledForm>
      <ModalFooter
        okText="확인"
        closeText="취소"
        close={handleCloseModal}
        onOk={handleOk}
      />
    </Modal>
  );
};
