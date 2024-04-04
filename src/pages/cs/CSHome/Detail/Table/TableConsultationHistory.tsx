import { useEffect, useRef, useState } from 'react';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import * as IGrid from 'aui-grid';
import dayjs from 'dayjs';
import { DefaultDiv, Spinner } from 'styles/style';
import { useRecoilState } from 'recoil';
import { type subGridInterface } from 'interfaces/IConsultant';
import { userAuthState } from 'recoil/authState';
import ConsultantDetail from '../../Model/ConsultantDetail';

interface gridInterface {
  state: subGridInterface;
  setState: React.Dispatch<React.SetStateAction<subGridInterface>>;
  cusData: any;
}

interface CusDataInput {
  Consultant: {
    accountId: string;
    email: string;
    id: number;
    name: string;
    phoneNo: string;
    OrgName: string;
  };
  Customer: {
    accountId: string;
    email: string;
    id: number;
    name: string;
    phoneNo: string;
  };
  Org: {
    id: number;
    category: string;
    name: string;
  };
  CsMessage: {
    createdAt: string;
    id: string;
    phoneNo: string;
    text_message: string;
  };
  CsTransfer: {
    fullname: string;
    id: string;
    transAt: string;
    transPart: string;
    transWhom: string;
    OrgName: string;
  };
  id: number;
  approveAt: string | null;
  approveWho: string | null;
  callEndTime: string;
  callStartTime: string;
  completeDate: string | null;
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
  ktApiId2: string | null;
  messageId: string | null;
  orgId: number;
  prsContent: string;
  regNo: string;
  statusCd: string;
  updatedAt: string;
  updatedWho: number;
  totalCount: number | null;
}

