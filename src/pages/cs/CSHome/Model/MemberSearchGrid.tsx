import { useEffect, useRef, useState } from 'react';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import * as IGrid from 'aui-grid';
import dayjs from 'dayjs';
import { AUIGridContainer, DefaultDiv, Spinner } from 'styles/style';
import { Button } from 'components/common/Button/Button';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { type StateInterface } from 'interfaces/ICommon';
import { type UserData } from 'interfaces/IConsultant';

interface MemberGridProps {
  loading: boolean;
  data: any;
  state: StateInterface;
  setState: React.Dispatch<React.SetStateAction<StateInterface>>;
  totalCount: number;
}
const MemberSearchGrid = ({
  loading,
  data,
  state,
  setState,
  totalCount,
}: MemberGridProps) => {
  const myGrid = useRef<AUIGrid>(null);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
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
    showRowCheckColumn: false, // 엑스트라 행 체크박스 출력 여부를 지정합니다.
    rowHeight: 40,
    selectionMode: 'multipleRows',
  };
  const columnLayout: IGrid.Column[] = [
    // {
    //   dataField: 'totalCount',
    //   headerText: '번호',
    //   width: '4%',
    //   minWidth: 50,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value - _rowIndex ?? '-';
    //   },
    // },
    {
      dataField: 'id',
      headerText: '회원 이름',
      visible: false,
    },
    {
      dataField: 'category',
      headerText: '회원 분류',
      visible: false,
    },
    {
      dataField: 'name',
      headerText: '회원 이름',
    },
    {
      dataField: 'phoneNo',
      headerText: '회원 연락처',
      labelFunction(_rowIndex, _columnIndex, value) {
        // return maskPhoneNumber(value);
        return value;
      },
    },
    {
      dataField: 'accountId',
      headerText: '사용자 아이디',
      labelFunction(_rowIndex, _columnIndex, value) {
        // return maskId(value);
        return value;
      },
    },
    {
      dataField: 'email',
      headerText: '회원 이메일',
      labelFunction(_rowIndex, _columnIndex, value) {
        // return maskEmail(value);
        return value;
      },
    },
    {
      dataField: 'gender',
      headerText: '성별',
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
      dataField: 'birth',
      headerText: '생년월일',
      labelFunction(_rowIndex, _columnIndex, value) {
        return dayjs(value).format('YYYY-MM-DD');
      },
    },
    {
      dataField: 'orgNmae',
      headerText: '회원 분류',
    },
    {
      dataField: 'orgCategory',
      headerText: '회원 분류 ID',
      visible: false,
    },
    {
      dataField: 'orgId',
      headerText: '회원 그룹 아이디',
      visible: false,
    },
    {
      dataField: 'address',
      headerText: '주소',
      visible: false,
    },
    {
      dataField: 'detailAddress',
      headerText: '상세주소',
      visible: false,
    },
    {
      dataField: 'zipCode',
      headerText: '우편번호',
      visible: false,
    },
    {
      dataField: 'dupinfo',
      headerText: 'userData',
      visible: false,
    },
    {
      dataField: 'createdAt',
      headerText: '가입일자',
    },
    {
      dataField: 'currentAccessDateTime',
      headerText: '마지막 접속 일자',
    },
    {
      dataField: 'status',
      headerText: '회원 상태',
      labelFunction(_rowIndex, _columnIndex, value) {
        switch (value) {
          case 'ACTIVE':
            return '이용';
          case 'SLEEP':
            return '휴면';
          case 'BLOCK':
            return '탈퇴';
          default:
            return '';
        }
      },
    },
    {
      dataField: 'lastUsedMacAddr',
      headerText: '마지막 충전 차량 주소',
      width: 100,
      visible: false,
    },
  ];

  function maskEmail(email: string) {
    const atIndex = email.indexOf('@');

    if (atIndex < 2) {
      // 유효하지 않은 이메일 형식일 경우
      return email;
    }

    const maskedPrefix = '**';
    const restOfEmail = email.substring(2); // 앞 2자를 제외한 나머지 문자열

    return maskedPrefix + restOfEmail; // 마스킹 처리한 문자열
  }

  function maskId(id: string) {
    if (id?.length < 4) {
      // 유효하지 않은 ID 형식일 경우
      return id;
    }

    const maskedPrefix = '***'; // 앞 3자리를 '*'로 대체
    const restOfID = id.substring(3); // 앞 3자를 제외한 나머지 문자열

    return maskedPrefix + restOfID; // 마스킹 처리한 문자열
  }

  function maskPhoneNumber(phoneNumber: string) {
    if (phoneNumber?.length !== 11) {
      // 유효하지 않은 핸드폰 번호 형식일 경우
      return phoneNumber;
    }

    const firstPart = phoneNumber.substring(0, 3);
    const secondPart = phoneNumber.substring(3, 7);
    const thirdPart = phoneNumber.substring(7, 11);

    // 형식을 '010-3504-8164'로 변환
    const formattedNumber = `${firstPart}-${secondPart}-${thirdPart}`;

    // 마스킹 처리 '***-****-8164'
    const maskedNumber = `***-****-${thirdPart}`;

    return maskedNumber;
  }

  const transformData = (data: UserData[]) => {
    if (data) {
      return data?.map((item) => {
        return {
          id: item?.id,
          name: item?.name,
          phoneNo: item?.phoneNo,
          accountId: item?.accountId,
          email: item?.email,
          orgNmae: item?.Org?.name,
          orgCategory: item?.Org?.category,
          createdAt: item?.createdAt,
          status: item?.status,
          lastUsedMacAddr: item?.lastUsedMacAddr,
          gender: item?.gender,
          birth: item?.birth,
          address: item?.address,
          detailAddress: item?.detailAddress,
          zipCode: item?.zipCode,
          dupinfo: item?.dupinfo,
          currentAccessDateTime: item?.currentAccessDateTime,
          totalCount: totalCount,
        };
      });
    } else {
      return [];
    }
  };

  useEffect(() => {
    // if (!loading && data !== null) {
    const grid = myGrid.current as AUIGrid;
    // 그리드 ready 이벤트 바인딩
    grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {});
    // 그리드 셀더블클릭 이벤트 바인딩
    grid.bind(
      IGrid.EventKind.CellDoubleClick,
      (event: IGrid.CellDoubleClickEvent) => {},
    );
    grid.bind(IGrid.EventKind.CellClick, (event: IGrid.CellClickEvent) => {
      if (grid.isCheckedRowById(event.rowIdValue)) {
        grid.addUncheckedRowsByIds(event.rowIdValue);
        setState({
          ...state,
          data: null,
        });
      } else {
        setState({
          ...state,
          data: event.item,
        });
      }
    });
    grid.bind(
      IGrid.EventKind.RowCheckClick,
      (event: IGrid.RowCheckClickEvent) => {},
    );
    // 그리드 수직스크롤 이벤트 바인딩
    grid.bind(
      IGrid.EventKind.VScrollChange,
      (event: IGrid.VScrollChangeEvent) => {},
    );

    const data2 = [...transformData(data)];
    // 그리드 데이터 세팅
    grid.setGridData(data2);
  }, [loading, data]);

  return (
    <DefaultDiv>
      <AUIGridContainer style={{ height: 160 }}>
        {loading && <Spinner />}
        <AUIGrid
          ref={myGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
    </DefaultDiv>
  );
};
export default MemberSearchGrid;
