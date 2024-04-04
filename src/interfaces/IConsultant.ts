export interface subGridInterface {
  isLoading: boolean;
  error: any;
  isSuccess: boolean;
  cusData?: any;
  payData?: any;
}

export interface Customer {
  id: number;
  accountId: string;
  name: string;
  phoneNo: string;
  email: string;
}

export interface Consultant {
  id: number;
  accountId: string;
  name: string;
  phoneNo: string;
  email: string;
}

export interface Org {
  id: number;
  category: string;
  name: string;
}

export interface Result {
  regNo: string;
  messageId: null | string;
  ktApiId1: null | string;
  ktApiId2: null | string;
  incomingCd: string;
  callStartTime: string;
  callEndTime: string;
  csCls1: string;
  csCls2: string;
  csContent: string;
  prsContent: string;
  statusCd: string;
  completeDate: string;
  approveWho: null | string;
  approveAt: null | string;
  csClass: string;
  createdAt: string;
  updatedAt: string;
  consultantId: number;
  customerId: number;
  createdWho: null | string;
  updatedWho: null | string;
  orgId: number;
  Customer: Customer;
  Consultant: Consultant;
  Org: Org;
}

export interface ConsultationData {
  approveAt: null | string;
  approveWho: null | number;
  callEndTime: string;
  callStartTime: string;
  completeDate: null | string;
  consultantId: number;
  createdAt: string;
  createdWho: number;
  csClass: string;
  csCls1: string;
  csCls2: string;
  csContent: string;
  customerId: number;
  incomingCd: string;
  ktApiId1: string;
  ktApiId2: null | string;
  messageId: null | string;
  orgId: number;
  prsContent: string;
  regNo: string;
  statusCd: string;
  updatedAt: string;
  updatedWho: number;
}

export interface UserData {
  id: number;
  id_old: string;
  accountId: string;
  dupinfo: string | null;
  status: string;
  type: string;
  role: string;
  saltRounds: string | null;
  hashPassword: string | null;
  md5Password: string | null;
  isRequireResetPassword: boolean;
  isRequireCreateAccount: boolean;
  refreshToken: string | null;
  dept: string;
  nfcMembershipNo: string | null;
  physicalCardNo: string | null;
  isEmailVerified: boolean;
  pwdChgRequired: boolean;
  name: string | null;
  phoneNo: string;
  email: string;
  subsDCPrice: number;
  deviceId: string | null;
  userAgreements: string | null;
  haveUnpaid: boolean;
  currentAccessDateTime: string;
  profileImage: string | null;
  verifyEmailSendedAt: string;
  resetPasswordToken: string | null;
  lastUsedMacAddr: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  address: string | null;
  detailAddress: string | null;
  zipCode: string | null;
  orgId: number;
  roleId: number | null;
  usersNewId: number | null;
  gender: string | null;
  birth: string | null;
  Org: {
    id: number;
    category: string;
    name: string;
  };
  totalCount: number | null;
}

export interface CsChargeHisData {}

export interface ConsultantAllData {
  ChargingStationId: number;
  ChargingStationName: string;
  id: number;
  Org: any;
  CsTransfer: any;
  Consultant_accountId: string | null;
  Consultant_category: string | null; // 이 필드는 제공된 정보에는 없지만 인터페이스 설명을 기반으로 추가함
  Consultant_email: string | null;
  Consultant_id: number | null;
  Consultant_name: string | null;
  Consultant_orgFullName: string | null;
  Consultant_orgId: number | null;
  Consultant_phoneNo: string | null;
  CsMessage_createdAt: string | null;
  CsMessage_id: number | null;
  CsMessage_phoneNo: string | null;
  CsTransfer_id: number | null;
  Customer_birth: string | null;
  Customer_email: string | null;
  Customer_gender: string | null;
  Customer_id: number | null;
  Customer_accountId: string | null;
  Customer_name: string | null;
  Customer_phoneNo: string | null;
  Org_category: string | null;
  Org_id: number | null;
  Org_name: string | null;
  UpdateCon_email: string | null;
  UpdateCon_id: number | null;
  UpdateCon_name: string | null;
  UpdateCon_orgId: string | null;
  accountId: string | null;
  approveAt: string | null;
  approveWho: string | null;
  callEndTime: string;
  callStartTime: string;
  completeDate: string | null;
  consultantId: number;
  createdAt: string;
  createdWho: number;
  csClass: string;
  csCls1: string | null;
  csCls2: string | null;
  csContent: string;
  customerId: number | null;
  incomingCd: string;
  ktApiId1: string;
  ktApiId2: string | null;
  phoneNo: string;
  messageId: number | null;
  orgId: number | null;
  prsContent: string | null;
  recordFile: string | null;
  regNo: string;
  statusCd: string;
  text_message: string | null;
  transAt: string;
  transId: number;
  transPart: string;
  transWhom: string | null;
  updatedAt: string;
  updatedWho: number;
  totalCount: number | null;
}

export interface scriptInterface {
  totalCount: number;
  id: string;
  scriptName: string;
  scrptContent: string | null;
  scriptComment: string | null;
  scriptCategory: string | null;
}
