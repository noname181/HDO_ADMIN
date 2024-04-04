import { type StationFilterProps } from 'interfaces/ICharger';
import { Select } from 'antd';
import {
  StyledForm,
  StyledFormItem,
  StyledSelect,
  StyledBtn,
  PageBar,
} from 'components/common/test/Styled.ant';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

export const Pagination = ({
  queryState,
  setQueryState,
  totalCount,
}: StationFilterProps) => {
  const onChange = (value: number) => {
    setQueryState({
      ...queryState,
      rpp: value,
    });
  };
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const firstBtn = () => {
    if (queryState.page === 0) {
      setAlertModal({
        ...alertModal,
        type: 'alert',
        title: '',
        content: '첫번째 페이지입니다.',
        open: true,
      });
    } else {
      setQueryState({
        ...queryState,
        page: 0,
      });
    }
  };
  const prevBtn = () => {
    if (queryState.page <= 0) {
      setAlertModal({
        ...alertModal,
        type: 'alert',
        title: '',
        content: '첫번째 페이지입니다.',
        open: true,
      });
    } else {
      setQueryState({
        ...queryState,
        page: queryState.page - 1,
      });
    }
  };
  const nextBtn = () => {
    if (queryState.page === totalCount) {
      setAlertModal({
        ...alertModal,
        type: 'alert',
        title: '',
        content: '마지막 페이지입니다.',
        open: true,
      });
    } else {
      setQueryState({
        ...queryState,
        page: queryState.page + 1,
      });
    }
  };
  const lastBtn = () => {
    if (queryState.page === totalCount) {
      setAlertModal({
        ...alertModal,
        type: 'alert',
        title: '',
        content: '마지막 페이지입니다.',
        open: true,
      });
    } else {
      setQueryState({
        ...queryState,
        page: totalCount,
      });
    }
  };
  // TODO 페이지네이션 버튼 제한
  const totalBtn = () => {
    const onClick = (page: number) => {
      setQueryState({
        ...queryState,
        page: page - 1,
      });
    };
    const pageBtn = [];
    for (let i = 1; i <= totalCount; i++) {
      const isActive = queryState.page + 1 === i;
      pageBtn.push(
        <StyledBtn
          type="link"
          btnType={isActive ? 'ftActive' : 'footer'}
          onClick={() => {
            onClick(i);
          }}
        >
          {i}
        </StyledBtn>,
      );
    }
    return pageBtn;
  };

  return (
    <>
      <StyledForm name="grid-footer" gridcol="1fr 1fr" type="footer">
        <StyledFormItem
          name="rpp"
          label="Showing"
          className="show-list"
          type="footer"
        >
          <StyledSelect
            defaultValue={100}
            onChange={(value: any) => {
              onChange(value);
            }}
          >
            <Select.Option value={100}>100</Select.Option>
            <Select.Option value={200}>200</Select.Option>
            <Select.Option value={300}>300</Select.Option>
          </StyledSelect>
          <span style={{ paddingLeft: '10px' }}>Users out of 100</span>
        </StyledFormItem>
        <PageBar className="pagination">
          <li>
            <StyledBtn type="link" btnType="footer" onClick={firstBtn}>
              First
            </StyledBtn>
          </li>
          <li>
            <StyledBtn type="link" btnType="prev" onClick={prevBtn}>
              Prev
            </StyledBtn>
          </li>
          {totalBtn()}
          <li>
            <StyledBtn type="link" btnType="next" onClick={nextBtn}>
              next
            </StyledBtn>
          </li>
          <li>
            <StyledBtn type="link" btnType="footer" onClick={lastBtn}>
              last
            </StyledBtn>
          </li>
        </PageBar>
      </StyledForm>
    </>
  );
};
