import { type Dispatch, type SetStateAction } from 'react';

import { Form } from 'antd';
import { putApi } from 'apis/putApi';

import { type StateInterface } from 'interfaces/ICommon';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
} from 'components/common/test/Styled.ant';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { DCol, DContainer, DRow, ItemInfo } from '../style';
import { Button } from 'components/common/Button/Button';

interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>> | any;
  isEditOpen: boolean;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
  setCSMainId: Dispatch<SetStateAction<number | ''>>;
  cSMainId: number | '';
}

export const CSMainEdit = ({
  state,
  setState,
  isEditOpen,
  setIsEditOpen,
  setCSMainId,
  cSMainId,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  function handleCloseModal() {
    setIsEditOpen(false);
    setCSMainId('');
    form.resetFields();
  }
  // const { loading, error, data, getData } = useGetDataWtTrigger<ICoupon>();

  // useEffect(() => {
  //   if (cSMainId !== '') {
  //     void getData({
  //       url: `/cs-main/${cSMainId}`,
  //     });
  //   }
  // }, [cSMainId]);

  // api 호출 후 data를 받아오면 실행
  // useEffect(() => {
  //   if (data !== null) {
  //     // 모달 열림
  //     form.setFieldsValue({
  //       number: data?.number,
  //       division: data?.division,
  //       information: data.information,
  //       isUsed: data.isUsed,
  //     });
  //   }
  // }, [data]);

  async function onFinish(values: any) {
    // const newData = {
    //   number: values.number,
    //   division: values.division,
    //   information: values.information,
    //   isUsed: values.isUsed,
    // };
    // await putApi(
    //   {
    //     url: `/cs-main/${cSMainId}`,
    //     data: newData,
    //   },
    //   setState,
    // );
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
  return (
    <Modal
      open={isEditOpen}
      title="이관 처리 내용 수정"
      close={handleCloseModal}
    >
      <StyledForm
        form={form}
        name="CSMainEdit"
        colon={false}
        type="modal"
        gridcol="1fr"
        initialValues={{
          isUsed: false,
        }}
      >
        <DContainer>
          <DRow>
            <DCol style={{ borderRight: '1px solid var(--btn-gray-300)' }}>
              <ItemInfo label="접수번호" value={1234} />
              <ItemInfo label="회원분류" value={'비회원'} />
              <ItemInfo label="인입연락처" value={'010-0192-xxxx'} />
              <ItemInfo label="접수분류" value={'보류'} />
              <ItemInfo label="접수처리상태" value={'진행중'} />
            </DCol>
            <DCol
              style={{
                borderRight: '1px solid var(--btn-gray-300)',
                paddingRight: '14px',
              }}
            >
              <ItemInfo label="사용자 ID" value={1234}>
                <Button onClick={() => {}}>조회/검색</Button>
              </ItemInfo>
              <ItemInfo label="연락처" value={'010-8149-xxxx'}>
                <Button onClick={() => {}}>조회/검색</Button>
              </ItemInfo>
              <ItemInfo label="주소" value={'address'} />
              <ItemInfo label="email" value={'보류'}></ItemInfo>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => {}}>문자보내기</Button>
              </div>
            </DCol>
            <DCol>
              <div>
                <Button onClick={() => {}}>결제내역 보기</Button>
              </div>
              <div>
                <Button onClick={() => {}}>상담내역 보기</Button>
              </div>
              <div>
                <Button onClick={() => {}}>차량정보 보기</Button>
              </div>
              <div>
                <Button onClick={() => {}}>스크립트 보기</Button>
              </div>
            </DCol>
          </DRow>
          <hr className="nl-line" />
          <DRow style={{ marginTop: 20 }}>
            <DCol style={{ minWidth: 'calc(100% - 200px)' }}>
              <StyledFormItem
                name="c_detail"
                label="상담내용"
                // rules={[
                //   {
                //     required: true,
                //     message: '상담내용를 입력해주세요.',
                //   },
                // ]}
              >
                <StyledInput />
              </StyledFormItem>
              <StyledFormItem
                name="process_detail"
                label="처리내용"
                // rules={[
                //   {
                //     required: true,
                //     message: '처리내용를 입력해주세요.',
                //   },
                // ]}
              >
                <StyledInput />
              </StyledFormItem>
            </DCol>
            <DCol>
              <DRow style={{ justifyContent: 'flex-end' }}>
                <Button color="reset" onClick={() => {}}>
                  다운로드
                </Button>
                <Button color="reset" onClick={() => {}}>
                  듣기
                </Button>
              </DRow>
            </DCol>
          </DRow>
          <DRow style={{ justifyContent: 'flex-end', marginTop: 20 }}>
            <Button onClick={() => {}}>보류</Button>
            <Button onClick={() => {}}>반려</Button>
            <Button onClick={() => {}}>환불요청</Button>
            <Button onClick={() => {}}>승인요청</Button>
            <Button onClick={() => {}}>이관</Button>
            <Button onClick={() => {}}>완료</Button>
            <Button onClick={() => {}}>전화끊기</Button>
          </DRow>
        </DContainer>
      </StyledForm>
      <ModalFooter
        okText="저장"
        closeText="취소"
        close={handleCloseModal}
        onOk={handleOk}
      />
    </Modal>
  );
};
