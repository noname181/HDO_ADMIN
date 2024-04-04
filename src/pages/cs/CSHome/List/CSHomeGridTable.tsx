import React, { useEffect, useRef, useState } from 'react';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import * as IGrid from 'aui-grid';
import dayjs from 'dayjs';
import { AUIGridContainer, GridContainer } from 'styles/style';
import { TableButton } from 'components/common/Button/TableButton';
// import { CSMainAdd } from './Model/CSMainAdd';
// import { CSMainEdit } from './Model/CSMainEdit';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { useNavigate } from 'react-router-dom';
import { type StateInterface } from 'interfaces/ICommon';
import { hdoInstance } from 'apis/hdoInstance';
import { userAuthState } from 'recoil/authState';

interface consultantFilterInterface {
  rpp: number; // 1page data 조회 갯수
  page: number; // rpp에 따른 조회 페이지 번호
  odby: 'DESC' | 'ASC'; // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
  searchKey: string;
  searchVal: string;
  startDate: string;
  endDate: string;
  ctartDate: string;
  cndDate: string;
  process: string;
  incoming: string;
  csClass: string;
  csCls1: string;
  conResult: string;
}

interface counsultantGridTableProps {
  loading: boolean;
  data: any;
  state: StateInterface;
  setState: React.Dispatch<React.SetStateAction<StateInterface>>;
  queryState: consultantFilterInterface;
  setQueryState: React.Dispatch<
    React.SetStateAction<consultantFilterInterface>
  >;
  totalCount: number | null;
  setIsDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setFlagParam: React.Dispatch<React.SetStateAction<string | null>>;
  setRegNo: React.Dispatch<React.SetStateAction<string | null>>;
}

interface DataInput {
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
    OrgCategory: string;
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
  UpdateCon_email: string;
  UpdateCon_id: string;
  UpdateCon_name: string;
  UpdateCon_orgId: string;
  UpdateCon_orgTransName: string;
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

const CSHomeGridTable = ({
  loading,
  data,
  state,
  setState,
  totalCount,
  queryState,
  setQueryState,
  setIsDetail,
  setFlagParam,
  setRegNo,
}: counsultantGridTableProps) => {
  const navigate = useNavigate();
  const myGrid = useRef<AUIGrid>(null);
  const [griddata, setGridData] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [{ user }] = useRecoilState(userAuthState);
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
      width: '10%',
    },
    {
      dataField: 'statusCd',
      headerText: '진행상태',
      width: '10%',
      visible: true,
      labelFunction(_rowIndex, _columnIndex, value, _dataField) {
        return value;
      },
    },
    {
      dataField: 'type',
      headerText: '회원 분류',
      visible: false,
    },
    {
      dataField: 'csClass',
      headerText: '상담분류',
      width: '6%',
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
      dataField: 'customerAccountId',
      headerText: '회원ID',
      width: '6%',
      visible: false,
    },
    {
      dataField: 'customerName',
      headerText: '이름',
      width: '5%',
      visible: false,
    },
    {
      dataField: 'customerBirth',
      headerText: '생년월일',
      width: '6%',
      visible: false,
      labelFunction(_rowIndex, _columnIndex, value) {
        return dayjs(value).format('YYYY-MM-DD');
      },
    },
    {
      dataField: 'customerSex',
      headerText: '성별',
      width: '3%',
      visible: false,
      labelFunction(_rowIndex, _columnIndex, value) {
        switch (value) {
          case '0':
            return '여자';
          case '1':
            return '남자';
          default:
            return '';
        }
      },
    },
    {
      dataField: 'csContent',
      headerText: '상담내용',
      minWidth: 200,
    },
    {
      dataField: 'consultantName',
      headerText: '상담사',
      width: '5%',
      labelFunction(_rowIndex, _columnIndex, value, _item) {
        return value;
      },
    },
    {
      dataField: 'chargePart',
      headerText: '담당업체',
      width: '6%',
    },
    {
      dataField: 'statusResult',
      headerText: '최종 처리 결과',
      width: '10%',
      visible: true,
      labelFunction(_rowIndex, _columnIndex, value) {
        switch (value) {
          case 'COM':
            return '처리 완료';
          default:
            return '진행중';
        }
      },
    },
    // {
    //   dataField: 'consultantName',
    //   headerText: '상담처리결과',
    //   width: '4%',
    // },
    {
      dataField: 'createdAt',
      headerText: '접수날짜',
      width: 160,
      labelFunction(_rowIndex, _columnIndex, value) {
        return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      dataField: 'completeDate',
      headerText: '완료날짜',
      width: 160,
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
    // {
    //   dataField: 'edit',
    //   headerText:
    //     '<img src="./assets/img/icon/icon-options.png" style="vertical-align:middle;width: 16px;height:auto;">',
    //   width: '4%',
    //   minWidth: 50,
    //   renderer: {
    //     type: IGrid.RendererKind.IconRenderer,
    //     iconWidth: 18,
    //     iconHeight: 18,
    //     iconTableRef: {
    //       default: './assets/img/icon/icon-edit.png',
    //     },
    //     onClick: function (event) {
    //       // setIsEditOpen(true);
    //       // setCSMainId(event?.item?.id);
    //       // handleChangeSate();

    //       // CS 수정 페이지로 진입
    //       // 그리드에 있는 데이터 CS 수정 페이지로 조회
    //       // PARAM 설정 해둘 것
    //       // navigate(`/consultation`);
    //       if (user?.Org.category === 'CS' || user?.Org.category === 'HDO') {
    //         navigate(
    //           `/cs-home?id=${event?.item?.id as number}&regNoParam=${
    //             event?.item?.regNo as string
    //           }&gubun=${'detail'}`,
    //         );
    //       } else {
    //         navigate(
    //           `/as-consultation?id=${
    //             event?.item?.id as number
    //           }&flag=${'detail'}&regNoParam=${event?.item?.regNo as string}`,
    //         );
    //       }
    //     },
    //   },
    // },
  ];
  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
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
    copySingleCellOnRowMode: true,
    enableDrag: true,
  };

