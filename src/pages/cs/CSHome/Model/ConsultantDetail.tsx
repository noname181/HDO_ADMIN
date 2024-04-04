import { useEffect } from 'react';
import { Modal } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledTextArea,
} from 'components/common/test/Styled.ant';
import { Form } from 'antd';
const ConsultantDetail = ({ setIsModalOpen, isModalOpen, data }: any) => {
  const [form] = Form.useForm();
  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  const csCls1Data = (data: any) => {
    switch (data) {
      case 'CHG':
        return '이용방법';
      case 'BRK':
        return '결제문의';
      case 'PAY':
        return '장애문의';
      case 'REG':
        return '환불';
      case 'CAR':
        return '단순 문의';
      default:
        return '기타';
    }
  };
  const orgNameData = (data: any) => {
    switch (data) {
      case 'DEF':
        return '일반회원';
      case 'BIZ':
        return '법인회원';
      case 'ETC':
        return '비회원';
      case 'STT':
        return '제휴회원';
      default:
        return '비회원';
    }
  };
  const incomingCdData = (data: any) => {
    switch (data) {
      case 'CTP':
        return '상담센터';
      case 'APP':
        return 'APP신고';
      case 'MAN':
        return '수동등록';
      default:
        return '';
    }
  };
  const statusCdData = (data: any) => {
    switch (data) {
      case 'HOL':
        return '보류';
      case 'ALL':
        return '전체';
      case 'COM':
        return '완료';
      case 'APR':
        return '승인';
      case 'REF':
        return '환불';
      case 'ARR':
        return '승인요청';
      case 'RER':
        return '환불요청';
      case 'TRA':
        return '이관';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        regNo: data?.regNo,
        statusCd: data?.statusCd,
        incomingCd: incomingCdData(data?.incomingCd),
        orgName: orgNameData(data?.orgName),
        csCls2: csCls1Data(data?.csClass),
        csContent: data?.csContent,
        prsContent: data?.prsContent,
        createdAt: data?.createdAt,
        completeDate: data?.completeDate,
      });
    }
  }, [data]);
  return (
    <>
      {isModalOpen && (
        <Modal open={isModalOpen} title="상담이력" close={handleCloseModal}>
          <StyledForm
            form={form}
            name="ConsultantDetail"
            colon={false}
            type="modal"
          >
            <StyledFormItem name="regNo" label="접수번호">
              <StyledInput readOnly />
            </StyledFormItem>
            <StyledFormItem name="statusCd" label="처리결과">
              <StyledInput readOnly />
            </StyledFormItem>
            <StyledFormItem name="incomingCd" label="인입분류">
              <StyledInput readOnly />
            </StyledFormItem>
            <StyledFormItem name="orgName" label="회원 분류">
              <StyledInput readOnly />
            </StyledFormItem>
            <StyledFormItem name="csCls2" label="상담분류">
              <StyledInput readOnly />
            </StyledFormItem>
            <StyledFormItem
              name="csContent"
              label="상담내용"
              style={{
                gridColumn: '1 / span 3',
              }}
            >
              <StyledTextArea rows={4} style={{ resize: 'none' }} readOnly />
            </StyledFormItem>
            <StyledFormItem
              name="prsContent"
              label="처리내용"
              type="column"
              style={{
                gridColumn: '1 / span 3',
              }}
            >
              <StyledTextArea rows={4} style={{ resize: 'none' }} readOnly />
            </StyledFormItem>
            <StyledFormItem name="createdAt" label="접수날짜">
              <StyledInput readOnly />
            </StyledFormItem>
            <StyledFormItem name="completeDate" label="완료날짜">
              <StyledInput readOnly />
            </StyledFormItem>
          </StyledForm>
        </Modal>
      )}
    </>
  );
};

export default ConsultantDetail;
