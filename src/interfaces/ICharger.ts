import { type Dispatch, type SetStateAction } from 'react';
import { type AuthoredBy, type OrganizationInterface } from './ICommon';

export interface QueryStateInterface<T> {
  queryState: T;
  setQueryState: Dispatch<SetStateAction<T>>;
  addData?: () => void;
  refetch?: () => void;
  reload?: () => void;
}

export interface filterInterface {
  rpp: number; // 1page data 조회 갯수
  page: number; // rpp에 따른 조회 페이지 번호
  odby: 'DESC' | 'ASC'; // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
}
export interface ChargingStationFilterInterface extends filterInterface {
  area: '' | number; // 소속부문
  branch: '' | number; // 소속지사
  org: '' | 'STT_DIR' | 'STT_FRN'; // 사업장구분 : 전체/직영/자영
  status: '' | 'ACTIVE' | 'INACTIVE'; // 충전소상태 : 전체/운영/정지
  wash: '' | 'Y' | 'N'; // 세차장유무 : 전체/있음/없음
  cvs: '' | 'Y' | 'N';
}

export interface ChargerFilterInterface extends filterInterface {
  area: '' | number; // 소속부문
  branch: '' | number; // 소속지사
  org: '' | 'STT_DIR' | 'STT_FRN'; // 사업장구분 : 전체/직영점/자영점
  status: '' | 'ACTIVE' | 'INACTIVE'; // 충전기사용 : 전체/사용/미사용
  isJam: '' | 'Y' | 'N'; // 고장여부 : 전체/있음/없음
  search: string; // 충전소명 검색
}
export interface UnitPriceFilterInterface extends filterInterface {
  isUsed?: string;
  unitPriceSetName: string;
}
export interface StationFilterProps {
  queryState: ChargingStationFilterInterface;
  setQueryState: Dispatch<SetStateAction<ChargingStationFilterInterface>>;
  totalCount: number;
}

export interface StationModalProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
}

export interface ChargerInterface {
  chg_id: number;
  chgs_id: number;
  chg_channel: number;
  status: string;
  isJam: boolean;
  chg_charger_id: string;
  chg_alias?: any;
  chg_sn?: any;
  chg_fw_ver?: any;
  chg_cell_number?: any;
  usePreset: string;
  upSetId?: any;
  chg_unit_price: number;
  chg_use_yn: string;
  qrTransDate?: any;
  adVersion?: any;
  termsVersion?: any;
  reservable: boolean;
  createdAt: string;
  updatedAt: string;
  chargerModelId: number;
  createdBy?: any;
  updatedBy: UpdatedBy;
  chargingStation: ChargingStation;
  chargerModel: ChargerModelInterface;
  qrcode: string;
  total_channel?: string | number | null;
  mall_id: string;
  mall_id2?: string;
  charger_status: string;
  chargerStates: any;
}

export interface ChargerModelInterface {
  id: number | string;
  modelCode: string;
  manufacturerId: string;
  modelName: string;
  maxKw: number;
  speedType: string;
  connectorType: string;
  channelCount: number;
  lastFirmwareVer: string;
  pncAvailable: boolean;
  useYN: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
  createdWho?: any;
  updatedWho?: any;
}
export interface ChgModelFilterprops extends filterInterface {
  manufacturerId: '' | number;
  modelName: '' | string;
}
interface ChargingStation {
  coordinate: Coordinate;
  chgs_id: number;
  chgs_station_id: string;
  status: string;
  chgs_name: string;
  chrgStartTime: string;
  chrgEndTime: string;
  washStartTime: string;
  washEndTime: string;
  chgs_kepco_meter_no?: any;
  isUse: boolean;
  chgs_car_wash_yn: string;
  chgs_aff_only?: any;
  chgs_field_desc?: any;
  area_code_id?: any;
  createdAt: string;
  updatedAt: string;
  orgId: number;
  chgs_operator_manager_id?: any;
}

interface Coordinate {
  longitude: number;
  latitude: number;
}

interface UpdatedBy {
  name: string;
  id: string;
  accountId: string;
  retired: boolean;
  orgId: number;
}