const TableConsultationHistory = ({
  state,
  setState,
  cusData,
}: gridInterface) => {
  const myGrid = useRef<AUIGrid>(null);
  const [{ user }] = useRecoilState(userAuthState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cusDataDetail, setCusDataDetail] = useState<any>();

  const cusTransformData = (data: CusDataInput[], totalCount: number) => {
    return data.map((item) => {
      return {
        consultantAccountId: item.Consultant?.accountId,
        consultantEmail: item.Consultant?.email,
        consultantId: item.Consultant?.id,
        consultantName: item.Consultant?.name,
        consultantPhoneNo: item.Consultant?.phoneNo,
        customerAccountId: item.Customer?.accountId,
        customerEmail: item.Customer?.email,
        customerId: item.Customer?.id,
        customerName: item.Customer?.name,
        customerPhoneNo: item.Customer?.phoneNo,
        orgCategory: item.Org?.category,
        orgId: item.Org?.id,
        orgName: item.Org?.category,
        chargePart: item.CsTransfer?.fullname
          ? item.CsTransfer?.OrgName
          : item.Consultant?.OrgName,
        id: item.id,
        approveAt: item.approveAt,
        approveWho: item.approveWho,
        callEndTime: item.callEndTime,
        callStartTime: item.callStartTime,
        completeDate: item.completeDate,
        createdWho: item.createdWho,
        createdAt: item.createdAt,
        csClass: item.csClass,
        csCls1: item.csCls1,
        csCls2: item.csCls2,
        csContent: item.csContent,
        incomingCd: item.incomingCd,
        ktApiId1: item.ktApiId1,
        ktApiId2: item.ktApiId2,
        messageId: item.messageId,
        prsContent: item.prsContent,
        regNo: item.regNo,
        statusCd: transStatus(item?.statusCd, item?.CsTransfer.transPart),
        updatedAt: item.updatedAt,
        totalCount,
      };
    });
  };

  const transStatus = (statusCdValue: string, transPartValue: string) => {
    // CS 일때 진행 상태
    if (
      user?.Org.category === 'CS' &&
      user?.Org?.id.toString() === transPartValue &&
      user?.Org.id !== 552
    ) {
      switch (statusCdValue) {
        case 'HOL':
          return '진행중(보류)';
        case 'RCT':
          return '진행중(보류)';
        case 'COM':
          return '처리 완료';
        case 'ARR':
          return '처리 완료(승인요청)';
        case 'TRA':
          return '진행중(접수)';
        case 'RET':
          return '회수';
        default:
          return '진행중';
      }
    } else if (
      user?.Org.category === 'CS' &&
      user?.Org.id.toString() !== transPartValue &&
      user?.Org.id !== 552
    ) {
      switch (statusCdValue) {
        case 'HOL':
          return '진행중(보류)';
        case 'RCT':
          return '진행중(보류)';
        case 'COM':
          return '처리 완료';
        case 'ARR':
          return '처리 완료(승인요청)';
        case 'TRA':
          return '처리 완료(이관)';
        case 'RET':
          return '회수';
        default:
          return '진행중';
      }
    } else if (user?.Org.category === 'AS') {
      switch (statusCdValue) {
        case 'HOL':
          return '진행중(보류)';
        case 'RCT':
          return '진행중(보류)';
        case 'ARR':
          return '처리 완료(승인요청)';
        case 'TRA':
          return '진행중(접수)';
        default:
          return '진행중';
      }
    } else if (user?.Org.id === 552 && transPartValue === '552') {
      switch (statusCdValue) {
        case 'HOL':
          return '진행중(보류)';
        case 'RCT':
          return '진행중(보류)';
        case 'COM':
          return '처리 완료';
        case 'TRA':
          return '진행중(접수)';
        case 'ARR':
          return '진행중(접수)';
        default:
          return '진행중';
      }
    } else if (user?.Org.id === 552 && transPartValue !== '552') {
      switch (statusCdValue) {
        case 'HOL':
          return '진행중(보류)';
        case 'RCT':
          return '진행중(보류)';
        case 'COM':
          return '처리 완료';
        case 'TRA':
          return '처리 완료(이관)';
        default:
          return '진행중';
      }
    }
  };

  const gridProps: IGrid.Props = {
    width: '100%',
    height: 400,
    fillColumnSizeMode: false, // 정의한 칼럼 레이아웃을 가로 스크롤 없이 현재 그리드 영역에 꽉차도록 칼럼들을 비율로 계산하여 출력합니다.
    enableColumnResize: false, // 칼럼 리사이징 가능 여부를 지정합니다.
    showSelectionBorder: false, // 셀 선택 시 선택된 셀에 테두리(border) 를 표시할지 여부를 나타냅니다.
    headerHeights: [40],
    editable: false, // 편집 가능 여부
    showRowNumColumn: false, // 행 줄번호(로우 넘버링) 칼럼의 출력 여부를 지정합니다.
    noDataMessage: '출력할 데이터가 없습니다.',
    // wordWrap: true, // 이 속성값이 true 인 경우 자동 word-wrap 이 발생하며 각 행의 높이가 설정한 텍스트에 맞게 가변적으로 렌더링됩니다.
    // showRowCheckColumn: true, // 엑스트라 행 체크박스 출력 여부를 지정합니다.
    rowHeight: 40,
    selectionMode: 'multipleRows',
  };
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'totalCount',
      headerText: '번호',
      width: '4%',
      minWidth: 50,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value - _rowIndex ?? '-';
      },
    },
    {
      dataField: 'regNo',
      headerText: '접수번호',
      width: 125,
    },
    {
      dataField: 'statusCd',
      headerText: '진행상태',
      width: 90,
      labelFunction(_rowIndex, _columnIndex, value, _dataField) {
        return value;
      },
    },
    {
      dataField: 'csClass',
      headerText: '상담분류',
      width: 90,
      labelFunction(_rowIndex, _columnIndex, value) {
        switch (value) {
          case 'CHG':
            return '이용방법';
          case 'BRK':
            return '결제문의';
          case 'PAY':
            return '장애문의';
          case 'REG':
            return '환불';
          case 'CAR':
            return '단순 문의';
          case 'ETC':
            return '기타';
          default:
            return value;
        }
      },
    },
    {
      dataField: 'csContent',
      headerText: '상담내용',
      minWidth: 100,
    },
    {
      dataField: 'consultantName',
      headerText: '상담사',
      width: 90,
      labelFunction(_rowIndex, _columnIndex, value, _item) {
        return value;
      },
    },
    {
      dataField: 'chargePart',
      headerText: '담당업체',
      width: 80,
    },
    {
      dataField: 'statusCd',
      headerText: '상담 처리 결과',
      width: 90,
      visible: user?.Org.category === 'CS' || user?.Org.category === 'AS',
      labelFunction(_rowIndex, _columnIndex, value) {
        switch (value) {
          case 'COM':
            return '처리 완료';
          default:
            return '진행중';
        }
      },
    },
    {
      dataField: 'createdAt',
      headerText: '접수날짜',
      width: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      dataField: 'completeDate',
      headerText: '완료날짜',
      width: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        if (value) {
          return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
        } else {
          return '';
        }
      },
    },
    {
      dataField: 'id',
      headerText: '아이디',
      visible: false,
    },
  ];

  useEffect(() => {
    const grid = myGrid.current as AUIGrid;
    // 그리드 ready 이벤트 바인딩
    grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {});
    // 그리드 셀더블클릭 이벤트 바인딩
    grid.bind(
      IGrid.EventKind.CellDoubleClick,
      (event: IGrid.CellDoubleClickEvent) => {
        setIsModalOpen(true);
        setCusDataDetail(event.item);
      },
    );
    // 그리드 수직스크롤 이벤트 바인딩
    grid.bind(
      IGrid.EventKind.RowCheckClick,
      (event: IGrid.VScrollChangeEvent) => {},
    );

    let cusData2: any[] = [];
    if (cusData) {
      setState({
        ...state,
        isLoading: false,
      });
      cusData2 = [...cusTransformData(cusData.result, cusData.totalCount)];
    }

    // 그리드 데이터 세팅
    grid.setGridData(cusData2);
    // setIsCallAnswerOpen(true);
  }, [cusData]);

  return (
    <DefaultDiv>
      <AUIGrid ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
      <ConsultantDetail
        data={cusDataDetail}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </DefaultDiv>
  );
};
export default TableConsultationHistory;
