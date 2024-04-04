import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Form, Select } from 'antd';
import { type StateCsInterface, type StateInterface } from 'interfaces/ICommon';
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
import { DCol, DContainer, DRow, EmptyMember } from '../style';
import { Button } from 'components/common/Button/Button';
import { DefaultDiv, GridContainer, GridRefetch, Spinner } from 'styles/style';
// import ConsultationGridTable from './ConsultationGridTable';
import { MemberSearch } from '../Model/MemberSearch';
import { Deposition } from '../Model/Deposition';
import { SendMessageNew } from '../Model/SendMessageNew';

import { useLocation, useNavigate } from 'react-router-dom';
import { hdoInstance } from 'apis/hdoInstance';
import {
  type ConsultantAllData,
  type scriptInterface,
  type subGridInterface,
} from 'interfaces/IConsultant';
import { userAuthState } from 'recoil/authState';
import dayjs from 'dayjs';
import { type Record, type RecordType } from '../Popup/Record';
import SearchChargingStation from 'pages/cs/CSHome/Model/SearchCharingStationPopUp';
import Tabs from 'components/common/Tab/Tabs';
import TableConsultationHistory from './Table/TableConsultationHistory';
import TablePaymentHistory from './Table/TablePaymentHistory';
import TableUnExportedPayment from './Table/TableUnExportedPayment';
import TableScript from './Table/TableScript';
import RecordModel from '../Model/RecordModel';
import { SearchPaymentDetail } from 'pages/cs/CSHome/Model/SearchPaymentDetail';
import { DatePicker } from 'antd/lib';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import ChargingStationEdit from 'components/Charger/ChargingStation/Model/ChargingStationEdit';
import {
  type customerInfoInterface,
  type PassAuthResult,
  type ConsultationNewProps,
  type Org,
  type CSHomeDetailMethods,
} from 'interfaces/ICS';