export interface StationInterface {
  coordinate: Coordinate;
  chgs_id: number;
  chgs_station_id: string;
  status: string;
  chgs_name: string;
  chrgStartTime: string;
  chrgEndTime: string;
  washStartTime: string;
  washEndTime: string;
  chgs_addr1?: any;
  chgs_addr2?: any;
  chgs_kepco_meter_no?: any;
  isUse: boolean;
  chgs_car_wash_yn?: any;
  chgs_aff_only?: any;
  chgs_operator_manager_id?: any;
  chgs_field_desc?: any;
  chgs_write_datetime: string;
  area_code_id?: any;
  createdAt: string;
  updatedAt: string;
  orgId: number;
  chargers: ChargerInterface[];
  org: OrganizationInterface;
  createdBy: AuthoredBy;
  updatedBy: AuthoredBy;
  priceType?: string;
  unitPriceSetId?: number | null;
  fixedPrice?: number | null;
  erp?: string;
  activeStationYN?: string;
}

export interface ChargerEditProps {
  chargerId: number | '';
  setChargerId: Dispatch<SetStateAction<number | ''>>;
}
export interface formData {
  chargerModelId: string;
  chg_id: string;
  chgs_station_id: string;
  connectorType: string;
  manufacturerId: string;
  maxKw: number;
  reservable: boolean;
  chg_use_yn: string;
  chg_unit_price: number | string;
  usePreset: boolean;
  upSetId: string | number | null;
  chg_alias: string;
  total_channel: string | number | null;
  mall_id: string;
  charger_status: string;
  mall_id2?: string;
}
export interface ChargerState {
  cs_id: number;
  cs_station_charger_id: string;
  cs_channel: number;
  cs_charger_state: string;
  cs_charging_state: string | null;
  // Add other properties if available
}
export interface ChargerData {
  area_code_id: null;
  chargers: Array<{
    adVersion: null;
    chargerModelId: string;
    chargerState: ChargerState;
    chg_alias: null;
    chg_cell_number: null;
    chg_channel: number;
    chg_charger_id: string;
    chg_fw_ver: null;
    chg_id: number;
    chg_sn: null;
    chg_unit_price: number;
    chg_use_yn: string;
    chgs_id: number;
    createdAt: string;
    isJam: boolean;
    qrTransDate: null;
    reservable: boolean;
    status: string;
    termsVersion: null;
    upSetId: null;
    updatedAt: string;
    usePreset: boolean;
    _$uid: string;
  }>;
  chgs_aff_only: null;
  chgs_car_wash_yn: string;
  chgs_field_desc: null;
  chgs_id: number;
  chgs_kepco_meter_no: null;
  chgs_name: string;
  chgs_operator_manager_id: null;
  chgs_station_id: string;
  chrgEndTime: string;
  chrgStartTime: string;
  coordinate: Coordinate;
  createdAt: string;
  createdBy: {
    accountId: string;
    id: string;
    name: string;
    orgId: number;
    retired: boolean;
  };
  isUse: boolean;
  operatorManager: null;
  org: {
    STN_ASSGN_AREA_GUBUN: null;
    STN_COST_CT: null;
    STN_CUST_NO: null;
    STN_PAL_CT: null;
    STN_STN_GUBUN: null;
    STN_STN_ID: null;
    STN_STN_SEQ: null;
    STN_STN_SHORT_NM: null;
    address: string;
    area: number;
    billingDate: null;
    bizRegNo: null;
    branch: number;
    category: string;
    closed: boolean;
    contactEmail: null;
    contactName: null;
    contactPhoneNo: null;
    createdAt: string;
    deductType: string;
    discountPrice: number;
    haveCarWash: boolean;
    id: number;
    isLocked: boolean;
    isPayLater: boolean;
    name: string;
    payMethodId: null;
    staticUnitPrice: number;
    updatedAt: string;
  };
  orgId: number;
  status: string;
  updatedAt: string;
  updatedBy: {
    accountId: string;
    id: string;
    name: string;
    orgId: number;
    retired: boolean;
  };
  washEndTime: string;
  washStartTime: string;
  _$uid: string;
}
