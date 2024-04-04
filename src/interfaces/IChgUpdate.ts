import { type Dispatch, type SetStateAction } from 'react';
import { type OrganizationInterface } from './ICommon';
import { type filterInterface } from './ICharger';

interface ChargingStation {
  chgs_id: number;
  chgs_station_id: string;
  status: string;
  chgs_name: string;
  area_code_id: string;
  createdAt: string;
  updatedAt: string;
  orgId: number;
  chgs_operator_manager_id: number;
  org: OrganizationInterface;
  operatorManager: string;
}

interface ChargerModel {
  id: number;
  modelCode: string;
  manufacturerId: string;
  modelName: string;
  maxKw: number;
  speedType: string;
  connectorType: string;
  channelCount: number;
  lastFirmwareVer: string;
  pncAvailable: string;
  useYN: string;
  createdAt: string;
  updatedAt: string;
}

interface ChargerState {
  cs_id: number;
  cs_charger_state: string;
  cs_charging_state: string;
  cs_firmware: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateFilterInterface {
  update: string;
  user_id: string;
  user_name: string;
  phone: string;
}
export interface UpdateFilterInterfaceProps {
  queryState: UpdateFilterInterface;
  setQueryState: Dispatch<SetStateAction<UpdateFilterInterface>>;
  sendContents: () => void;
  refetch: () => void;
}
export interface UpdateInterface {
  chg_id: number;
  status: string;
  isJam: string;
  chg_charger_id: string;
  chg_alias: string;
  chg_fw_ver: string;
  chg_cell_number: string;
  chg_use_yn: string;
  qrTransDate: string;
  adVersion: string;
  termsVersion: string;
  chargingStation: ChargingStation;
  chargerModel: ChargerModel;
  chargerState: ChargerState;
  latestVer?: string;
}

export interface UpdateGridProps {
  loading: boolean;
  data: UpdateInterface[] | null;
  refetch: () => void;
  setSendId: Dispatch<SetStateAction<number[] | string[]>>;
  latestVer?: string | null;
}

export interface FWInterface {
  chg_id: number;
  chgs_name: string;
  category: string;
  area: number;
  branch: number;
  areaName: string;
  branchName: string;
  chg_charger_id: string;
  chg_use_yn: string;
  state: string;
  chg_fw_ver: string;
  lastVer: string;
  FileURL: string;
  chargerModelId: number;
  modelName: string;
  maxKw: number;
}
export interface FWFilterInterface extends filterInterface {
  update: string;
  user_id: string;
  user_name: string;
  phone: string;
}
export interface FWFilterInterfaceProps {
  queryState: FWFilterInterface;
  setQueryState: Dispatch<SetStateAction<FWFilterInterface>>;
  sendContents: () => void;
  refetch: () => void;
}
export interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}
