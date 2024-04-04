export interface customerInfoInterface {
  name: string | null;
  phoneNo: string | null;
  accountId: string | null;
  email: string | null;
  orgName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  zipCode: string | null;
  address: string | null;
  status: string | null;
  lastUsedMacAddr: string | null;
  id: number | null;
  orgId: number | null;
  gender: string | null;
  birth: string | null;
  orgCategory: string | null;
  detailAddress: string | null;
  dupinfo: string | null;
  currentAccessDateTime: string;
  Org: {
    id: number | null;
    category: string | null;
    name: string | null;
  };
}

export interface csLogInterface {
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

// const { TabPane } = Tabs;

export interface ICallInfo {
  ktApiId1: string;
  ktApiId2: string;
  callStartTime: string;
  callEndTime: string;
  csCls1: string;
  csCls2: string;
  phoneNo: string;
  recordFile: string;
}

export interface PassAuthResult {
  [x: string]: any;
  type: 'PASS_AUTH';
  result: string;
  accountId: string;
}

export interface ConsultationNewProps {
  idParam: string | null;
  regNoParam: string | null;
  flagParam: string | null;
  incomingParam: string | null;
  callInfo: ICallInfo;
  isDetail?: boolean | null;
  setFlagParam: React.Dispatch<React.SetStateAction<string | null>>;
  sendMsg: (obj: any) => void;
  extensionNumber: string;
  setIdParam: React.Dispatch<React.SetStateAction<string | null>>;
  setIsDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setPullCalling: React.Dispatch<React.SetStateAction<string>>;
  pullCalling: string;
}

export interface CSHomeDetailMethods {
  handleModify: () => void;
  handleSave: () => void;
}

export interface Org {
  id: number;
  name: string;
}

export interface Option {
  value: string;
  label: string;
}
