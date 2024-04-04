import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';

import { Form } from 'antd';
import { postApi } from 'apis/postApi';
import { defaultUrl } from 'apis/api.helpers';
import { putApi } from 'apis/putApi';
import { type StateInterface, type ITroubleReport } from 'interfaces/ICommon';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  IconDownload,
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledRadio,
  StyledRadioBtn,
  StyledTextArea,
  StyltedIMG,
  StyltedIMGMany,
} from 'components/common/test/Styled.ant';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';

interface TroubleReportProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>> | any;
  setTroubleReportId: Dispatch<SetStateAction<number | ''>>;
  troubleReportId: number | '';
  isEditOpen: boolean;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
}

export const TroubleReportDetail = ({
  state,
  setState,
  setTroubleReportId,
  troubleReportId,
  isEditOpen,
  setIsEditOpen,
}: TroubleReportProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [fileUrl, setFileUrl] = useState<any[]>();
  const apiUrl = process.env.REACT_APP_API_URL;
  function handleCloseModal() {
    setIsEditOpen(false);
    setTroubleReportId('');
    form.resetFields();
    setFileUrl([]);
  }
  const { loading, error, data, getData } =
    useGetDataWtTrigger<ITroubleReport>();
  useEffect(() => {
    // bannereventId를 받아오면 api 호출
    if (troubleReportId !== '') {
      void getData({
        url: `/trouble/${troubleReportId}`,
      });
    }
  }, [troubleReportId]);

  // api 호출 후 data를 받아오면 실행
  useEffect(() => {
    if (data !== null) {
      // 모달 열림
      form.setFieldsValue({
        troubleTitle: data?.troubleTitle,
        troubleDesc: data?.troubleDetail,
        statusReport: data?.statusReport,
        chgs_name: data?.chgs_name,
        chg_charger_id: data?.chg_charger_id,
        reportDate: data?.reportDate,
        reportPerson:
          String(data?.userName) +
          (data?.accountId ? '( ' + String(data?.accountId) + ' )' : ''),
        content: data?.content,
      });
      if (
        data?.mediaUrl &&
        data?.mediaUrl !== null &&
        data?.mediaUrl?.length !== 0
      ) {
        setFileUrl(data?.mediaUrl);
      }
      // console.log(data?.mediaUrl);

      setIsEditOpen(true);
    }
  }, [data]);

  async function onFinish(values: any) {
    const newData = {
      troubleTitle: values.troubleTitle,
      troubleDesc: values.troubleDesc,
      reportStatus: values.statusReport,
      content: values.content,
    };
    await putApi(
      {
        url: `/trouble/${troubleReportId}`,
        data: newData,
      },
      setState,
    );
  }
  function handleOk() {
    form
      .validateFields()
      .then((values: any) => {
        // form.resetFields();
        void onFinish(values);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
  useEffect(() => {
    // 등록 완료
    if (state.isSuccess) {
      // 모달 창 닫기
      handleCloseModal();
    }
    // 등록 에러
    if (state.error?.errorCode) {
      const textError = state?.error?.errorMessage ?? state?.error?.message;
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: state.error?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
        content: textError ?? 'api 호출 에러 : 콘솔창 확인',
      });
    }
  }, [state]);
  const isKoreanText = (text: string): boolean => {
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    return koreanRegex.test(text);
  };
  const downloadFile = (fileURL: string) => {
    if (!fileURL || fileURL === '') {
      setAlertModal((prev) => ({
        ...prev,
        open: true,
        content: '다운로드할 파일이 없습니다.',
      }));
      return;
    }
    // window.location.href = fileURL;
    const url = fileURL;
    const spFileName = url.split('/').pop();
    if (isKoreanText(spFileName as string)) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        content: '한글파일명은 지원하지 않습니다.',
      });
      return;
    }
    const axios = hdoInstance();
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) {
      return;
    }

    axios
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`/download-file?path=upload/${spFileName}`, {
        responseType: 'blob',
        timeout: 7200000,
      })
      .then((response) => {
        const blob = new Blob([response?.data]);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.target = '_blank';
        link.download = spFileName ?? '충전기 전송파일 관리';
        link.click();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <Modal open={isEditOpen} title="고장 신고 관리" close={handleCloseModal}>
      <StyledForm
        form={form}
        name="troublereportAddData"
        colon={false}
        type="modal"
        gridcol="1fr"
        initialValues={{
          reportStatus: 'REPORTED',
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
            <StyledFormItem name="chgs_name" label="충전소 명">
              <StyledInput readOnly />
            </StyledFormItem>
          </li>
          <li>
            <StyledFormItem name="chg_charger_id" label="충전기 ID">
              <StyledInput readOnly />
            </StyledFormItem>
          </li>
          <li>
            <StyledFormItem name="reportDate" label="등록 일시">
              <StyledInput readOnly />
            </StyledFormItem>
          </li>
          <li>
            <StyledFormItem name="reportPerson" label="이름(아이디)">
              <StyledInput readOnly />
            </StyledFormItem>
          </li>
          <li>
            <StyledFormItem name="troubleTitle" label="카테고리">
              <StyledInput readOnly />
            </StyledFormItem>
          </li>
          <li>
            <StyledFormItem name="troubleDesc" label="내용">
              <StyledTextArea rows={4} style={{ resize: 'none' }} readOnly />
            </StyledFormItem>
          </li>
          <StyledFormItem label="상태" name="statusReport">
            <StyledRadio>
              <StyledRadioBtn value="REPORTED">신고</StyledRadioBtn>
              <StyledRadioBtn value="ACCEPTED">접수</StyledRadioBtn>
              <StyledRadioBtn value="INPROGRESS">처리중</StyledRadioBtn>
              <StyledRadioBtn value="COMPLETED">완료</StyledRadioBtn>
            </StyledRadio>
          </StyledFormItem>
          {fileUrl && (
            <li
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto calc(100% - 150px)',
              }}
            >
              <div style={{ lineHeight: '40px' }}>이미지 첨부</div>
              <div className="nl-list-image">
                {fileUrl?.map((item) => {
                  const spFileName = item.split('/').pop();
                  return (
                    <>
                      {item && (
                        <StyltedIMGMany>
                          <img
                            src={
                              String(apiUrl) +
                              '/view-file?path=upload/' +
                              String(spFileName)
                            }
                            alt="troubleImage"
                          />
                          <IconDownload
                            onClick={() => {
                              downloadFile(String(item));
                            }}
                          />
                        </StyltedIMGMany>
                      )}
                    </>
                  );
                })}
              </div>
            </li>
          )}
          <li>
            <StyledFormItem name="content" label="처리 결과">
              <StyledTextArea rows={6} style={{ resize: 'none' }} />
            </StyledFormItem>
          </li>
        </ul>
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

export default TroubleReportDetail;
