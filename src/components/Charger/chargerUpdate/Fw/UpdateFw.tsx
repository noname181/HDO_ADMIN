import React, { useEffect, useState, useRef } from 'react';
import { GridContainer, Filter } from 'styles/style';
import { Select } from 'components/common/Select/Select';
import { Button } from '../../../../components/common/Button/Button';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { hdoInstance } from 'apis/hdoInstance';

export const UpdateFw = () => {
  const chargerGrid = useRef<AUIGrid>(null);
  const [needYN, setNeedYN] = useState<string>('all');
  const [fileURL, setFileURL] = useState<string>('');

  const trans = () => {
    console.log('전송 확인');
    // console.log(fileURL);
  };

  const changeSelect = (selectedOption: any) => {
    setNeedYN(selectedOption);
  };

  const search = () => {
    // const rootUrl = process.env.REACT_APP_API_URL;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    // const apiUrl = `${rootUrl}/charger-fw'`;
    const apiUrl = '';
    // 'http://localhost:8080/charger-fw';
    const paramData = {
      needYN,
    };

    const axios = hdoInstance();
    axios
      .get(apiUrl, {
        params: paramData,
      })
      .then((response) => {
        // console.log(response);
        const grid = chargerGrid.current as AUIGrid;
        const updatedData = response.data.chargers.map((item: any) => {
          let categoryValue = '';
          switch (item.category) {
            case 'DEF':
              categoryValue = '일반이용자';
              break;
            case 'HDO':
              categoryValue = '현대오일뱅크';
              break;
            case 'STT_DIR':
              categoryValue = '직영 충전소';
              break;
            case 'STT_FRN':
              categoryValue = '자영 충전소';
              break;
            case 'CS':
              categoryValue = 'CS';
              break;
            case 'AS':
              categoryValue = 'AS';
              break;
            case 'BIZ':
              categoryValue = '법인';
              break;
            case 'ALLNC':
              categoryValue = '협력사';
              break;
            case 'GRP':
              categoryValue = '그룹';
              break;
            default:
              categoryValue = '';
              break;
          }
          return {
            ...item,
            category: categoryValue,
          };
        });
        grid.setGridData(updatedData);
        setFileURL(response.data.maxVersion.fileURL);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    // console.log('마운트됨');
    search();
  }, []);

  // ********그리드*************
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'chg_id',
      headerText: '충전기 아이디',
      width: 200,
      visible: false,
    },
    {
      dataField: 'chgs_name',
      headerText: '충전기명',
      style: 'text-center',

      width: 350,
      // editable: false,
    },
    {
      dataField: 'category',
      headerText: '구분',
      width: 350,
      style: 'text-center',
    },
    {
      dataField: 'area',
      headerText: '지역 코드',
      width: 200,
      visible: false,
      style: 'text-center',
    },
    {
      dataField: 'branch',
      headerText: '지사 코드',
      width: 180,
      visible: false,
      style: 'text-center',
    },
    {
      dataField: 'areaDesc',
      headerText: '부분',
      width: 100,
      style: 'text-center',
    },
    {
      dataField: 'branchDesc',
      headerText: '지사',
      width: 200,
      style: 'text-center',
    },
    {
      dataField: 'chg_charger_id',
      headerText: '충전기 아이디',
      width: 200,
      style: 'text-center',
    },
    {
      dataField: 'chg_use_yn',
      headerText: '사용여부',
      width: 150,
      style: 'text-center',
    },
    {
      dataField: 'cs_charger_state',
      headerText: '상태',
      width: 100,
      style: 'text-center',
    },
    {
      dataField: 'termsVersion',
      headerText: '적용버전',
      width: 150,
      style: 'text-center',
    },
    {
      dataField: 'lastVer',
      headerText: '최신버전',
      width: 150,
      style: 'text-center',
    },
    {
      dataField: 'chargerModelId',
      headerText: '모델 아이디',
      width: 200,
      style: 'text-center',
    },
    {
      dataField: 'modelName',
      headerText: '모델명',
      width: 200,
      style: 'text-center',
    },
    {
      dataField: 'maxKw',
      headerText: '속도(kW)',
      width: 200,
      style: 'text-center',
    },
  ];

  const gridProps: IGrid.Props = {
    width: '100%',
    // autoGridHeight: true,
    fillColumnSizeMode: true,
    headerHeights: [40],
    editable: true, // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    showRowCheckColumn: true,
    showRowAllCheckBox: true,
    rowHeight: 40,
    selectionMode: 'multipleRows',
  };

  const setupGridEvents = () => {
    const grid = chargerGrid.current as AUIGrid;

    grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
      // console.log(event);
    });
  };

  return (
    <>
      <Filter>
        <Select
          label="FW 업데이트"
          onChange={changeSelect}
          options={[
            {
              value: 'all',
              label: '전체',
            },
            {
              value: 'send',
              label: '필요',
            },
            {
              value: 'desend',
              label: '필요없음',
            },
          ]}
        ></Select>
        <div></div>
        <div></div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
          <div style={{ width: '90px' }}>
            <Button
              size="md"
              color="primary"
              icon="/assets/img/icon/icon-add-w.png"
              onClick={search}
              w100={true}
            >
              검색
            </Button>
          </div>
        </div>
      </Filter>
      <GridContainer height="calc(100vh - 15.7rem)">
        <div style={{ display: 'flex', position: 'relative', height: '50px' }}>
          <div style={{ width: '50px', textAlign: 'center' }}>
            <div style={{ marginTop: '10px' }}>
              <label htmlFor="광고 전송">
                {' '}
                * 충전기 중 상태가 충전중, 충전대기 인 충전기에만 전송이
                가능합니다.
              </label>
            </div>
          </div>
          <div style={{ position: 'absolute', right: 0 }}>
            <Button
              size="md"
              color="primary"
              icon="/assets/img/icon/icon-add-w.png"
              onClick={trans}
            >
              FW 전송
            </Button>
          </div>
        </div>
        <AUIGrid
          ref={chargerGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </GridContainer>
    </>
  );
};
