import { useEffect, useState } from 'react';
import { Form, Select } from 'antd';
import ReactDOM from 'react-dom';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledRadio,
  StyledRadioBtn,
  StyledSelect,
  StyledTextArea,
} from 'components/common/test/Styled.ant';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { DCol, DContainer, DRow, ItemInfo } from '../CSHome/style';
import { Button } from 'components/common/Button/Button';
import { GridContainer, GridRefetch, Spinner } from 'styles/style';
import { hdoInstance } from 'apis/hdoInstance';
import { type ConsultantAllData } from 'interfaces/IConsultant';
import { useLocation, useNavigate } from 'react-router-dom';
import { userAuthState } from 'recoil/authState';
import { Record, type RecordType } from '../CSHome/Popup/Record';

interface csLogInterface {
  data: [
    {
      regNo: string;
      createdAt: string;
      completeDate: string | null;
      statusNm: number | null;
      prsContent: string | null;
      hisCreatedAt: string | null;
      dept: string | null;
      chage_person: string | null;
    },
  ];
}

const AsConsultationGrid = () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [loading, setLoading] = useState(false);
  const [resultConData, setResultConData] = useState<ConsultantAllData>();
  const [csLog, setCsLog] = useState<csLogInterface>();
  const queryParams = new URLSearchParams(location.search);
  const [isMoStatue, setIsMoStatue] = useState('nothing');
  const idParam = queryParams.get('id');
  const regNoParam = queryParams.get('regNo');
  const flagParam = queryParams.get('flag');
  const incomingParam = queryParams.get('incoming');
  const [{ user }] = useRecoilState(userAuthState);
  const navigate = useNavigate();

  useEffect(() => {
    if (idParam) {
      void fetchDetail(idParam);
    }
  }, [idParam]); // csId가 변경될 때마다 이 useEffect는 재실행됩니다.

  // 상담 내역 디테일 데이터
  const fetchDetail = async (regNo: string) => {
    const url = `/v1/web/consultation?id=${regNo}`;
    const accessToken = localStorage.getItem('accessToken') ?? '';

    const axios = hdoInstance();
    await axios(url, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((result) => {
        setResultConData(result.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (resultConData) {
      let statusCdValue = '';
      statusCdValue = resultConData?.statusCd;
      switch (statusCdValue) {
        case '':
          statusCdValue = '진행중';
          break;
        case 'HOL':
          statusCdValue = '보류';
          break;
        case 'ALL':
          statusCdValue = '전체';
          break;
        case 'COM':
          statusCdValue = '완료';
          break;
        case 'APR':
          statusCdValue = '승인';
          break;
        case 'REF':
          statusCdValue = '환불';
          break;
        case 'ARR':
          statusCdValue = '승인요청';
          break;
        case 'TRA':
          statusCdValue = '이관';
          break;
        case 'RCT':
          statusCdValue = '회수';
          break;
        default:
          statusCdValue = '진행중';
      }
      if (
        // AS에게 이관된 문서 체크
        (user?.Org?.id.toString() === resultConData?.transPart?.toString() &&
          resultConData?.statusCd === 'TRA') ||
        // AS에게 이관된 문서 중 상태값 HOL로 변경한 건
        (user?.Org?.id.toString().trim() ===
          resultConData.UpdateCon_orgId?.toString().trim() &&
          (resultConData?.statusCd === 'HOL' ||
            resultConData?.statusCd === 'RCT'))
      ) {
        setIsMoStatue('canModify');
      } else if (
        // AS 업체가 승인 요청한건
        resultConData?.statusCd === 'ARR' &&
        user?.Org.id.toString() === resultConData?.UpdateCon_orgId?.toString()
      ) {
        // AS팀이 승인 요청 했을 때 수정 불가능
        setIsMoStatue('reModify');
      } else {
        setIsMoStatue('nothing');
      }
      form.setFieldsValue({
        id: resultConData?.id,
        regNo: resultConData?.regNo,
        csContent: resultConData?.csContent,
        prsContent: resultConData?.prsContent,
        consultation: resultConData?.csCls1,
        statusCdA: statusCdValue,
        statusCd: statusCdValue,
        phoneNo: resultConData?.phoneNo,
        csClass: resultConData.csClass,
        csCls1: resultConData?.csCls1,
        createdAt: resultConData?.createdAt,
        completedData: resultConData?.completeDate,
        transPart: resultConData?.transPart,
      });
    }
  }, [resultConData]);

  // 상담 이력
  const fetchCsLog = async () => {
    let idParamValue = '';
    if (idParam) {
      idParamValue = idParam;
    }

    const url = `/v1/web/cs-log?id=${idParamValue}`;
    const accessToken = localStorage.getItem('accessToken') ?? '';

    const axios = hdoInstance();
    await axios(url, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((result) => {
        const regNo = form.getFieldValue('regNo');
        const createdAt = form.getFieldValue('createdAt');
        const completedDate = form.getFieldValue('completeDate');
        const csData = result.data;

        const logData = {
          regNo,
          createdAt,
          completedDate,
          csData,
        };
        setCsLog({ data: result.data });
        openPopup(Record, logData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const openPopup = (Component: RecordType, data: any) => {
    const width = 1200;
    const height = 720;
    const top = (window.innerHeight - height) / 2;
    const left = (window.innerWidth - width) / 2;

    const popupWindow = window.open(
      '',
      '_blank',
      `width=${width},height=${height},top=${top},left=${left}`,
    );

    if (!popupWindow) {
      console.error('Popup window could not be opened.');
      return;
    }

    popupWindow.document.write('<div id="popup-root"></div>');

    const popupRoot = popupWindow.document.getElementById('popup-root');

    if (!popupRoot) {
      console.error('Popup root element could not be found.');
      return;
    }

    const closePopup = () => {
      popupWindow.close();
    };
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(
      <Component closePopup={closePopup} data={data} />,
      popupRoot,
    );
  };

  const modifyConsultant = async () => {
    const formData = form.getFieldsValue();
    formData.updatedWho = user?.id;
    if (formData.statusCd === 'ARR') {
      formData.transPart = '2';
    }

    if (formData.statusCd === 'COM') {
      const now = new Date();
      const formattedDateTime = `${now.getFullYear()}-${String(
        now.getMonth() + 1,
      ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
        now.getHours(),
      ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
        now.getSeconds(),
      ).padStart(2, '0')}`;
      formData.completeDate = formattedDateTime;
    }

    const consultationId: string = form.getFieldValue('id');
    const url = `/v1/web/cs/${consultationId}`;
    const accessToken = localStorage.getItem('accessToken') ?? '';
    const axios = hdoInstance();

    await axios
      .put(url, formData, {
        headers: {
          Authorization: accessToken,
        },
      })
      .then((result) => {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'success',
          title: '저장 상태 알림',
          content: '상담 내용이 저장되었습니다',
        });
        if (formData.statusCd === 'TRA' || formData.statusCd === 'ARR') {
          if (idParam) {
            void saveTrans(idParam, formData.statusCd);
          }
        }
        void fetchDetail(consultationId);
      })
      .catch((error) => {
        console.log(error);
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: '저장 상태 알림',
          content: '저장에 실패하였습니다, 관리자에게 문의하세요',
        });
      });
  };

  const saveTrans = async (regNo: string, statusCd: string) => {
    const formData = form.getFieldsValue();
    if (statusCd === 'ARR') {
      formData.transPart = '2';
    }
    const url = `/v1/web/cs-transfer/${regNo}`;
    const accessToken = localStorage.getItem('accessToken') ?? '';
    const axios = hdoInstance();
    await axios
      .post(url, formData, {
        headers: {
          Authorization: accessToken,
        },
      })
      .then((result) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const handleModify = () => {
    setAlertModal({
      ...alertModal,
      open: true,
      type: 'alert',
      title: '수정',
      content: '수정 하시겠습니까?',
      okText: '확인',
      onOk() {
        void modifyConsultant();
      },
    });
  };

  const search = () => {};
  return (
    <>
      <GridRefetch refetch={search} />
      {loading && <Spinner />}
      <GridContainer
        height="calc(100vh - 14.4rem)"
        style={{ marginTop: '14px' }}
      >
        <StyledForm
          form={form}
          name="CSMainAdd"
          colon={false}
          type="modal"
          gridcol="1fr"
          initialValues={{
            csClass: 'ETC',
            csCls1: 'ETC',
            transfer_department: '',
            incomingCd: '',
            regNo: '',
            statusCd: '',
            scrptContent: '',
          }}
          style={{ borderBottom: '0' }}
        >
          <DContainer>
            <DRow>
              <DCol>
                <StyledFormItem name="id" hidden>
                  <StyledInput />
                </StyledFormItem>
                <ItemInfo label="접수번호">
                  <StyledFormItem
                    name="regNo"
                    gridcol="100%"
                    style={{ width: '100%' }}
                  >
                    <StyledInput readOnly />
                  </StyledFormItem>
                </ItemInfo>
                <div hidden>
                  <StyledFormItem name="createdAt">
                    <StyledInput hidden />
                  </StyledFormItem>
                  <StyledFormItem name="completeDate">
                    <StyledInput hidden />
                  </StyledFormItem>
                </div>
                <ItemInfo label="회원분류">
                  <StyledFormItem
                    name="csCls1"
                    gridcol="100%"
                    style={{ width: '100%', pointerEvents: 'none' }}
                  >
                    <StyledSelect>
                      <Select.Option value="DEF">회원</Select.Option>
                      <Select.Option value="ETC">비회원</Select.Option>
                      <Select.Option value="BIZ">법인회원</Select.Option>
                    </StyledSelect>
                  </StyledFormItem>
                </ItemInfo>
                <ItemInfo label="인입연락처">
                  <StyledFormItem
                    name="phoneNo"
                    gridcol="100%"
                    style={{
                      width: '100%',
                      pointerEvents: 'none',
                    }}
                  >
                    <StyledInput />
                  </StyledFormItem>
                </ItemInfo>
                <ItemInfo label="상담 분류">
                  <StyledFormItem
                    name="csClass"
                    gridcol="100%"
                    style={{
                      width: '100%',
                      ...{ pointerEvents: 'none' },
                    }}
                  >
                    <StyledSelect>
                      <Select.Option value="CHG">이용방법</Select.Option>
                      <Select.Option value="BRK">결제문의</Select.Option>
                      <Select.Option value="PAY">장애문의</Select.Option>
                      <Select.Option value="REG">환불</Select.Option>
                      <Select.Option value="CAR">단순 문의</Select.Option>
                      <Select.Option value="ETC">기타</Select.Option>
                    </StyledSelect>
                  </StyledFormItem>
                </ItemInfo>
                <ItemInfo label="처리 상태">
                  <StyledFormItem
                    name="statusCdA"
                    gridcol="100%"
                    style={{ width: '100%', pointerEvents: 'none' }}
                  >
                    <StyledInput></StyledInput>
                  </StyledFormItem>
                  <Button
                    minWidth="70px"
                    onClick={() => {
                      void fetchCsLog();
                    }}
                  >
                    이력
                  </Button>
                </ItemInfo>
              </DCol>
              <DCol>
                <StyledFormItem
                  name="csContent"
                  label="상담내용"
                  type="column"
                  gridcol="100%"
                >
                  <StyledTextArea
                    style={{
                      height: 300,
                      ...((isMoStatue === 'reModify' ||
                        isMoStatue === 'nothing') && { pointerEvents: 'none' }),
                    }}
                  ></StyledTextArea>
                </StyledFormItem>
              </DCol>
              <DCol>
                <StyledFormItem
                  name="prsContent"
                  label="처리내용"
                  type="column"
                  gridcol="100%"
                >
                  <StyledTextArea
                    style={{
                      height: 300,
                      ...((isMoStatue === 'reModify' ||
                        isMoStatue === 'nothing') && { pointerEvents: 'none' }),
                    }}
                  ></StyledTextArea>
                </StyledFormItem>
              </DCol>
            </DRow>
            {isMoStatue === 'canModify' && (
              <StyledFormItem label="처리상태" name="statusCd">
                <StyledRadio>
                  <StyledRadioBtn value="HOL">보류</StyledRadioBtn>
                  <StyledRadioBtn value="ARR">승인요청</StyledRadioBtn>
                </StyledRadio>
              </StyledFormItem>
            )}
            {isMoStatue === 'reModify' && (
              <StyledFormItem label="처리상태" name="statusCd">
                <StyledRadio>
                  <StyledRadioBtn value="RCT">회수</StyledRadioBtn>
                </StyledRadio>
              </StyledFormItem>
            )}
            <DRow>
              <div style={{ flexBasis: '40%' }}></div>
              <div style={{ flexBasis: '60%', paddingLeft: 20 }}>
                <DRow
                  style={{
                    justifyContent: 'space-between',
                    marginTop: 20,
                  }}
                >
                  {(isMoStatue === 'reModify' ||
                    isMoStatue === 'canModify') && (
                    <>
                      <Button onClick={handleModify} minWidth="100px">
                        수정
                      </Button>
                      <Button
                        onClick={() => {
                          navigate('/cs-home');
                        }}
                        minWidth="100px"
                      >
                        목록보기
                      </Button>
                    </>
                  )}
                </DRow>
              </div>
            </DRow>
          </DContainer>
        </StyledForm>
      </GridContainer>
    </>
  );
};
export default AsConsultationGrid;
