import { useEffect } from 'react';

// 패키지
import { Form } from 'antd';

// 스타일
import { ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledRadio,
  StyledRadioBtn,
} from 'components/common/test/Styled.ant';
import { putApi } from 'apis/putApi';
import { category } from 'utils/stationUtils';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
import { type OrganizationInterface } from 'interfaces/ICommon';

const ClientInfo = ({
  clientData,
  setIsModalOpen,
  state,
  setState,
  handleCloseModal,
}: any) => {
  const [form] = Form.useForm();
  const { loading, error, data, getData } =
    useGetDataWtTrigger<OrganizationInterface>();

  useEffect(() => {
    if (clientData !== '') {
      void getData({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/v1/orgs/${clientData.id}`,
      });
    }
  }, [clientData]);

  useEffect(() => {
    if (data) {
      // console.log(data);
      form.setFieldsValue({
        category: category(data?.category),
        name: data?.name,
        // area: data?.areaName,
        // branch: data?.branch,
        closed: data?.closed,
        bizRegNo: data?.bizRegNo,
        address: data?.address,
        contactName: data?.contactName,
        contactPhoneNo: data?.contactPhoneNo,
        contactEmail: data?.contactEmail,
      });
    }
  }, [data]);
  // function handleCloseModal() {
  //   setIsModalOpen(false);
  //   form.resetFields();
  // }

  // useEffect(() => {
  //   if (clientData !== '') {
  //     form.setFieldsValue({
  //       category: category(clientData?.category),
  //       name: clientData?.name,
  //       area: clientData?.area,
  //       branch: clientData?.branch,
  //       closed: clientData?.closed,
  //       bizRegNo: clientData?.bizRegNo,
  //       address: clientData?.nomaskaddress,
  //       contactName: clientData?.nomaskcontactName,
  //       contactPhoneNo: clientData?.nomaskcontactPhoneNo,
  //       contactEmail: clientData?.nomaskcontactEmail,
  //     });
  //   }
  // }, [clientData]);

  async function onFinish(values: any) {
    const editData = {
      fullname: values.name,
      name: values.name,
      contactName: values.contactName,
      contactPhoneNo: values.contactPhoneNo,
      contactEmail: values.contactEmail,
      closed: values.closed,
      bizRegNo: values.bizRegNo,
      address: values.address,
    };

    await putApi(
      {
        url: `/orgs/${clientData.id as string}`,
        data: editData,
      },
      setState,
    );
  }

  useEffect(() => {
    if (state.isSuccess) {
      handleCloseModal();
    }
  }, [state]);

  function handleOk() {
    form
      .validateFields()
      .then((values: any) => {
        void onFinish(values);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <StyledForm form={form} name="client-edit" colon={false}>
        <StyledFormItem label="구분" name="category">
          <StyledInput readOnly />
        </StyledFormItem>
        <StyledFormItem
          label="소속명"
          name="name"
          rules={[{ required: true, message: '소속명을 입력해주세요.' }]}
        >
          <StyledInput placeholder="소속명 입력" />
        </StyledFormItem>
        <StyledFormItem label="운영" name="closed" required>
          <StyledRadio>
            <StyledRadioBtn value={false}>운영</StyledRadioBtn>
            <StyledRadioBtn value={true}>정지</StyledRadioBtn>
          </StyledRadio>
        </StyledFormItem>
        <StyledFormItem
          label="대표자"
          name="contactName"
          rules={[{ required: true, message: '대표자를 입력해주세요.' }]}
        >
          <StyledInput placeholder="대표자 입력" />
        </StyledFormItem>
        <StyledFormItem
          label="연락처"
          name="contactPhoneNo"
          // rules={[{ required: true, message: '연락처를 입력해주세요.' }]}
          rules={[
            {
              required: true,
              message: '연락처를 입력해주세요.',
            },
            {
              pattern: /^[0-9]+$/g,
              message: '숫자만 입력하세요.',
            },
          ]}
        >
          <StyledInput placeholder="연락처 입력" />
        </StyledFormItem>
        <StyledFormItem
          label="이메일"
          name="contactEmail"
          rules={[{ required: true, message: '이메일을 입력해주세요.' }]}
        >
          <StyledInput placeholder="이메일 입력" />
        </StyledFormItem>
        <StyledFormItem
          label="주소"
          name="address"
          style={{ gridColumn: '1 / span 2' }}
          rules={[{ required: true, message: '주소를 입력해주세요.' }]}
        >
          <StyledInput placeholder="주소 입력" />
        </StyledFormItem>
        <StyledFormItem
          label="사업자번호"
          name="bizRegNo"
          rules={[{ required: true, message: '사업자번호를 입력해주세요.' }]}
        >
          <StyledInput placeholder="사업자번호 입력" />
        </StyledFormItem>
      </StyledForm>
      <ModalFooter
        okText="수정"
        closeText="취소"
        close={handleCloseModal}
        onOk={handleOk}
      />
    </>
  );
};

export default ClientInfo;
