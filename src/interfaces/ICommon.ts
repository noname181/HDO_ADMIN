import { type Dispatch, type SetStateAction } from 'react';

export interface User {
  accountId: string;
  id: string;
  name: string;
  phoneNo: string | null;
  retired: boolean;
  dept?: string | null;
  role: any;
  orgId: number;
  Org: any;
  currentAccessDateTime: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  status?: string | null;
  type: string;
  Person?: any;
}

export interface AuthoredBy {
  name: string;
  id: string;
  accountId: string;
  retired: boolean;
  orgId: number;
}

export interface callLog {
  date: string;
  giveupCount: string;
  hangupCount: string;
  rate: string;
  ringingCount: string;
}

export interface OrganizationInterface {
  id: number;
  category: string;
  fullname: string;
  name: string;
  bizRegNo?: any;
  address: string;
  contactName?: any;
  contactPhoneNo?: any;
  contactEmail?: any;
  deductType: string;
  discountPrice: number;
  staticUnitPrice: number;
  payMethodId?: any;
  isPayLater: boolean;
  isLocked: boolean;
  billingDate?: any;
  closed: boolean;
  area?: any;
  branch?: any;
  haveCarWash: string;
  haveCVS: string;
  STN_STN_SEQ?: any;
  STN_STN_ID?: any;
  STN_STN_GUBUN?: any;
  STN_CUST_NO?: any;
  STN_ASSGN_AREA_GUBUN?: any;
  STN_COST_CT?: any;
  STN_PAL_CT?: any;
  STN_STN_SHORT_NM?: any;
  createdAt: string;
  updatedAt: string;
  createdBy: AuthoredBy;
  updatedBy: AuthoredBy;
  chargingStation: any;
  erp?: string;
  areaName?: string;
  branchName?: string;
  region?: string;
}

export interface INotice {
  id: number;
  title: string;
  content: string;
  count: number;
  imageUrl: string;
}

export interface ICoupon {
  id: number;
  number: string;
  information: string;
  isUsed: boolean;
  division: string;
}

export interface ITroubleReport {
  id: number;
  chg_id: number;
  troubleTitle: string;
  troubleDetail: string;
  statusReport: string;
  mediaUrl: any;
  chgs_name: string;
  chg_charger_id: string;
  reportDate: Date;
  userName: string;
  accountId: string;
  content: string;
}

export interface ICenter {
  longitude: number;
  latitude: number;
}

export interface IChargeStationCluster {
  id: string;
  size: number;
  point: number[];
  center: ICenter;
}

export interface codelookupInterface {
  id: number;
  divCode: string;
  divComment: string;
  sequence: number;
  descVal: number;
  descInfo: string;
  use: boolean;
  createdAt: string;
  updatedAt: string;
  upperDivCode: string;
}

export interface fileInterface {
  id: number;
  version: string;
  fileURL: string;
  newestVersion: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StateInterface {
  isLoading: boolean;
  error: any;
  isSuccess: boolean;
  data?: any;
}

export interface StateCsInterface {
  isLoading: boolean;
  error: any;
  isSuccess: boolean;
  data?: any;
  formData?: any;
}

export interface UpdateStateInterface {
  isLoading: boolean;
  error: any;
  isSuccess: boolean;
  data: any;
}

export interface ApiProps<T> {
  url: string;
  data: T;
}
export interface StateProps<T> {
  state: T;
  setState: Dispatch<SetStateAction<T>>;
}
export interface TabIDInterface {
  id: string;
}
export interface StateTabProps {
  queryState: TabIDInterface;
  setQueryState: Dispatch<SetStateAction<TabIDInterface>>;
}
export interface BannerEventInterface {
  title: string;
  content: string;
  image: string;
  secondaryImage: any;
  startdate: string;
  enddate: string;
  timeStartDate: string;
  timeEndDate: string;
  option: string;
  url: string;
}
export interface NoticePopUpInterface {
  title: string;
  contents: string;
  imagesUrl: any;
  firstDate: string;
  lastDate: string;
  timeFirstDate: string;
  timeLastDate: string;
  isActive: string;
  type?: string;
}
export interface IUnitPrice {
  unitPriceSetName: string;
  unitPrice1: string;
  unitPrice2: string;
  unitPrice3: string;
  unitPrice4: string;
  unitPrice5: string;
  unitPrice6: string;
  unitPrice7: string;
  unitPrice8: string;
  unitPrice9: string;
  unitPrice10: string;
  unitPrice11: string;
  unitPrice12: string;
  unitPrice13: string;
  unitPrice14: string;
  unitPrice15: string;
  unitPrice16: string;
  unitPrice17: string;
  unitPrice18: string;
  unitPrice19: string;
  unitPrice20: string;
  unitPrice21: string;
  unitPrice22: string;
  unitPrice23: string;
  unitPrice24: string;
}
export interface IUploadFile {
  division: string;
  version: string;
  fileURL: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  createdWho?: string;
  updatedWho?: string;
  imageValue?: string;
  newestVersion?: boolean;
}

export interface IInquiry {
  id: number;
  content: string;
  comment: string;
  categoryId: number;
}
export interface ICodeLookUp {
  divCode?: string;
  divComment?: string;
  sequence?: string;
  descVal?: string;
  descInfo?: string;
  use?: string;
  upperDivCode?: string;
}
export interface IReview {
  chgs_id?: string;
  images?: string;
  order?: string;
  direction?: string;
  stars?: number;
  content?: string;
}

export interface IPermissions {
  id: string;
  name: string;
  permissions: any;
}
export interface ISettlement {
  id: string;
}
export interface IDailyPayment {
  id: string;
}
export interface IMonthlySettlement {
  id: string;
}
export interface IMessageLog {
  sendDt: string;
  annotation: string;
  phoneNo: string;
  textMessage: string;
  csId: string;
}
