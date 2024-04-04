import { useEffect, type Dispatch, type SetStateAction } from 'react';
// import { useRecoilState } from 'recoil';
// import { alertModalState } from 'recoil/modalState';
import { Modal } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledTextArea,
} from 'components/common/test/Styled.ant';
import { Form } from 'antd';
interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  content: string;
}
const BasicInformationPopUp = ({
  isModalOpen,
  setIsModalOpen,
  content,
}: ModalProps) => {
  // const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [form] = Form.useForm();
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (content) {
      form.setFieldsValue({
        scrptContent: content,
      });
    }
  }, [content]);
  return (
    <Modal open={isModalOpen} title="기본 정보" close={handleCloseModal}>
      <StyledForm
        form={form}
        name="BasicInformation"
        colon={false}
        gridcol="1fr"
      >
        <StyledFormItem
          name="scrptContent"
          label="내용"
          type="column"
          gridcol="100%"
          style={{ marginBottom: '30px' }}
        >
          <StyledTextArea
            style={{
              height: 400,
            }}
          ></StyledTextArea>
        </StyledFormItem>
      </StyledForm>
    </Modal>
  );
};

export default BasicInformationPopUp;
