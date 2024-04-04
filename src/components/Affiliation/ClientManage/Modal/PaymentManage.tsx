import { useState } from 'react';
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
// 패키지

import { Form } from 'antd';

// api
// import { defaultUrl } from 'apis/api.helpers';

// 스타일
import { StyledForm } from 'components/common/test/Styled.ant';
import { Button } from 'components/common/Button/Button';
// import { Button } from 'components/common/Button/Button';

const PaymentManage = ({ showPaymentManage, setShowPaymentManage }: any) => {
  const [form] = Form.useForm();

  function handleCloseModal() {
    setShowPaymentManage(false);
    form.resetFields();
  }
  async function onFinish(values: any) {
    // const editData = {
    //   fullname: values.name,
    //   name: values.name,
    //   contactName: values.contactName,
    //   contactPhoneNo: values.contactPhoneNo,
    //   contactEmail: values.contactEmail,
    //   closed: values.closed,
    //   bizRegNo: values.bizRegNo,
    //   address: values.address,
    // };
    // await putApi(
    //   {
    //     url: `/orgs/${clientData.id as string}`,
    //     data: editData,
    //   },
    //   setState,
    // );
  }
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
    <Modal
      open={showPaymentManage}
      title="결제수단 관리"
      close={handleCloseModal}
      style={{ width: 440 }}
    >
      <StyledForm form={form} name="paymentManage" colon={false} gridcol="100%">
        <div>
          <p className="nl-lbl">기본</p>
          <div className="nl-card">
            <div className="nl-card-info">
              <div className="nl-card-logo">
                <img src="/assets/img/Mastercard_logo.png" alt="Mastercard" />
              </div>
              <div>
                <div className="nl-card-number">비씨*******8984</div>
                <div className="nl-card-date">유효기간: 01/26</div>
              </div>
            </div>

            <div className="nl-card-action">
              <div>기본</div>
              <div>삭제</div>
            </div>
          </div>
          <p className="nl-lbl" style={{ marginTop: '20px' }}>
            백업
          </p>
          <div className="nl-card">
            <div className="nl-card-info">
              <div className="nl-card-logo">
                <img src="/assets/img/VisaLogo.png" alt="Visa" />
              </div>
              <div>
                <div className="nl-card-number">Visa*******4922</div>
                <div className="nl-card-date">유효기간: 05/24</div>
              </div>
            </div>

            <div className="nl-card-action">
              <div>백업</div>
              <div>삭제</div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            <Button
              size="md"
              color="primary"
              icon="/assets/img/icon/icon-add-w.png"
              alt="등록"
              onClick={() => {}}
            >
              등록
            </Button>
          </div>
        </div>
      </StyledForm>
      <ModalFooter
        okText="수정"
        closeText="취소"
        close={handleCloseModal}
        onOk={handleOk}
      />
    </Modal>
  );
};

export default PaymentManage;