  const transStatus = (
    statusCdValue: string,
    transPartValue: string,
    transPartCategory: string,
  ) => {
    // CS 일때 진행 상태
    if (user?.Org?.id.toString() === transPartValue && user.type !== 'HDO') {
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
          return '진행';
      }
    } else if (
      user?.Org.category === 'CS' &&
      user?.Org.id.toString() !== transPartValue &&
      user?.type !== 'HDO'
    ) {
      switch (statusCdValue) {
        case 'HOL':
          return '진행중(보류)';
        case 'RCT':
          return '진행중(보류)';
        case 'COM':
          return '처리 완료';
        case 'ARR':
          return '처리 완료(이관)';
        case 'TRA':
          return '처리 완료(이관)';
        case 'RET':
          return '회수';
        default:
          return '진행';
      }
    } else if (user?.Org.category === 'AS') {
      switch (statusCdValue) {
        case 'HOL':
          return '진행중(보류)';
        case 'RCT':
          return '진행중(보류)';
        case 'ARR':
          return '처리완료(승인요청)';
        case 'TRA':
          return '진행중(접수)';
        case 'COM':
          return '처리 완료';
        default:
          return '진행';
      }
    } else if (user?.type === 'HDO' && transPartCategory === 'HDO') {
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
          return '진행중(승인요청)';
        default:
          return '진행';
      }
    } else if (user?.type === 'HDO' && transPartCategory !== 'HDO') {
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
          return '진행';
      }
    }
  };

  const transformData = (data: DataInput[]) => {
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

        chargePart: item.CsTransfer?.OrgName
          ? item.CsTransfer?.OrgName
          : item?.UpdateCon_orgTransName,
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
        statusCd: transStatus(
          item?.statusCd,
          item?.CsTransfer.transPart,
          item?.CsTransfer.OrgCategory,
        ),
        statusResult: item.statusCd,
        updatedAt: item.updatedAt,
        totalCount: totalCount,
      };
    });
  };

  useEffect(() => {
    if (!loading && data !== null) {
      const grid = myGrid.current as AUIGrid;

      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {});

      // 그리드 셀클릭 이벤트 바인딩
      // TODO 흠.. 헤더쪽 스타일은 cellClick 이후에 실행되어서 한박자 느리게 보임
      let previousColumnIndex: number | null = null;
      grid.bind(IGrid.EventKind.CellClick, (event: IGrid.CellClickEvent) => {
        if (previousColumnIndex !== null) {
          grid.setColumnProp(previousColumnIndex, { headerStyle: '' });
        }
        grid.setColumnProp(event.columnIndex, {
          headerStyle: 'select-header',
        });
        previousColumnIndex = event.columnIndex;
      });

      // 그리드 셀더블클릭 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          if (user?.Org.category === 'CS' || user?.type === 'HDO') {
            navigate(
              `/cs-home?id=${event?.item?.id as number}&regNoParam=${
                event?.item?.regNo as string
              }&gubun=${'detail'}`,
            );
          } else {
            navigate(
              `/as-consultation?id=${
                event?.item?.id as number
              }&flag=${'detail'}&regNoParam=${event?.item?.regNo as string}`,
            );
          }
        },
      );

      // 그리드 수직스크롤 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.VScrollChange,
        (event: IGrid.VScrollChangeEvent) => {
          const rowCount = grid.getRowCount();
          if (rowCount === totalCount) {
            grid.unbind(IGrid.EventKind.VScrollChange);
            return;
          }
          if (event.position === event.maxPosition) {
            void requestAddData();
          }
        },
      );
      // 그리드 데이터 세팅
      const data2 = [...transformData(data)];
      grid.setGridData(data2);
      setGridData(data2);
    }
  }, [loading, data]);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const requestAddData = async () => {
    loading = true;
    const grid = myGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    const url = `/v1/web/cs-list?select=${queryState.searchKey}&searcg=${queryState.searchVal}&csCls1=${queryState.csCls1}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&ctartDate=${queryState.ctartDate}&cndDate=${queryState.cndDate}&statusCd=${queryState.process}&incomingCd=${queryState.incoming}&csClass=${queryState.csClass}&rpp=${queryState.rpp}&page=${queryState.page}`;
    const accessToken = localStorage.getItem('accessToken') ?? '';

    const axios = hdoInstance();
    await axios(url, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((result) => {
        const data2 = [...transformData(result?.data?.result)];
        grid.appendData(data2);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
    // regNo 상태를 업데이트합니다.
    // 만약 regNo가 상태로 관리되고 있다면, 해당 상태를 업데이트하는 함수를 호출해야 합니다.
    return formattedRegNo;
  };

  return (
    <GridContainer
      height={
        user?.Org.category === 'CS' && user.type !== 'HDO'
          ? 'calc(100vh - 23.3rem)'
          : 'calc(100vh - 18.8rem)'
      }
    >
      {user?.Org.category !== 'AS' && (
        <TableButton
          isExcel={false}
          label="상담 목록"
          registerText="신규등록"
          register={() => {
            // const initReg = createRegNo();
            // navigate(`/cs-home?gubun=reg`);
            setIsDetail(true);
            setFlagParam('reg');
          }}
        />
      )}
      <AUIGridContainer isTableButton={true}>
        <AUIGrid
          ref={myGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
    </GridContainer>
  );
};
export default CSHomeGridTable;
