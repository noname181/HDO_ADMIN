import { useEffect } from 'react';

// 스타일
import { ModalFooter } from 'components/common/Modal/Modal';

// 패키지
import { Form } from 'antd';

// 스타일
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledRadio,
  StyledRadioBtn,
} from 'components/common/test/Styled.ant';
import { putApi } from 'apis/putApi';
import { category } from 'utils/stationUtils';
import { type OrganizationInterface } from 'interfaces/ICommon';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';

const ContractorInfo = ({
  state,
  setState,
  contractorData,
  setIsModalOpen,
  handleCloseModal,
}: any) => {
  const [form] = Form.useForm();

  // function handleCloseModal() {
  //   setIsModalOpen(false);
  //   form.resetFields();
  // }
  const { loading, error, data, getData } =
    useGetDataWtTrigger<OrganizationInterface>();

  useEffect(() => {
    if (contractorData !== '') {
      void getData({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/v1/orgs/${contractorData.id}`,
      });
    }
  }, [contractorData]);

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
    // setIsModalOpen(true);
  }, [data]);

  // useEffect(() => {
  //   if (contractorData !== '') {
  //     form.setFieldsValue({
  //       category: category(contractorData?.category),
  //       name: contractorData?.name,
  //       area: contractorData?.area,
  //       branch: contractorData?.branch,
  //       closed: contractorData?.closed,
  //       bizRegNo: contractorData?.bizRegNo,
  //       address: contractorData?.nomaskaddress,
  //       contactName: contractorData?.nomaskcontactName,
  //       contactPhoneNo: contractorData?.nomaskcontactPhoneNo,
  //       contactEmail: contractorData?.nomaskcontactEmail,
  //     });
  //     // 모달 열림
  //     setIsModalOpen(true);
  //   }
  // }, [contractorData]);

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
        url: `/orgs/${contractorData.id as string}`,
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
        // form.resetFields();
        void onFinish(values);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <StyledForm form={form} name="contractor-edit" colon={false}>
        <StyledFormItem label="구분" name="category" required>
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
              message: '연락처를 입력해주세요',
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
          rules={[
            { required: true, message: '이메일을 입력해주세요.' },
            {
              type: 'email',
              message: '이메일 형식이 아닙니다.',
            },
          ]}
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
          rules={[
            { required: true, message: '사업자번호를 입력해주세요.' },
            {
              pattern: /^[0-9]+$/g,
              message: '숫자만 입력하세요',
            },
          ]}
        >
          <StyledInput
            placeholder="사업자번호 입력"
            maxLength={11}
            minLength={9}
          />
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

export default ContractorInfo;
