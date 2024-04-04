import { type Dispatch, type SetStateAction } from 'react';
import { type OrganizationInterface } from '../ICommon';

type Role = 'ADMIN' | 'VIEWER';
interface RoleNew {
  id: string;
  name: string;
}

export interface HDOAdminInterface {
  Org: any;
  id: string;
  status: string; // 재직
  accountId: string; // 사번
  name: string; // 이름
  role: RoleNew; // 권한
  currentAccessDateTime: Date; // 최근접속일
  dept: string;
  phoneNo: string;
  email: string;
  ORG1: string;
  PHONE2: string;
  JKW1: string;
  Person: any;
}
export interface IRules {
  name: string;
  rules: {
    delete?: boolean;
    list?: boolean;
    read?: boolean;
    write?: boolean;
  };
}

export interface PermissionAdminInterface extends categoryPermissionsProps {
  id?: string;
  name?: string;
  mainMenu?: string;
}
export interface categoryPermissionsProps {
  systemSetting: {
    name: string;
    permissions: any[];
  };
  belong: {
    name: string;
    permissions: any[];
  };
  userManagement: {
    name: string;
    permissions: any[];
  };
  charger: {
    name: string;
    permissions: any[];
  };
  history: {
    name: string;
    permissions: any[];
  };
  settlement: {
    name: string;
    permissions: any[];
  };
  gift: {
    name: string;
    permissions: any[];
  };
  notice: {
    name: string;
    permissions: any[];
  };
  cs: {
    name: string;
    permissions: any[];
  };
  consultation: {
    name: string;
    permissions: any[];
  };
  chargingLogs: {
    name: string;
    permissions: any[];
  };
  dashBoard: {
    name: string;
    permissions: any[];
  };
}
export interface HDOFilterInterface {
  status: string;
  name: string;
}

export interface HDOFilterInterfaceProps {
  queryState: HDOFilterInterface;
  setQueryState: Dispatch<SetStateAction<HDOFilterInterface>>;
  addData: () => void;
}

export interface ExternalAdminInterface {
  id: string;
  status: string; // 재직
  name: string; // 이름
  role: RoleNew; // 권한
  phoneNo: string;
  accountId: string;
  currentAccessDateTime: Date; // 최근접속일
  Org: OrganizationInterface;
}

export interface EAFilterInterface {
  category:
    | ''
    | 'external'
    | 'STT_DIR'
    | 'STT_FRN'
    | 'CS'
    | 'AS'
    | 'BIZ'
    | 'ALLNC'
    | 'GRP';
  name: string;
  orgName: string;
}

export interface EAFilterInterfaceProps {
  queryState: EAFilterInterface;
  setQueryState: Dispatch<SetStateAction<EAFilterInterface>>;
}

export interface MobileInterface {
  status: string;
  name: string; // 이름
  accountId: string; // ID
  phoneNo: string;
  Org: OrganizationInterface;
  currentAccessDateTime: Date; // 최근접속일
  email: string;
  birth?: string;
  gender?: string;
  zipCode: string;
  address: string;
  detailAddress: string;
  createdAt: string;
  lastOnline: string;
  vehicles: any;
  userOauths: any;
}

export interface MUFilterInterface {
  category: '' | 'DEF,BIZ,ALLNC,GRP' | 'DEF' | 'BIZ' | 'ALLNC' | 'GRP';
  name: string;
  phoneNo: string;
}

export interface MUFilterInterfaceProps {
  queryState: MUFilterInterface;
  setQueryState: Dispatch<SetStateAction<MUFilterInterface>>;
}

export interface ModalProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
}