const CSHomeDetail = forwardRef<CSHomeDetailMethods, ConsultationNewProps>(
  (
    {
      idParam,
      regNoParam,
      flagParam,
      incomingParam,
      callInfo,
      isDetail,
      setFlagParam,
      sendMsg,
      setIdParam,
      setIsDetail,
      setPullCalling,
      pullCalling,
    },
    ref, // 이제 ref를 매개변수로 받을 수 있습니다.
  ) => {
    const initialCustomerInfo = {
      name: null,
      phoneNo: null,
      accountId: null,
      email: null,
      orgName: null,
      createdAt: null,
      updatedAt: null,
      zipCode: null,
      address: null,
      status: null,
      lastUsedMacAddr: null,
      id: null,
      orgId: null,
      gender: null,
      birth: null,
      orgCategory: null,
      detailAddress: null,
      dupinfo: null,
      currentAccessDateTime: '',
      Org: {
        id: null,
        category: null,
        name: null,
      },
    };
    const [state, setState] = useState<StateInterface>({
      isLoading: false,
      error: null,
      isSuccess: false,
      data: null,
    });
    const [memState, setMemState] = useState<StateCsInterface>({
      isLoading: false,
      error: null,
      isSuccess: false,
      data: null,
      formData: null,
    });
    const [subGridState, setSubGridState] = useState<subGridInterface>({
      isLoading: false,
      error: null,
      isSuccess: false,
    });
    const [form] = Form.useForm();
    const [alertModal, setAlertModal] = useRecoilState(alertModalState);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalChargingOpen, setIsModalChargingOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [isModalRecordOpen, setIsModalRecordOpen] = useState(false);
    const [isModalSearchPaymentOpen, setIsModalSearchPaymentOpen] =
      useState(false);
    const [cusData, setCusData] = useState<any>();
    const [payData, setPayData] = useState<any>();
    const [logData, setLogData] = useState<any>();
    const [OutpayData, setOutPayData] = useState<any>();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const detailId = queryParams.get('id');
    const [isModify, setIsModify] = useState(true);
    const [isEVModify, setIsEVModify] = useState<boolean>(false);
    const [resultConData, setResultConData] = useState<ConsultantAllData>();
    const [customerInfo, setCustomerInfo] = useState<customerInfoInterface>();
    const [scriptData, setScriptData] = useState<scriptInterface[]>([]);
    const [{ user }] = useRecoilState(userAuthState);
    const [userPhoneNo, setUserPhoneNo] = useState<string>('');

    let authWindow: Window | null = null;
    const [isAuthWindowOpen, setIsAuthWindowOpen] = useState(false);

    const [scriptTotalCount, setScriptTotalCount] = useState<any>();
    const [birth, setBirth] = useState<string | null>(null);
    const [errorBirth, setErrorBirth] = useState<string | null>(null);
    const [checkAuth, setCheckAuth] = useState<boolean>(false);
    const [asOptions, setAsOptions] = useState<Org[]>([]);

    const open = useDaumPostcodePopup();

    const [transferFlag, setTransferFlag] = useState(false);
    const [isDepositionModalOpen, setIsDepositionModalOpen] = useState(false);
    const [recordFile, setRecordFile] = useState<string | null>(null);
    const [dataChargingStation, setDataChargingStation] = useState<{
      chgs_id: number | '';
      chgs_station_id: string;
      chgs_name: string;
    }>();
    const [MessageLogId, setMessageLogId] = useState<number | ''>('');
    const [stationId, setStationId] = useState<number | ''>('');
    const navigate = useNavigate();
    const [formChanged, setFormChanged] = useState(false);

    // 상담 번호 생성
    const createRegNo = () => {
      const now = new Date();

      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0'); // January is 0!
      const dd = String(now.getDate()).padStart(2, '0');
      const HH = String(now.getHours()).padStart(2, '0');
      const MM = String(now.getMinutes()).padStart(2, '0');
      const SS = String(now.getSeconds()).padStart(2, '0');

      const formattedRegNo = `${yyyy}${mm}${dd}${HH}${MM}${SS}`;
      return formattedRegNo;
    };

    useEffect(() => {
      if (flagParam === 'detail') {
        if (idParam) {
          void fetchDetail(idParam);
          void fetchOrg();
        }
      } else if (flagParam === 'reg') {
        form.resetFields();
        void fetchScript();
        void fetchOrg();
        if (!regNoParam) {
          form.setFieldValue('regNo', createRegNo());
        }
        if (callInfo.phoneNo) {
          void fetchCsList(callInfo.phoneNo, 'incomPhone');
          void fetchCharge(callInfo.phoneNo, 'userPhone');
          void fetchOutstandingPayment(callInfo.phoneNo, 'userPhone');
        }
      }
    }, [idParam, flagParam]);

    useEffect(() => {
      if (!isDetail) {
        alert('상세 화면입니다.');
      }
    }, [isDetail]);

    // 상담전화가 오면 전화번호로 고객검색
    useEffect(() => {
      if (incomingParam === 'CTP' && callInfo && callInfo.phoneNo) {
        form.setFieldsValue({ phoneNo: callInfo.phoneNo });
        void fetchUser(callInfo.phoneNo, null);
      }
    }, [incomingParam, callInfo, callInfo.phoneNo]);

    // 상담전화가 오면 회원분류 상담분류 셋팅
    useEffect(() => {
      if (
        incomingParam === 'CTP' &&
        callInfo &&
        callInfo.csCls1 &&
        callInfo.csCls2
      ) {
        if (callInfo.csCls1 === '회원') {
          form.setFieldValue('csCls1', 'DEF');
        } else if (callInfo.csCls1 === '비회원') {
          form.setFieldValue('csCls1', 'ETC');
        } else if (callInfo.csCls1 === '법인') {
          form.setFieldValue('csCls1', 'BIZ');
        }
        if (callInfo.csCls2 === '충전기 이용방법') {
          form.setFieldValue('csClass', 'CHG');
        } else if (callInfo.csCls2 === '결제문의') {
          form.setFieldValue('csClass', 'BRK');
        } else if (callInfo.csCls2 === '장애문의') {
          form.setFieldValue('csClass', 'PAY');
        } else if (callInfo.csCls2 === '기타문의') {
          form.setFieldValue('csClass', 'ETC');
        }
      }
    }, [incomingParam, callInfo, callInfo.csCls1, callInfo.csCls2]);

    function csCall() {
      const phoneNo = form.getFieldValue('callPhoneNo');
      if (phoneNo === '' || phoneNo === null) return;
      const values = {
        action: 'Originate',
        dial_number: phoneNo,
        model: '3',
        context: 'outbound',
        rid_type: '0',
      };
      sendMsg(values);
    }

    const convertstatusCdValue = (value: string | undefined) => {
      switch (value) {
        case '':
          return '진행중';
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
        case 'TRA':
          return '이관';
        case 'RCT':
          return '회수';
        default:
          return '진행중';
      }
    };
    // 상담 내역 조회시
    useEffect(() => {
      if (resultConData) {
        form.setFieldsValue({
          id: resultConData?.id,
          regNo: resultConData?.regNo,
          csContent: resultConData?.csContent,
          prsContent: resultConData?.prsContent,
          incomingCd: resultConData?.incomingCd,
          // statusCdA: statusCdValue,
          statusCd: '',
          phoneNo: resultConData?.phoneNo,
          callPhoneNo: resultConData?.phoneNo,
          csClass: resultConData?.csClass,
          csCls1: resultConData?.csCls1,
          transPart: resultConData?.CsTransfer?.transPart,
          completeDate: resultConData?.completeDate,
          createdAt: resultConData?.createdAt,
        });

        if (resultConData?.ChargingStationId) {
          const chargerData = {
            chgs_id: resultConData.ChargingStationId,
            chgs_station_id: '',
            chgs_name: resultConData.ChargingStationName,
          };
          setDataChargingStation(chargerData);
        }

        resultConData?.phoneNo && setUserPhoneNo(resultConData?.phoneNo);
        resultConData?.recordFile && setRecordFile(resultConData?.recordFile);
      }
      if (
        user?.id.toString()?.trim() ===
          resultConData?.updatedWho?.toString().trim() &&
        resultConData?.statusCd === 'TRA'
      ) {
        setTransferFlag(false);
      }
      if (user?.Org.category === 'CS' && user?.Org.id !== 2) {
        if (
          (user?.Org.id?.toString().trim() !==
            resultConData?.transPart?.toString().trim() &&
            resultConData?.statusCd === 'TRA') ||
          (resultConData?.statusCd === 'COM' &&
            user.Org?.id?.toString().trim() ===
              resultConData.UpdateCon_orgId?.toString().trim())
        ) {
          // 상담사가 승인 요청, 이관을 선택 했을 때 flag  ==> 수정 불가
          setIsModify(false);
        } else if (
          (resultConData?.statusCd === 'HOL' ||
            resultConData?.statusCd === 'RCT') &&
          user.Org?.id?.toString().trim() ===
            resultConData?.UpdateCon_orgId?.toString().trim()
        ) {
          // 상담사가 보류, 처리 완료를 선택 했을 때, 이관 받았을 때 flag ==> 수정 가능
          setIsModify(true);
        } else if (
          ((resultConData?.statusCd === 'HOL' ||
            resultConData?.statusCd === 'RCT') &&
            user.Org?.id?.toString().trim() !==
              resultConData.UpdateCon_orgId?.toString().trim()) ||
          (resultConData?.statusCd === 'TRA' &&
            user.Org?.id?.toString().trim() !==
              resultConData.transPart?.toString().trim()) ||
          (resultConData?.statusCd === 'COM' &&
            user.Org?.id?.toString().trim() !==
              resultConData.UpdateCon_orgId?.toString().trim())
        ) {
          // CS가 아닌 다른 팀에서 상담 이관 했을 경우
          setIsModify(false);
          setIsEVModify(false);
        }
      } else if (user?.Org?.category === 'HDO') {
        if (
          user?.Org.id !== resultConData?.transId &&
          user?.Org.id === resultConData?.UpdateCon_orgId &&
          resultConData?.transId
        ) {
          // 본인이 이관했을 떄
          setIsModify(false);
          setIsEVModify(true);
        } else if (
          (user?.Org.id?.toString().trim() ===
            resultConData?.transPart?.toString().trim() &&
            resultConData?.statusCd === 'TRA') ||
          (user?.Org.id?.toString().trim() ===
            resultConData?.transPart?.toString().trim() &&
            resultConData?.statusCd === 'ARR') ||
          (user?.Org.id === resultConData?.UpdateCon_orgId &&
            (resultConData?.statusCd === 'HOL' ||
              resultConData?.statusCd === 'RCT'))
        ) {
          // HDO가 승인 요청건, HDO 이관 내용으로 들어왔을 때 수정 가능
          setIsModify(true);
        } else if (
          user?.Org.id?.toString() !== resultConData?.transPart?.toString() &&
          user?.Org.id !== resultConData?.UpdateCon_orgId &&
          (resultConData?.statusCd === 'HOL' ||
            resultConData?.statusCd === 'RCT' ||
            resultConData?.statusCd === 'TRA')
        ) {
          // EV사업팀이 다른 CS 또는 외부 업체의 보류로 들어왔을 때 수정 불가
          setIsModify(false);
          setIsEVModify(false);
        } else if (
          user?.Org.id !== resultConData?.transId &&
          user?.Org.id === resultConData?.UpdateCon_orgId
        ) {
          // 본인이 재 이관했을 떄
          setIsModify(false);
          setIsEVModify(true);
        } else if (resultConData?.statusCd === 'COM') {
          setIsModify(false);
        }
      } else if (user?.Org.category === 'AS') {
        // AS팀이 다른 업체로 이관 했을 때 수정 불가능
        if (
          user?.Org.id.toString() !== resultConData?.transPart?.toString() &&
          resultConData?.statusCd === 'TRA'
        ) {
          setIsModify(false);
        } else if (resultConData?.statusCd === 'ARR') {
          // AS팀이 승인 요청 했을 때 수정 불가능
          setIsModify(false);
        } else if (resultConData?.statusCd === 'COM') {
          // AS팀의 상담 내역 중 완료된 건은 수정 불가능
          setIsModify(false);
        }
      }
    }, [resultConData]);

    // useEffect(() => {
    //   form.setFieldsValue(customerInfo);
    // }, [customerInfo]);

    // 상담 내역 디테일 데이터
    const fetchDetail = async (id: string) => {
      const url = `/v1/web/consultation?id=${id}`;
      const accessToken = localStorage.getItem('accessToken') ?? '';

      const axios = hdoInstance();
      await axios(url, {
        headers: {
          Authorization: accessToken,
        },
      })
        .then((result) => {
          setResultConData(result.data[0]);
          void fetchScript();

          if (result.data[0].customerId) {
            void fetchCsList(result.data[0].phoneNo, 'incomPhone');
            void fetchUser(null, result.data[0].customerId);
            void fetchCharge(result.data[0].Customer_phoneNo, 'userPhone');
            void fetchOutstandingPayment(
              result.data[0].Customer_phoneNo,
              'userPhone',
            );
          } else {
            void fetchCsList(result.data[0].phoneNo, 'incomPhone');
            void fetchCharge(result.data[0].phoneNo, 'userPhone');
            void fetchOutstandingPayment(result.data[0].phoneNo, 'userPhone');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    // AS 업체 조회
    const fetchOrg = async () => {
      const url = '/v1/web/getAsOrg';
      const accessToken = localStorage.getItem('accessToken') ?? '';

      const axios = hdoInstance();
      await axios(url, {
        headers: {
          Authorization: accessToken,
        },
      })
        .then((result) => {
          const asData = result.data;

          const options = asData.map((org: Org) => ({
            id: org.id.toString(),
            name: org.name,
          }));
          setAsOptions(options);
        })
        .catch((error) => {
          console.error('Failed to fetch AS orgs:', error);
        });
    };

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
          const csData = result.data;
          void fetchCsCallLog(csData);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    // 통화 이력
    const fetchCsCallLog = async (csData: any) => {
      let idParamValue = '';
      if (form.getFieldValue('regNo')) {
        idParamValue = form.getFieldValue('regNo');
      }
      const url = `/v1/web/cs-call-logs?regNo=${idParamValue}`;
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
          const callLogData = result.data;
          setIsModalRecordOpen(true);
          setLogData({
            regNo,
            createdAt,
            completedDate,
            csData,
            callLogData,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    };

    // 상담 유저 데이터
    const fetchUser = async (phoneNum: string | null, id: string | null) => {
      let url = '';
      if (phoneNum) {
        url = `/v1/web/cs-customer?select=PHONE&search=${phoneNum}`;
      } else if (id) {
        url = `/v1/web/cs-customer?id=${id}`;
      }
      const accessToken = localStorage.getItem('accessToken') ?? '';

      const axios = hdoInstance();
      await axios(url, {
        headers: {
          Authorization: accessToken,
        },
      })
        .then((result) => {
          type StatusKeys = 'ACTIVE' | 'SLEEP' | 'BLOCK';
          console.log('회원 정보', result);
          const statusLabels: Record<StatusKeys, string> = {
            ACTIVE: '이용',
            SLEEP: '휴면',
            BLOCK: '탈퇴',
          };
          const statusFromResult = result.data[0].status as StatusKeys;
          const statusLabel = statusLabels[statusFromResult] || '';
          const updatedData = {
            ...result.data[0],
            status: statusLabel, // status 속성 업데이트
          };

          setCustomerInfo(updatedData);
          form.setFieldValue('dupinfo', updatedData.dupinfo);
          setUserData(updatedData);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    // 유저 상담 내역 데이터
    const fetchCsList = async (userParam: string, searchKey: string) => {
      let url = '';
      if (searchKey === 'userId') {
        url = `/v1/web/cs-list?select=ID&search=${userParam}`;
      } else {
        url = `/v1/web/cs-list?select=PHONE&search=${userParam}`;
      }

      const accessToken = localStorage.getItem('accessToken') ?? '';

      const axios = hdoInstance();
      await axios(url, {
        headers: {
          Authorization: accessToken,
        },
      })
        .then((result) => {
          setCusData(result.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    // 유저 결제 내역 데이터
    const fetchCharge = async (chParam: string | number, searchKey: string) => {
      // const url = `/v1/web/cs-charge-history?userId=${418}`;
      // const url = `/v1/web/cs-charge-history?userId=${userID}`;
      const chNumParam = Number(chParam);
      let url = '';
      if (searchKey === 'userId') {
        url = `/v1/payment/history?rpp=${50}&page=${1}&odby=${'DESC'}&searchKey=${'accountId'}&searchVal=${chParam}&area=&branch=&speed=&method=&category=&member=&payType=&startDate=&endDate=`;
      } else {
        url = `/v1/payment/history?rpp=${50}&page=${1}&odby=${'DESC'}&searchKey=${'receivePhoneNo'}&searchVal=${chParam}&area=&branch=&speed=&method=&category=&member=&payType=&startDate=&endDate=`;
      }

      const accessToken = localStorage.getItem('accessToken') ?? '';
      setSubGridState({
        ...subGridState,
        isLoading: true,
      });
      const axios = hdoInstance();
      await axios(url, {
        headers: {
          Authorization: accessToken,
        },
      })
        .then((result) => {
          setPayData(result.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const [loadingOutPay, setLoadingOutPay] = useState<boolean>(false);
    const fetchOutstandingPayment = async (
      chParam: string | number,
      searchKey: string,
    ) => {
      let url = '';
      if (searchKey === 'userId') {
        url = `v1/payment/outstanding?rpp=${50}&page=${1}&odby=${'DESC'}&searchKey=${'accountId'}&searchVal=${chParam}&area=&branch=&speed=&method=&category=&member=`;
      } else {
        url = `v1/payment/outstanding?rpp=${50}&page=${1}&odby=${'DESC'}&searchKey=${'receivePhoneNo'}&searchVal=${chParam}&area=&branch=&speed=&method=&category=&member=`;
      }
      setLoadingOutPay(true);
      const accessToken = localStorage.getItem('accessToken') ?? '';

      const axios = hdoInstance();
      await axios(url, {
        headers: {
          Authorization: accessToken,
        },
      })
        .then((result) => {
          setOutPayData(result.data);
          setLoadingOutPay(false);
        })
        .catch((error) => {
          console.log(error);
          setLoadingOutPay(false);
        });
    };

    // 스크립트 데이터 조회
    const fetchScript = async () => {
      const url = `/v1/ms-template?type=COM`;
      const accessToken = localStorage.getItem('accessToken') ?? '';

      const axios = hdoInstance();
      await axios(url, {
        headers: {
          Authorization: accessToken,
        },
      })
        .then((result) => {
          setScriptData(result.data.result);
          setScriptTotalCount(result.data.totalCount);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const settingScript = (data: any) => {
      data.forEach((item: string, index: number) => {
        const fieldName = `scrptContent${index}`;
        form.setFieldsValue({
          [fieldName]: item,
        });
      });
    };

    const checkUpdateUser = () => {
      const formData = form.getFieldsValue();
      if (formData.status === 'BLOCK') {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'alert',
          title: '저장',
          content: (
            <>
              회원 탈퇴로 저장하면 이후 해당 회원 정보를 변경 할 수 없습니다.
              <br />
              회원 정보를 저장 하시겠습니까?
            </>
          ),
          okText: '저장',
          onOk() {
            void updateUser('userSave');
          },
        });
      } else {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'alert',
          title: '저장',
          content: '회원 정보를 저장 하시겠습니까?',
          okText: '저장',
          onOk() {
            void updateUser('userSave');
          },
        });
      }
    };

    const updateUser = async (gubun?: string) => {
      if (!birth || birth === '') {
        setErrorBirth('생년월일 입력해주세요.');
        return;
      }
      const formData = form.getFieldsValue();
      console.log('상태 확인', formData.status);
      if (formData.status === 'BLOCK') {
        if (customerInfo) {
          setCustomerInfo(initialCustomerInfo);
          console.log('회원 이름 삭제');
        }
      }
      if (formData.status === '이용') {
        formData.status = 'ACTIVE';
      } else if (formData.status === '탈퇴') {
        formData.status = 'BLOCK';
      } else if (formData.status === '휴면') {
        formData.status = 'SLEEP';
      }
      const userId: string = formData.userId;
      const editData = {
        status: formData.status,
        name: formData.name,
        phoneNo: formData.phoneNo,
        // accountId: values?.accountId,
        email: formData?.email,
        // password: values.password,
        gender: formData?.gender,
        birth: birth,
        zipCode: formData?.zipCode,
        address: formData?.address,
        detailAddress: formData?.detailAddress,
      };
      const url = `/v1/web/users/${userId}`;
      const accessToken = localStorage.getItem('accessToken') ?? '';

      const axios = hdoInstance();

      await axios
        .put(url, editData, {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((result) => {
          if (gubun === 'userSave') {
            const userPhoneNum = form.getFieldValue('phoneNo');
            void fetchUser(userPhoneNum, null);
            setAlertModal({
              ...alertModal,
              open: true,
              type: 'success',
              title: '저장 상태 알림',
              content: '회원 정보가 저장되었습니다',
              onOk() {
                setCheckAuth(false);
                setAlertModal({
                  ...alertModal,
                  open: false,
                });
              },
            });
          }
        })
        .catch((error) => {
          console.log(error);
          setAlertModal({
            ...alertModal,
            open: true,
            type: 'error',
            title: '저장 상태 알림',
            content: '회원 정보 저장에 실패하였습니다, 관리자에게 문의하세요',
          });
        });
    };

    const handleResetPassword = () => {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'alert',
        title: '초기화',
        content: '비밀번호 초기화 하시겠습니까?',
        okText: '확인',
        onOk() {
          void resetUserPassword();
        },
      });
    };

    const resetUserPassword = async () => {
      const url = '/v1/web/auth/reset-password';
      const data = {
        user_id: form.getFieldValue('accountId'),
        phoneNo: form.getFieldValue('phoneNo'),
      };
      const accessToken = localStorage.getItem('accessToken') ?? '';

      const axios = hdoInstance();
      await axios
        .put(url, data, {
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
            content: '회원 비밀번호가 초기화 되었습니다.',
          });
        })
        .catch((error) => {
          console.log(error);
          setAlertModal({
            ...alertModal,
            open: true,
            type: 'error',
            title: '저장 상태 알림',
            content:
              '회원 비밀번호 초기화에 실패했습니다<br/> 관리자에게 문의하세요',
          });
        });
    };

    const saveConsultant = async (gubun?: string) => {
      const formData = form.getFieldsValue();
      formData.consultantId = user?.id;
      if (customerInfo) {
        formData.customerId = customerInfo?.id;
        formData.orgId = customerInfo?.orgId;
      }
      if (dataChargingStation?.chgs_id) {
        formData.chgs_id = dataChargingStation.chgs_id;
      }
      formData.createdWho = user?.id;
      formData.updatedWho = user?.id;

      formData.ktApiId1 = callInfo.ktApiId1;
      if (incomingParam === 'CTP') {
        formData.ktApiId2 = callInfo.ktApiId2;
        formData.callStartTime = callInfo.callStartTime;
        formData.callEndTime = callInfo.callEndTime;
        formData.csCls2 = formData.csClass;
        formData.phoneNo = callInfo.phoneNo;
        formData.recordFile = callInfo.recordFile;
      }

      if (formData.statusCd === 'COM') {
        const now = new Date();
        now.setSeconds(now.getSeconds() + 10);
        const formattedDateTime = `${now.getFullYear()}-${String(
          now.getMonth() + 1,
        ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
          now.getHours(),
        ).padStart(2, '0')}:${String(now.getMinutes()).padStart(
          2,
          '0',
        )}:${String(now.getSeconds()).padStart(2, '0')}`;
        formData.completeDate = formattedDateTime;
      }
      const url = `/v1/web/cs-create`;
      const accessToken = localStorage.getItem('accessToken') ?? '';

      const axios = hdoInstance();
      await axios
        .post(url, formData, {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((result) => {
          const resultId = result.data.id;
          if (formData.statusCd === 'TRA' || formData.statusCd === 'ARR') {
            if (resultId) {
              void saveTrans(resultId, formData.statusCd);
            }
          } else if (formData.statusCd === 'RCT') {
            if (resultId) {
              void saveTrans(resultId, 'RCT');
            }
          }
          if (checkAuth) {
            void updateUser();
          }
          if (gubun) {
            const callValues = {
              action: 'SetAgentState',
              option: 1,
            };
            sendMsg(callValues);
            navigate('/cs-home');
            setIsDetail(false);
            setIdParam(result.data.id);
            setFlagParam('detail');
            setFormChanged(false);
            setAlertModal({
              ...alertModal,
              open: true,
              type: 'success',
              title: '저장 상태 알림',
              content: '상담 내용이 저장되었습니다',
            });
          } else if (pullCalling === 'pullCalling') {
            setFlagParam('detail');
            navigate('/cs-home');
            setIsDetail(false);
            setFormChanged(false);
            setPullCalling('saved');
            setAlertModal({
              ...alertModal,
              open: false,
            });
          } else {
            setIdParam(result.data.id);
            setFlagParam('detail');
            void fetchDetail(result.data.id);
            setFormChanged(false);
            setAlertModal({
              ...alertModal,
              open: true,
              type: 'success',
              title: '저장 상태 알림',
              content: '상담 내용이 저장되었습니다',
            });
          }
        })
        .catch((error) => {
          console.log(error);
          setFormChanged(false);
          setAlertModal({
            ...alertModal,
            open: true,
            type: 'error',
            title: '저장 상태 알림',
            content: '저장에 실패하였습니다, 관리자에게 문의하세요',
          });
        });
    };

    const modifyConsultant = async (gubun?: string) => {
      const formData = form.getFieldsValue();
      formData.updatedWho = user?.id;
      if (dataChargingStation?.chgs_id) {
        formData.chgs_id = dataChargingStation.chgs_id;
      }

      if (customerInfo) {
        formData.customerId = customerInfo?.id;
        formData.orgId = customerInfo?.orgId;
      }

      if (formData.statusCd === 'COM') {
        const now = new Date();
        const formattedDateTime = `${now.getFullYear()}-${String(
          now.getMonth() + 1,
        ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
          now.getHours(),
        ).padStart(2, '0')}:${String(now.getMinutes()).padStart(
          2,
          '0',
        )}:${String(now.getSeconds()).padStart(2, '0')}`;
        formData.completeDate = formattedDateTime;
      }

      const consultationId: string = form.getFieldValue('id');
      let url = '';
      if (idParam) {
        url = `/v1/web/cs/${idParam}`;
      }
      const accessToken = localStorage.getItem('accessToken') ?? '';
      const axios = hdoInstance();

      await axios
        .put(url, formData, {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((result) => {
          if (formData.statusCd === 'TRA' || formData.statusCd === 'ARR') {
            if (idParam) {
              void saveTrans(idParam, formData.statusCd);
            }
          } else if (formData.statusCd === 'RCT') {
            if (idParam) {
              void saveTrans(idParam, 'RCT');
            }
          }
          // 목록 버튼 누르고 저장
          if (gubun) {
            const callValues = {
              action: 'SetAgentState',
              option: 1,
            };
            sendMsg(callValues);
            navigate('/cs-home');
            setIsDetail(false);
            setFormChanged(false);
            setAlertModal({
              ...alertModal,
              open: true,
              type: 'success',
              title: '저장 상태 알림',
              content: '상담 내용이 저장되었습니다',
            });
            //
          } else if (pullCalling === 'pullCalling') {
            navigate('/cs-home');
            setIsDetail(false);
            setFormChanged(false);
            setPullCalling('saved');
          } else {
            setFormChanged(false);
            void fetchDetail(consultationId);
            setAlertModal({
              ...alertModal,
              open: true,
              type: 'success',
              title: '저장 상태 알림',
              content: '상담 내용이 저장되었습니다',
            });
          }
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

    const handleSave = () => {
      if (
        !form.getFieldValue('statusCd') ||
        form.getFieldValue('statusCd') === ''
      ) {
        checkMessage('처리상태');
      } else if (
        form.getFieldValue('statusCd') === 'TRA' &&
        form.getFieldValue('transPart') === ''
      ) {
        checkMessage('이관 업체 선택');
      } else {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'alert',
          title: '저장',
          content: '저장 하시겠습니까?',
          okText: '저장',
          onOk() {
            void saveConsultant();
          },
        });
      }
    };

    const handleModify = () => {
      if (
        !form.getFieldValue('statusCd') ||
        form.getFieldValue('statusCd') === ''
      ) {
        checkMessage('처리상태');
        return false;
      } else if (
        form.getFieldValue('statusCd') === 'TRA' &&
        form.getFieldValue('transPart') === ''
      ) {
        checkMessage('이관 업체 선택');
        return false;
      } else {
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
      }
    };

    useImperativeHandle(ref, () => ({
      handleModify,
      handleSave,
    }));

    const checkMessage = (name: string) => {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'info',
        title: '필수값 체크',
        content: `${name} : 필수 사항입니다.`,
        okText: '확인',
        onOk() {
          setAlertModal({
            ...alertModal,
            open: false,
          });
        },
      });
    };
    const search = () => {
      setIsModalOpen(true);
    };

    const setUserData = (data: any) => {
      form.setFieldValue('accountId', data?.accountId);
      form.setFieldValue('address', data?.address);
      form.setFieldValue('detailAddress', data?.detailAddress);
      // form.setFieldValue('birth', data?.birth);
      form.setFieldValue('createdAt', data?.createdAt);
      form.setFieldValue('email', data?.email);
      form.setFieldValue('gender', data?.gender);
      form.setFieldValue('id', data?.id);
      form.setFieldValue('lastUsedMacAddr', data?.lastUsedMacAddr);
      form.setFieldValue('name', data?.name);
      form.setFieldValue('orgCategory', data?.orgCategory);
      form.setFieldValue('orgNmae', data?.orgNmae);
      form.setFieldValue('phoneNo', data?.phoneNo);
      form.setFieldValue('status', data?.status);
      form.setFieldValue('zipCode', data?.zipCode);
      form.setFieldValue('dupinfo', data?.dupinfo);
      form.setFieldValue('userId', data?.id);
      setBirth(transBirth(data?.birth));
    };

    useEffect(() => {
      let searchKey = '';
      if (memState.data && memState.isLoading) {
        type StatusKeys = 'ACTIVE' | 'SLEEP' | 'BLOCK';
        const statusLabels: Record<StatusKeys, string> = {
          ACTIVE: '이용',
          SLEEP: '정지',
          BLOCK: '탈퇴',
        };
        if (memState.data?.orgCategory) {
          form.setFieldValue('csCls1', memState.data?.orgCategory);
        }
        console.log(memState?.data);
        const statusLabel = memState?.data?.status
          ? statusLabels[memState?.data?.status as StatusKeys]
          : '';
        const orgData = {
          id: null,
          category: memState.data.orgCategory,
          name: null,
        };

        const updatedData = {
          ...memState.data,
          status: statusLabel,
          Org: orgData,
        };
        setCustomerInfo(updatedData);
        setUserData(memState?.data);

        form.setFieldValue('status', memState?.data?.status);
        // form.setFieldValue('csCls1', memState.data.orgCategory);
        form.setFieldValue('userId', memState?.data?.id);
        // form.setFieldsValue(memState?.data);
        let csCls1 = memState?.data.orgCategory;
        if (!csCls1) {
          csCls1 = 'ETC';
        }
        if (memState?.data.id && memState?.data?.status !== 'BLOCK') {
          searchKey = 'userId';
          void fetchCsList(memState?.data.phoneNo, 'userPhone');
          void fetchCharge(memState?.data.phoneNo, 'userPhone');
          void fetchOutstandingPayment(memState?.data?.phoneNo, 'userPhone');
        }
      } else if (!memState.data && memState.formData?.phoneNo) {
        searchKey = 'userPhone';
        void fetchCsList(memState?.formData?.phoneNo, 'userPhone');
        void fetchCharge(memState?.formData?.phoneNo, searchKey);
        void fetchOutstandingPayment(memState?.formData?.phoneNo, searchKey);
      }
    }, [memState]);

    useEffect(() => {
      void fetchCharge(memState?.formData?.phoneNo, 'userPhone');
      void fetchOutstandingPayment(memState?.formData?.phoneNo, 'userPhone');
    }, [state]);

    useEffect(() => {
      if (subGridState.isSuccess) {
        void fetchCharge(form.getFieldValue('phoneNo'), 'userPhone');
        void fetchOutstandingPayment(
          form.getFieldValue('phoneNo'),
          'userPhone',
        );
        setSubGridState({
          ...subGridState,
          isSuccess: false,
        });
      }
    }, [subGridState]);

    const handleOpenSendMessage = () => {
      const checkParam = Number(form.getFieldValue('phoneNo'));
      let phoneParam = form.getFieldValue('phoneNo');
      if (isNaN(checkParam)) {
        phoneParam = '';
      }
      const messageReData = {
        phoneNo: phoneParam,
        text_message: form.getFieldValue('text_message'),
        userId:
          flagParam === 'detail'
            ? resultConData?.Customer_accountId
            : customerInfo?.accountId,
      };
      setState({
        ...state,
        data: messageReData,
      });
      setIsSendModalOpen(true);
    };

    function maskEmail(email: string) {
      const atIndex = email.indexOf('@');

      if (atIndex < 2) {
        // 유효하지 않은 이메일 형식일 경우
        return email;
      }

      const maskedPrefix = '**';
      const restOfEmail = email.substring(2); // 앞 2자를 제외한 나머지 문자열

      // return maskedPrefix + restOfEmail; // 마스킹 처리한 문자열
      return email;
    }

    function maskId(id: string) {
      if (id) {
        if (id?.length < 4) {
          // 유효하지 않은 ID 형식일 경우
          return id;
        }
      }

      const maskedPrefix = '***'; // 앞 3자리를 '*'로 대체
      const restOfID = id.slice(0, -3); // 앞 3자를 제외한 나머지 문자열

      // return restOfID + maskedPrefix; // 마스킹 처리한 문자열
      return id;
    }

    function maskPhoneNumber(phoneNumber: string) {
      if (phoneNumber) {
        if (phoneNumber?.length !== 11) {
          // 유효하지 않은 핸드폰 번호 형식일 경우
          return phoneNumber;
        }
      }

      const firstPart = phoneNumber.substring(0, 3);
      const secondPart = phoneNumber.substring(3, 7);
      const thirdPart = phoneNumber.substring(7, 11);

      // 형식을 '010-3504-8164'로 변환
      const formattedNumber = `${firstPart}-${secondPart}-${thirdPart}`;

      // 마스킹 처리 '***-****-8164'
      const maskedNumber = `***-****-${thirdPart}`;

      // return maskedNumber;
      return phoneNumber;
    }

    function transBirth(birth: string) {
      if (birth) {
        return dayjs(birth).format('YYYY-MM-DD');
      } else {
        return null;
      }
    }

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
    const handleOpenCharging = () => {
      setIsModalChargingOpen(true);
    };
    const handleOpenSearchPayment = () => {
      setIsModalSearchPaymentOpen(true);
    };

    useEffect(() => {
      const messageListener = (event: MessageEvent<PassAuthResult>) => {
        const dbUserDupinfo = customerInfo?.dupinfo
          ? customerInfo?.dupinfo
          : form.getFieldValue('dupinfo');
        if (event.data?.dupinfo) {
          console.log(event.data);
          if (
            event.data?.dupinfo?.toString().trim() ===
            dbUserDupinfo?.toString().trim()
          ) {
            setCheckAuth(true);
            setAlertModal({
              ...alertModal,
              open: true,
              type: 'success',
              title: '회원 인증',
              content: '회원입니다',
            });

            form.setFieldValue('name', event.data.name);
            const birthDate = event.data.birthdate
              ? dayjs(event.data.birthdate).format('YYYY-MM-DD')
              : null;
            setBirth(birthDate);
            // setBirth(dayjs(event.data.name).format('YYYY-MM-DD'));
            // setBirth(event.data.name);
            if (customerInfo) {
              customerInfo.name = event.data.name;
              customerInfo.birth = event.data.birthdate;
            }

            if (isAuthWindowOpen && authWindow) {
              authWindow.close();
              setIsAuthWindowOpen(false); // 팝업 상태 업데이트
            }
          } else if (
            event.data?.dupinfo?.toString().trim() !==
            dbUserDupinfo?.toString().trim()
          ) {
            setCheckAuth(false);
            setAlertModal({
              ...alertModal,
              open: true,
              type: 'success',
              title: '회원 인증',
              content: '비회원입니다',
            });
            if (isAuthWindowOpen && authWindow) {
              authWindow.close();
              setIsAuthWindowOpen(false); // 팝업 상태 업데이트
            }
          }
        }
      };

      window.addEventListener('message', messageListener);

      // 컴포넌트 언마운트 시 리스너 제거 및 상태 정리
      return () => {
        window.removeEventListener('message', messageListener);
        if (isAuthWindowOpen && authWindow) {
          authWindow.close();
        }
        setIsAuthWindowOpen(false);
      };
    }, [authWindow]);

    const PassAuthComponent = (type: string) => {
      const category = 'CS';
      const rootURL = process.env.REACT_APP_PROD_API_URL;
      const authUrl = `${rootURL}/request-auth/verify/${category}`;
      // const authUrl = `http://localhost:8080/request-auth/verify/${category}`;
      authWindow = window.open(authUrl, 'authWindow', 'width=600,height=700');
      if (authWindow) {
        setIsAuthWindowOpen(true); // 팝업이 성공적으로 열렸음을 상태로 관리
      }
    };

    function handleOpenDaumPopUp() {
      void onOpenPopUp();
    }

    async function onOpenPopUp() {
      open({
        onComplete: (data) => {
          handleComplete(data);
        },
      })
        .then((data) => {})
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
    }

    const handleComplete = (data: any) => {
      form.setFieldsValue({
        address: data.address,
        zipCode: data.zonecode,
      });
    };

    function getCurrentDateTime() {
      const now = new Date();
      const year = String(now.getFullYear()).slice(-2);
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      return `${year}.${month}.${day} ${hours}:${minutes}`;
    }

    const onFormChange = () => {
      setFormChanged(true);
    };

    const checkSave = (gubun: string) => {
      if (gubun === 'reg') {
        void saveConsultant('moveList');
      } else if (gubun === 'detail') {
        void modifyConsultant('moveList');
      } else {
        console.log('HDO');
      }
    };

    useEffect(() => {
      // set variable formChanged to check in side bar
      localStorage.setItem('formChanged', String(formChanged));
      if (formChanged) {
        const currentUrl = location.pathname + location.search;
        const handleBeforeUnload = (e: {
          preventDefault: () => void;
          returnValue: string;
        }) => {
          e.preventDefault();
          e.returnValue = '변경사항이 있을 수 있습니다. 이동하시겠습니까?';
        };

        const popstateHandler = (e: PopStateEvent) => {
          const confirmed = window.confirm(
            '변경사항이 있을 수 있습니다. 이동하시겠습니까?',
          );
          if (!confirmed) {
            navigate(currentUrl);
          }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', popstateHandler);
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
          window.removeEventListener('popstate', popstateHandler);
        };
      }
    }, [formChanged]);

    return (
      <DefaultDiv>
        <GridRefetch refetch={search} />
        <GridContainer
          height={
            user?.Org.category === 'CS' && user?.Org.id !== 2
              ? 'calc(100vh - 14.3rem)'
              : 'calc(100vh - 9.8rem)'
          }
        >
          <StyledForm
            form={form}
            name="CSMainAdd"
            colon={false}
            type="modal"
            gridcol="1fr"
            onValuesChange={onFormChange}
            initialValues={{
              csCls1: 'ETC',
              transPart: '',
              incomingCd: incomingParam,
              regNo: regNoParam,
              // statusCdA: '접수',
              statusCd: 'HOL',
              scrptContent: '',
              csClass: 'ETC',
              text_message: '안녕하세요!\nHD현대오일뱅크 EV&U 고객센터입니다.',
            }}
            style={{ borderBottom: 0 }}
          >
            <DContainer>
              <DRow>
                <DCol>
                  <DRow style={{ justifyContent: 'space-between' }}>
                    <p className="nl-lbl">접수 정보</p>
                    {user?.Org?.category === 'CS' && (
                      <div style={{ display: 'flex' }}>
                        <StyledFormItem
                          name="callPhoneNo"
                          gridcol="100%"
                          style={{
                            width: '100%',
                            marginRight: '3px',
                          }}
                          rules={[
                            {
                              pattern: /^[0-9]+$/g,
                              message: '숫자만 입력하세요',
                            },
                          ]}
                        >
                          <StyledInput
                            onChange={(e) => {
                              const phoneValue = Number(e.target.value);
                              if (!isNaN(phoneValue)) {
                                setUserPhoneNo(e.target.value);
                              }
                            }}
                          ></StyledInput>
                        </StyledFormItem>
                        <div style={{ marginRight: '3px' }}>
                          <Button onClick={csCall} color="warning">
                            전화 걸기
                          </Button>
                        </div>
                        <div style={{ width: '120px' }}>
                          <Button onClick={handleOpenSendMessage}>
                            문자보내기
                          </Button>
                        </div>
                      </div>
                    )}
                  </DRow>
                  <table className="nl-table-detail">
                    <tbody>
                      <tr>
                        <th>접수번호</th>
                        <td>
                          <StyledFormItem
                            name="regNo"
                            gridcol="100%"
                            style={{ width: '100%' }}
                          >
                            <StyledInput readOnly />
                          </StyledFormItem>
                          <div hidden>
                            <StyledFormItem
                              name="createdAt"
                              gridcol="100%"
                              style={{ width: '100%' }}
                            >
                              <StyledInput hidden />
                            </StyledFormItem>
                            <StyledFormItem
                              name="completeDate"
                              gridcol="100%"
                              style={{ width: '100%' }}
                            >
                              <StyledInput hidden />
                            </StyledFormItem>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>회원분류</th>
                        <td>
                          <StyledFormItem
                            name="csCls1"
                            gridcol="100%"
                            style={{
                              width: '100%',
                              ...(!isModify && { pointerEvents: 'none' }),
                            }}
                          >
                            <StyledSelect>
                              <Select.Option value="DEF">회원</Select.Option>
                              <Select.Option value="ETC">비회원</Select.Option>
                              <Select.Option value="BIZ">
                                법인회원
                              </Select.Option>
                            </StyledSelect>
                          </StyledFormItem>
                        </td>
                      </tr>
                      <tr>
                        <th>상담분류</th>
                        <td>
                          <StyledFormItem
                            name="csClass"
                            gridcol="100%"
                            style={{
                              width: '100%',
                              ...(!isModify && { pointerEvents: 'none' }),
                            }}
                          >
                            <StyledSelect>
                              <Select.Option value="CHG">
                                이용방법
                              </Select.Option>
                              <Select.Option value="BRK">
                                결제문의
                              </Select.Option>
                              <Select.Option value="PAY">
                                장애문의
                              </Select.Option>
                              <Select.Option value="REG">환불</Select.Option>
                              <Select.Option value="CAR">
                                단순 문의
                              </Select.Option>
                              <Select.Option value="ETC">기타</Select.Option>
                            </StyledSelect>
                          </StyledFormItem>
                        </td>
                      </tr>
                      <tr>
                        <th>충전소</th>
                        <td>
                          <DRow
                            style={{
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <p
                              style={{
                                marginRight: 14,
                                minWidth: '270px',
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                setStationId(
                                  dataChargingStation?.chgs_id ?? '',
                                );
                              }}
                            >
                              {dataChargingStation?.chgs_name}{' '}
                            </p>

                            <Button
                              minWidth="70px"
                              onClick={handleOpenCharging}
                            >
                              검색
                            </Button>
                          </DRow>
                        </td>
                      </tr>
                      <tr>
                        <th>인입연락처</th>
                        <td>
                          <StyledFormItem
                            name="phoneNo"
                            gridcol="100%"
                            style={{
                              width: '100%',
                              ...(!isModify && { pointerEvents: 'none' }),
                            }}
                            rules={[
                              {
                                pattern: /^[0-9]+$/g,
                                message: '숫자만 입력하세요',
                              },
                            ]}
                          >
                            <StyledInput
                              readOnly={incomingParam === 'CTP'}
                              onChange={(e) => {
                                const phoneValue = Number(e.target.value);
                                if (!isNaN(phoneValue)) {
                                  setUserPhoneNo(e.target.value);
                                }
                              }}
                            ></StyledInput>
                          </StyledFormItem>
                        </td>
                      </tr>
                      <tr>
                        <th>처리 상태</th>
                        <td>
                          <DRow
                            style={{
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <p style={{ marginRight: 14, minWidth: '270px' }}>
                              {convertstatusCdValue(resultConData?.statusCd)}
                            </p>
                            {flagParam !== 'reg' && (
                              <Button
                                minWidth="70px"
                                onClick={() => {
                                  void fetchCsLog();
                                }}
                              >
                                이력
                              </Button>
                            )}
                          </DRow>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </DCol>
                <DCol style={{ flex: 2, position: 'relative' }}>
                  <DRow style={{ justifyContent: 'space-between' }}>
                    <p className="nl-lbl">회원정보</p>
                    {flagParam === 'reg' && isEVModify ? (
                      <div style={{ display: 'flex' }}>
                        <Button
                          onClick={() => {
                            setIsModalOpen(true);
                            const initialState = {
                              isLoading: false,
                              error: null,
                              isSuccess: false,
                              data: null,
                              formData: null,
                            };
                            setMemState(initialState);
                            setCustomerInfo(initialCustomerInfo);
                          }}
                        >
                          ID/전화번호 조회
                        </Button>
                        <div style={{ marginLeft: '5px' }}>
                          <Button
                            onClick={() => {
                              user?.Org?.category === 'HDO'
                                ? PassAuthComponent('HDO')
                                : PassAuthComponent('ORG');
                            }}
                          >
                            PASS 인증
                          </Button>
                        </div>
                        <div style={{ marginLeft: '5px' }}>
                          <Button
                            onClick={() => {
                              setCheckAuth(true);
                            }}
                          >
                            회원 정보 수정
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex' }}></div>
                    )}
                  </DRow>
                  <table className="nl-table-detail">
                    <tbody>
                      <tr>
                        <th>회원 구분</th>
                        <td>
                          {customerInfo?.Org?.category
                            ? customerInfo?.Org?.category === 'DEF'
                              ? '회원'
                              : customerInfo?.Org?.category === 'BIZ'
                              ? '법인회원'
                              : '기타회원'
                            : '기타회원'}
                          <div style={{ display: 'none' }}>
                            <StyledFormItem name="dupinfo">
                              <StyledInput />
                            </StyledFormItem>
                            {customerInfo?.dupinfo}
                          </div>
                        </td>

                        <th>회원 명</th>
                        {checkAuth ? (
                          <td>
                            <StyledFormItem
                              name="name"
                              rules={[
                                {
                                  required: true,
                                  message: '이름를 입력해주세요.',
                                },
                              ]}
                              style={{ width: '100%' }}
                            >
                              <StyledInput />
                            </StyledFormItem>{' '}
                          </td>
                        ) : (
                          <td>
                            {customerInfo?.name ? customerInfo?.name : ''}
                          </td>
                        )}

                        <th>회원 id</th>
                        <td>
                          {customerInfo?.accountId
                            ? maskId(customerInfo?.accountId ?? '')
                            : ''}
                          <StyledFormItem
                            name="userId"
                            style={{ display: 'none' }}
                          >
                            <StyledInput />
                          </StyledFormItem>{' '}
                        </td>
                      </tr>
                      <tr>
                        <th>성별</th>
                        {checkAuth ? (
                          <td>
                            <StyledFormItem name="gender" required>
                              <StyledRadio>
                                <StyledRadioBtn value={'1'}>
                                  남자
                                </StyledRadioBtn>
                                <StyledRadioBtn value={'0'}>
                                  여자
                                </StyledRadioBtn>
                              </StyledRadio>
                            </StyledFormItem>
                          </td>
                        ) : (
                          <td>
                            {customerInfo?.gender === '1'
                              ? '남자'
                              : customerInfo?.gender === '0'
                              ? '여자'
                              : ''}
                          </td>
                        )}
                        <th>생년월일</th>
                        {checkAuth ? (
                          <td>
                            <DatePicker
                              format="YYYY-MM-DD"
                              picker="date"
                              placeholder="YYYY-MM-DD"
                              value={birth ? dayjs(birth) : null}
                              onChange={(value) => {
                                if (value) {
                                  setErrorBirth(null);
                                  setBirth(dayjs(value).format('YYYY-MM-DD'));
                                } else {
                                  setErrorBirth('생년월일 입력해주세요.');
                                  setBirth(null);
                                }
                              }}
                              style={{
                                borderColor: !errorBirth
                                  ? 'var(--btn-gray-300)'
                                  : 'var(--red)',
                                width: '100%',
                              }}
                            />
                            <div style={{ color: 'var(--red)' }}>
                              {errorBirth}
                            </div>
                          </td>
                        ) : (
                          <td>
                            {customerInfo?.birth
                              ? dayjs(customerInfo?.birth).format('YYYY-MM-DD')
                              : ''}
                          </td>
                        )}
                        <th>비밀번호</th>
                        {checkAuth ? (
                          <td>
                            <Button
                              size="md"
                              color="secondary"
                              minWidth="100px"
                              type="button"
                              onClick={() => {
                                handleResetPassword();
                              }}
                            >
                              초기화
                            </Button>
                          </td>
                        ) : (
                          <td></td>
                        )}
                      </tr>
                      <tr>
                        <th>이메일</th>
                        {checkAuth ? (
                          <td>
                            <StyledFormItem
                              name="email"
                              rules={[
                                {
                                  required: true,
                                  message: '이메일를 입력해주세요.',
                                },
                                {
                                  type: 'email',
                                  message: '이메일 형식이 아닙니다.',
                                },
                              ]}
                              gridcol="100%"
                              style={{
                                width: '100%',
                              }}
                            >
                              <StyledInput />
                            </StyledFormItem>
                          </td>
                        ) : (
                          <td>
                            {/* <a
                          href="{customerInfo?.email
                      ? maskEmail(customerInfo?.email ?? '')
                      : ''}"
                        >
                          {customerInfo?.email
                            ? maskEmail(customerInfo?.email ?? '')
                            : ''}
                        </a> */}
                            {customerInfo?.email
                              ? maskEmail(customerInfo?.email ?? '')
                              : ''}
                          </td>
                        )}
                        <th>연락처</th>
                        {checkAuth ? (
                          <td>
                            <StyledFormItem
                              name="phoneNo"
                              rules={[
                                {
                                  required: true,
                                  message: '전화번호을 입력해주세요.',
                                },
                                {
                                  pattern: /^[0-9]+$/g,
                                  message: '숫자만 입력하세요',
                                },
                              ]}
                              style={{ width: '100%' }}
                            >
                              <StyledInput maxLength={11} />
                            </StyledFormItem>
                          </td>
                        ) : (
                          <td>
                            {customerInfo?.phoneNo
                              ? maskPhoneNumber(customerInfo?.phoneNo ?? '')
                              : ''}
                          </td>
                        )}
                        {/* <th>카드</th>
                      <td></td> */}
                        <th>상태값</th>
                        {checkAuth ? (
                          <td>
                            <StyledFormItem
                              name="status"
                              gridcol="100%"
                              style={{
                                width: '100%',
                              }}
                            >
                              <StyledSelect>
                                <Select.Option value="ACTIVE">
                                  이용
                                </Select.Option>
                                <Select.Option value="BLOCK">
                                  탈퇴
                                </Select.Option>
                                <Select.Option value="SLEEP">
                                  휴면
                                </Select.Option>
                              </StyledSelect>
                            </StyledFormItem>
                          </td>
                        ) : (
                          <td>
                            {customerInfo?.status ? customerInfo?.status : ''}
                          </td>
                        )}
                      </tr>
                      <tr>
                        <th>가입일</th>
                        <td>
                          {customerInfo?.createdAt
                            ? customerInfo?.createdAt
                            : ''}
                        </td>
                        <th>마지막 이용일</th>
                        <td>
                          {customerInfo?.currentAccessDateTime
                            ? customerInfo?.currentAccessDateTime
                            : ''}
                        </td>
                        {/* <th>NFC</th>
                      <td></td> */}
                      </tr>
                      <tr>
                        {/* <th>멤버십</th>
                      <td colSpan={3}></td> */}
                      </tr>
                      {checkAuth ? (
                        <tr>
                          <th>주소</th>
                          <div style={{ margin: '10px', display: 'flex' }}>
                            <StyledFormItem
                              name="zipCode"
                              style={{ marginRight: '10px' }}
                              // rules={[
                              //   {
                              //     required: true,
                              //     message: '사번을 입력해주세요.',
                              //   },
                              // ]}
                            >
                              <StyledInput />
                            </StyledFormItem>
                            <Button
                              size="md"
                              color="secondary"
                              minWidth="100px"
                              type="button"
                              onClick={() => {
                                handleOpenDaumPopUp();
                              }}
                            >
                              주소 찾기
                            </Button>
                          </div>
                          <div style={{ margin: '10px' }}>
                            <StyledFormItem name="address">
                              <StyledInput style={{ width: '500px' }} />
                            </StyledFormItem>
                          </div>
                          <div style={{ margin: '10px' }}>
                            <StyledFormItem name="detailAddress">
                              <StyledInput style={{ width: '500px' }} />
                            </StyledFormItem>
                          </div>
                        </tr>
                      ) : (
                        <tr>
                          <th style={{ height: 122 }}>주소</th>
                          <td colSpan={5}>
                            {customerInfo?.zipCode ? customerInfo?.zipCode : ''}
                            <br />
                            {customerInfo?.address ? customerInfo?.address : ''}
                            <br />

                            {customerInfo?.detailAddress
                              ? customerInfo?.detailAddress
                              : ''}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {checkAuth && (
                    <div
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <Button onClick={checkUpdateUser} minWidth="120px">
                        회원 정보 저장
                      </Button>
                    </div>
                  )}
                  {!customerInfo?.name && (
                    <EmptyMember>
                      <Button
                        onClick={(event) => {
                          event.preventDefault();
                          setIsModalOpen(true);
                          const initialState = {
                            isLoading: false,
                            error: null,
                            isSuccess: false,
                            data: null,
                            formData: null,
                          };
                          setMemState(initialState);
                          setCustomerInfo(initialCustomerInfo);
                        }}
                      >
                        ID/전화번호 조회
                      </Button>
                      <p className="nl-text medium">
                        인입 전화번호로 검색된 회원정보가 없습니다.
                      </p>
                      <p className="nl-text">
                        회원은 등록된 전화번호와 id정보로 결제 정보가 검색되어
                        보여지며,
                        <br />
                        비회원은 결제시 사용자가 입력한 전화번호로 검색이
                        됩니다.
                      </p>
                    </EmptyMember>
                  )}
                </DCol>
              </DRow>
              <hr className="nl-line" />
              <DRow>
                <DCol style={{ flex: 1 }}>
                  <table className="nl-table-detail">
                    <tbody>
                      <tr>
                        <th>접수 담당자</th>
                        <td>{user?.name}</td>
                        <th>접수 일자</th>
                        <td>{getCurrentDateTime()}</td>
                      </tr>
                      <tr>
                        <th>상담내용</th>
                        <td colSpan={3}>
                          <StyledFormItem
                            name="csContent"
                            gridcol="100%"
                            style={{
                              width: '100%',
                            }}
                          >
                            <StyledTextArea
                              style={{
                                height: 180,
                                ...(!isModify && { pointerEvents: 'none' }),
                              }}
                            ></StyledTextArea>
                          </StyledFormItem>
                        </td>
                      </tr>
                      <tr>
                        <th>처리내용</th>
                        <td colSpan={3}>
                          <StyledFormItem
                            name="prsContent"
                            gridcol="100%"
                            style={{
                              width: '100%',
                            }}
                          >
                            <StyledTextArea
                              style={{
                                height: 180,
                                ...(!isModify && { pointerEvents: 'none' }),
                              }}
                            ></StyledTextArea>
                          </StyledFormItem>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {!isEVModify ? (
                    <DRow style={{ marginTop: 20 }}></DRow>
                  ) : (
                    <DRow style={{ marginTop: 20 }}>
                      {!isModify ? (
                        <StyledFormItem label="처리상태" name="statusCd">
                          <StyledRadio>
                            <StyledRadioBtn value="RCT">회수</StyledRadioBtn>
                          </StyledRadio>
                        </StyledFormItem>
                      ) : (
                        <StyledFormItem label="처리상태" name="statusCd">
                          {user?.Org?.category === 'HDO' ? (
                            <StyledRadio
                              onChange={(e) => {
                                const statusValue = e.target.value;
                                if (statusValue === 'TRA') {
                                  setTransferFlag(true);
                                } else {
                                  setTransferFlag(false);
                                  form.setFieldValue('transPart', '');
                                }
                              }}
                            >
                              <StyledRadioBtn value="HOL">보류</StyledRadioBtn>
                              <StyledRadioBtn value="COM">
                                처리완료
                              </StyledRadioBtn>
                              <StyledRadioBtn value="TRA">이관</StyledRadioBtn>
                            </StyledRadio>
                          ) : (
                            <StyledRadio
                              onChange={(e) => {
                                const statusValue = e.target.value;
                                if (statusValue === 'TRA') {
                                  setTransferFlag(true);
                                } else {
                                  setTransferFlag(false);
                                  form.setFieldValue('transPart', '');
                                }
                              }}
                            >
                              <StyledRadioBtn value="HOL">보류</StyledRadioBtn>
                              <StyledRadioBtn value="COM">
                                처리완료
                              </StyledRadioBtn>
                              <StyledRadioBtn value="TRA">이관</StyledRadioBtn>
                            </StyledRadio>
                          )}
                        </StyledFormItem>
                      )}
                      {transferFlag && isEVModify && (
                        <StyledFormItem
                          name="transPart"
                          gridcol="100%"
                          style={{ width: 150, marginLeft: '30px' }}
                          initialValue=""
                        >
                          {user?.Org?.category === 'CS' &&
                            user?.Org.name !== 'EV사업팀' && (
                              <StyledSelect>
                                <Select.Option value="">
                                  이관 업체 선택
                                </Select.Option>
                                <Select.Option value="2">
                                  EV 사업팀
                                </Select.Option>
                              </StyledSelect>
                            )}
                          {user?.Org?.category === 'HDO' && (
                            <StyledSelect>
                              <Select.Option value="">
                                이관 업체 선택
                              </Select.Option>
                              <Select.Option value="547">CS 팀</Select.Option>
                              {asOptions.map((option) => (
                                <Select.Option
                                  key={option.id?.toString()}
                                  value={option.id?.toString()}
                                >
                                  {option.name}
                                </Select.Option>
                              ))}
                            </StyledSelect>
                          )}
                        </StyledFormItem>
                      )}
                    </DRow>
                  )}
                </DCol>
                <DCol style={{ flex: 2 }}>
                  <Tabs defaultValue="1">
                    <Tabs.List>
                      <Tabs.Trigger value="1" text="상담 이력" />
                      <Tabs.Trigger value="2" text="결제 내역" />
                      <Tabs.Trigger value="3" text="미결제 내역" />
                      <Tabs.Trigger value="4" text="스크립트" />
                    </Tabs.List>
                    <Tabs.Content>
                      <Tabs.Panel value="1">
                        <TableConsultationHistory
                          state={subGridState}
                          setState={setSubGridState}
                          cusData={cusData}
                        />
                      </Tabs.Panel>
                      <Tabs.Panel value="2">
                        {payData?.totalCount > 0 ? (
                          <TablePaymentHistory
                            state={subGridState}
                            setState={setSubGridState}
                            payData={payData}
                          />
                        ) : (
                          <DRow
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'column',
                              height: '100%',
                            }}
                          >
                            <p style={{ fontSize: 18, fontWeight: 600 }}>
                              결제 내역 정보가 없습니다.
                            </p>
                            <p style={{ marginBottom: 10 }}>
                              충전 결제내역에서 다시 검색해주세요
                            </p>
                            <Button onClick={handleOpenSearchPayment}>
                              충전 결제 내역 검색
                            </Button>
                          </DRow>
                        )}
                      </Tabs.Panel>
                      <Tabs.Panel value="3">
                        <TableUnExportedPayment
                          loadingOutPay={loadingOutPay}
                          data={OutpayData}
                          setState={setState}
                          state={state}
                        />
                      </Tabs.Panel>
                      <Tabs.Panel value="4">
                        <TableScript
                          state={subGridState}
                          setState={setSubGridState}
                          data={scriptData}
                          totalCount={scriptTotalCount}
                        />
                      </Tabs.Panel>
                    </Tabs.Content>
                  </Tabs>
                </DCol>
              </DRow>

              {flagParam === 'detail' && isEVModify && (
                <DRow
                  style={{
                    justifyContent: 'center',
                    gap: 20,
                    marginTop: 20,
                  }}
                >
                  <Button onClick={handleModify} minWidth="100px">
                    수정
                  </Button>
                  <Button
                    onClick={() => {
                      if (formChanged) {
                        setAlertModal({
                          ...alertModal,
                          open: true,
                          type: 'alert',
                          title: '저장',
                          content:
                            '상담 내용을 저장 후 페이지 이동하시겠습니까?',
                          okText: '저장',
                          onOk() {
                            checkSave('detail');
                            const callValues = {
                              action: 'SetAgentState',
                              option: 1,
                            };
                            sendMsg(callValues);
                            setAlertModal({
                              ...alertModal,
                              open: false,
                            });
                            navigate('/cs-home');
                            setIsDetail(false);
                          },
                          onCancel() {
                            navigate('/cs-home');
                            setIsDetail(false);
                            const callValues = {
                              action: 'SetAgentState',
                              option: 1,
                            };
                            sendMsg(callValues);
                          },
                        });
                      } else {
                        const callValues = {
                          action: 'SetAgentState',
                          option: 1,
                        };
                        sendMsg(callValues);
                        navigate('/cs-home');
                        setIsDetail(false);
                      }
                    }}
                    minWidth="100px"
                  >
                    목록보기
                  </Button>
                </DRow>
              )}
              {flagParam === 'reg' && isEVModify && (
                <DRow
                  style={{
                    justifyContent: 'center',
                    gap: 20,
                    marginTop: 20,
                  }}
                >
                  <Button onClick={handleSave} minWidth="100px">
                    저장
                  </Button>
                  <Button
                    onClick={() => {
                      setAlertModal({
                        ...alertModal,
                        open: true,
                        type: 'alert',
                        title: '저장',
                        content: '상담 내용을 저장 후 페이지 이동하시겠습니까?',
                        okText: '저장',
                        onOk() {
                          checkSave('reg');
                        },
                        onCancel() {
                          navigate('/cs-home');
                          setIsDetail(false);
                          const callValues = {
                            action: 'SetAgentState',
                            option: 1,
                          };
                          sendMsg(callValues);
                        },
                      });
                    }}
                    minWidth="100px"
                  >
                    목록보기
                  </Button>
                  {/* HDO계정 -> 신규등록페이지 음소거/통화종료 버튼 히든처리 */}
                  {/* {user?.Org.category !== 'HDO' && (
                      <>
                        <Button
                          onClick={() => {
                            const values = {
                              action: 'MuteAudio',
                              option: isMuted ? 'off' : 'on',
                            };
                            sendMsg(values);
                            setIsMuted(!isMuted);
                          }}
                          minWidth="100px"
                        >
                          {isMuted ? '음소거 취소' : '음소거'}
                        </Button>
                        <Button
                          onClick={() => {
                            const values = {
                              action: 'Hangup',
                            };
                            sendMsg(values);
                          }}
                          minWidth="100px"
                        >
                          통화종료
                        </Button>
                      </>
                    )} */}
                </DRow>
              )}
              {!isEVModify && (
                <DRow
                  style={{
                    justifyContent: 'center',
                    marginTop: 20,
                  }}
                >
                  {/* <DRow>
                    <Button onClick={() => {}}>임시저장</Button>
                    <Button onClick={() => {}} color="warning">
                      전화 걸기
                    </Button>
                  </DRow> */}
                  <Button
                    onClick={() => {
                      if (formChanged) {
                        setAlertModal({
                          ...alertModal,
                          open: true,
                          type: 'alert',
                          title: '저장',
                          content:
                            '상담 내용을 저장 후 페이지 이동하시겠습니까?',
                          okText: '저장',
                          onOk() {
                            checkSave('EV');
                            const callValues = {
                              action: 'SetAgentState',
                              option: 1,
                            };
                            sendMsg(callValues);
                            setAlertModal({
                              ...alertModal,
                              open: false,
                            });
                            navigate('/cs-home');
                            setIsDetail(false);
                          },
                          onCancel() {
                            navigate('/cs-home');
                            setIsDetail(false);
                            const callValues = {
                              action: 'SetAgentState',
                              option: 1,
                            };
                            sendMsg(callValues);
                          },
                        });
                      } else {
                        const callValues = {
                          action: 'SetAgentState',
                          option: 1,
                        };
                        sendMsg(callValues);
                        navigate('/cs-home');
                        setIsDetail(false);
                      }
                    }}
                    minWidth="100px"
                  >
                    목록보기
                  </Button>
                </DRow>
              )}
            </DContainer>
          </StyledForm>
        </GridContainer>
        <MemberSearch
          state={memState}
          setState={setMemState}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          userPhoneNo={userPhoneNo}
        ></MemberSearch>
        <Deposition
          isDepositionModalOpen={isDepositionModalOpen}
          setIsDepositionModalOpen={setIsDepositionModalOpen}
          recordFile={recordFile}
        ></Deposition>
        {/* <SendMessage
        state={state}
        setState={setState}
        isSendModel={isSendModalOpen}
        setIsSendModel={setIsSendModalOpen}
      ></SendMessage> */}
        <SearchChargingStation
          isModalOpen={isModalChargingOpen}
          setIsModalOpen={setIsModalChargingOpen}
          dataChargingStation={dataChargingStation}
          setDataChargingStation={setDataChargingStation}
        ></SearchChargingStation>
        <RecordModel
          isModalRecordOpen={isModalRecordOpen}
          setIsModalRecordOpen={setIsModalRecordOpen}
          data={logData}
        />
        <SendMessageNew
          state={state}
          setState={setState}
          isEditOpen={isSendModalOpen}
          setIsEditOpen={setIsSendModalOpen}
          setMessageLogId={setMessageLogId}
          MessageLogId={MessageLogId}
        ></SendMessageNew>
        <SearchPaymentDetail
          isModalOpen={isModalSearchPaymentOpen}
          setIsModalOpen={setIsModalSearchPaymentOpen}
        ></SearchPaymentDetail>

        <ChargingStationEdit
          state={state}
          setState={setState}
          stationId={stationId}
          setStationId={setStationId}
          reload={() => {}}
          from="cs-home"
        />
      </DefaultDiv>
    );
  },
);
CSHomeDetail.displayName = 'CSHomeDetail';
export default CSHomeDetail;
