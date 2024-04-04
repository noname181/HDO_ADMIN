import { useEffect, useState } from 'react';

// 스타일
import { ModalFooter } from 'components/common/Modal/Modal';

// 패키지
import { Form } from 'antd';
// 스타일
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
} from 'components/common/test/Styled.ant';

import { category } from 'utils/stationUtils';
import { type OrganizationInterface } from 'interfaces/ICommon';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
import { AreaSelectList, BranchSelectList } from 'utils/codelookup';
import { putApiUpdate } from 'apis/putApi';

const StationInfo = ({
  state,
  setState,
  stationData,
  handleCloseModal,
  isModalOpen,
}: any) => {
  const [form] = Form.useForm();

  const [areaNo, setAreaNo] = useState('');

  // function handleCloseModal() {
  //   setIsModalOpen(false);
  //   form.resetFields();
  // }
  const { loading, error, data, getData } =
    useGetDataWtTrigger<OrganizationInterface>();

  useEffect(() => {
    if (stationData !== '' && isModalOpen) {
      void getData({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/v1/orgs/${stationData.id}`,
      });
    }
  }, [stationData]);

  useEffect(() => {
    if (data) {
      // console.log(data);
      form.setFieldsValue({
        category: category(data?.category),
        fullname: data?.fullname,
        name: data?.name,
        area: data?.areaName,
        branch: data?.branch,
        closed: data?.closed ? '정지' : '운영',
        bizRegNo: data?.bizRegNo,
        address: data?.address,
        haveCarWash: data?.haveCarWash === 'Y' ? '있음' : '없음',
        haveCVS: data?.haveCVS === 'Y' ? '있음' : '없음',
        contactName: data?.contactName,
        contactPhoneNo: data?.contactPhoneNo,
        contactEmail: data?.contactEmail,
        STN_STN_ID: data?.STN_STN_ID,
        STN_CUST_NO: data?.STN_CUST_NO,
        STN_COST_CT: data?.STN_COST_CT,
        STN_PAL_CT: data?.STN_PAL_CT,
      });
      setAreaNo(data?.areaName ?? '');
    }
  }, [data]);

  // useEffect(() => {
  //   if (stationData !== null) {
  //     // setAreaNo(stationData?.area);
  //     form.setFieldsValue({
  //       category: category(stationData?.category),
  //       fullname: stationData?.fullname,
  //       name: stationData?.name,
  //       area:
  //         stationData?.category === 'EV_DIV'
  //           ? 'EV사업부'
  //           : stationData?.areaName,
  //       branch:
  //         stationData?.category === 'EV_DIV'
  //           ? 'EV사업부'
  //           : stationData?.branchName,
  //       closed: stationData?.closed ? '정지' : '운영',
  //       bizRegNo: stationData?.bizRegNo,
  //       address: stationData?.nomaskaddress,
  //       haveCarWash: stationData?.haveCarWash ? '없음' : '없음',
  //       haveCVS: stationData?.haveCVS ? '없음' : '없음',
  //       contactName: stationData?.nomaskcontactName,
  //       contactPhoneNo: stationData?.nomaskcontactPhoneNo,
  //       contactEmail: stationData?.nomaskcontactEmail,
  //       STN_STN_ID: stationData?.STN_STN_ID,
  //       STN_CUST_NO: stationData?.STN_CUST_NO,
  //       STN_COST_CT: stationData?.STN_COST_CT,
  //       STN_PAL_CT: stationData?.STN_PAL_CT,
  //     });
  //   }
  // }, [stationData]);

  async function onFinish(values: any) {
    const editData = {
      area: values?.area,
      branch: values?.branch,
    };

    await putApiUpdate(
      {
        url: `/orgs/${stationData.id as string}`,
        data: editData,
      },
      setState,
    );
  }

  useEffect(() => {
    if (state.isSuccess) {
      setAreaNo('');
      form.resetFields();
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
      <StyledForm form={form} name="statio-info-model" colon={false}>
        <StyledFormItem label="구분" name="category">
          <StyledInput readOnly />
        </StyledFormItem>
        {/* <StyledFormItem label="세차장" name="haveCarWash">
          <StyledInput readOnly />
        </StyledFormItem>
        <StyledFormItem label="편의점" name="haveCVS">
          <StyledInput readOnly />
        </StyledFormItem> */}
        <AreaSelectList
          form
          onChange={(e) => {
            setAreaNo(e);
            form.setFieldValue('branch', null);
          }}
          rules={[{ required: true, message: '부문을 입력해주세요' }]}
        />
        <BranchSelectList
          form
          areaNo={areaNo}
          placeholder="지사를 선택해주세요"
          rules={[{ required: true, message: '지사을 입력해주세요' }]}
        />
        {/* <StyledFormItem label="부문" name="area">
          <StyledInput readOnly />
        </StyledFormItem>
        <StyledFormItem label="지사" name="branch">
          <StyledInput readOnly />
        </StyledFormItem> */}
        <StyledFormItem label="운영" name="closed">
          <StyledInput readOnly />
        </StyledFormItem>
        {/* <StyledFormItem label="세차장" name="haveCarWash">
          <StyledRadio disabled={true}>
            <StyledRadioBtn value="Y">있음</StyledRadioBtn>
            <StyledRadioBtn value="N">없음</StyledRadioBtn>
          </StyledRadio>
        </StyledFormItem> */}
        {/* <StyledFormItem label="편의점" name="haveCVS">
          <StyledRadio disabled={true}>
            <StyledRadioBtn value="Y">있음</StyledRadioBtn>
            <StyledRadioBtn value="N">없음</StyledRadioBtn>
          </StyledRadio>
        </StyledFormItem> */}
        {/* <AreaSelectList
          form
          onChange={(e) => {
            setAreaNo(e);
            form.setFieldValue('branch', null);
          }}
          disabled={true}
        />
        <BranchSelectList
          form
          areaNo={areaNo}
          placeholder="지사를 선택해주세요"
          disabled={true}
        /> */}
        {/* <StyledFormItem label="운영" name="closed">
          <StyledRadio disabled={true}>
            <StyledRadioBtn value={false}>운영</StyledRadioBtn>
            <StyledRadioBtn value={true}>정지</StyledRadioBtn>
          </StyledRadio>
        </StyledFormItem> */}
        <StyledFormItem label="사업장명" name="fullname">
          <StyledInput placeholder="사업장명" readOnly />
        </StyledFormItem>
        {/* <StyledFormItem label="약칭" name="name">
          <StyledInput placeholder="약칭" readOnly />
        </StyledFormItem> */}
        <StyledFormItem label="사업자번호" name="bizRegNo">
          <StyledInput placeholder="사업자번호" readOnly />
        </StyledFormItem>
        <StyledFormItem label="대표자" name="contactName">
          <StyledInput placeholder="대표자" readOnly />
        </StyledFormItem>
        <StyledFormItem label="연락처" name="contactPhoneNo">
          <StyledInput placeholder="연락처" readOnly />
        </StyledFormItem>
        {/* <StyledFormItem
          label="이메일"
          name="contactEmail"
          rules={[
            {
              type: 'email',
              message: '이메일 형식이 아닙니다.',
            },
          ]}
        >
          <StyledInput placeholder="이메일" readOnly />
        </StyledFormItem> */}
        <StyledFormItem label="사업장 ID" name="STN_STN_ID">
          <StyledInput placeholder="사업장 ID" readOnly />
        </StyledFormItem>
        <StyledFormItem
          label="주소"
          name="address"
          style={{ gridColumn: '1 / span 2' }}
        >
          <StyledInput placeholder="주소" readOnly />
        </StyledFormItem>

        <StyledFormItem label="사업장 고객번호" name="STN_CUST_NO">
          <StyledInput placeholder="사업장고객번호" readOnly />
        </StyledFormItem>
        {/* <StyledFormItem label="Cost Cent." name="STN_COST_CT">
          <StyledInput placeholder="Cost Cent." />
        </StyledFormItem>
        <StyledFormItem label="Profile Cent." name="STN_PAL_CT">
          <StyledInput placeholder="Profile Cent." />
        </StyledFormItem> */}
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

export default StationInfo;
