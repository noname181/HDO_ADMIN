import {
  useEffect,
  useState,
  type ChangeEvent,
  type SetStateAction,
  type Dispatch,
} from 'react';
import FaqGrid from './FaqGrid';
import {
  GridContainer,
  DefaultDiv,
  GridHeader,
  GridRefetch,
} from 'styles/style';
// import { Select } from 'components/common/Select/Select';
import { Input } from 'components/common/Input/Input';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import {
  type OrganizationInterface,
  type StateInterface,
} from 'interfaces/ICommon';
import { useGetListWt } from 'hooks/useGetListWt';
import {
  StyledSelectInput,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { Select } from 'antd';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import {
  AreaSelectList,
  BranchSelectList,
  FaqCategorySelectList,
} from 'utils/codelookup';
interface Props {
  search?: boolean;
  titleInput: string;
  settitleInput: Dispatch<SetStateAction<string | ''>>;
  cateSelected: string;
  setcateSelected: Dispatch<SetStateAction<string | ''>>;
}
interface optionSelected {
  value: string | number;
  label: string;
}
export const Faq = ({
  titleInput,
  settitleInput,
  cateSelected,
  setcateSelected,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [optionSelect, setoptionSelect] = useState<optionSelected[]>([
    { value: '', label: '전체' },
  ]);
  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    searchKey: 'ALL',
    searchVal: '',
    category: '',
  });
  const [FaqId, setFaqId] = useState<number | ''>('');
  const [checkRowId, setCheckRowId] = useState<number[]>([]);

  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });
  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
  }: UseGetListResponse<OrganizationInterface> = useGetListWt({
    url: `/faq?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&select=${queryState.searchKey}&search=${queryState.searchVal}&category=${queryState.category}`,
  });

  useEffect(() => {
    if (state.isSuccess) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'success',
        title: '알림',
        content: '완료되었습니다.',
      });
      setCheckRowId([]);
      refetch();
      setState({
        ...state,
        isSuccess: false,
      });
    }
  }, [state]);
  // useEffect(() => {
  //   refetch();
  // }, [search]);

  useEffect(() => {
    if (data && data.length > 0 && titleInput === '' && cateSelected === '') {
      // const arrayCheck: string[] = [];
      // const optionAdd: optionSelected[] = [{ value: '', label: '전체' }];
      // data.map((value: any) => {
      //   if (arrayCheck.length > 0) {
      //     if (arrayCheck && !arrayCheck.includes(value.category)) {
      //       arrayCheck.push(value.category);
      //       optionAdd.push({ value: value.category, label: value.category });
      //     }
      //   } else {
      //     arrayCheck.push(value.category);
      //     optionAdd.push({ value: value.category, label: value.category });
      //   }
      //   return optionAdd;
      // });
      const optionAdd: optionSelected[] = [
        { label: '전체', value: '' },
        // { label: '카테고리 ', value: '카테고리' },
        { label: '제목', value: '제목' },
      ];
      setoptionSelect(optionAdd);
    }
  }, [data]);

  // const handleOpenModal = () => {
  //   setIsModalOpen(true);
  // };
  // const emptyFunction: () => void = () => {
  //   // 비워져 있는 함수
  // };
  // function reloadData() {
  //   settitleInput('');
  //   setcateSelected('');

  //   if (refetch) {
  //     refetch();
  //   }
  // }
  const search = () => {
    setQueryState({
      ...queryState,
      rpp: 50,
      page: 0,
      odby: 'DESC',
    });
    setCheckRowId([]);

    refetch();
  };

  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 0,
      odby: 'DESC',
      searchKey: 'ALL',
      searchVal: '',
      category: '',
    });
    setCheckRowId([]);

    refetch();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && refetch) {
      refetch();
    }
  };

  return (
    <>
      <DefaultDiv>
        {/* <Filter>
        <Select
          label="카테고리"
          options={optionSelect}
          onChange={(value) => {
            setcateSelected(value.value);
          }}
        />
        <Input
          label="제목"
          value={titleInput}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            settitleInput(event.target.value);
          }}
        />
      </Filter> */}
        <DefaultDiv>
          <GridRefetch refetch={search} reload={reload} />
          <GridHeader container grid>
            <StyledSelectInput>
              {/* <Select
                options={optionSelect}
                onChange={(value) => {
                  setcateSelected(value.value);
                }}
              /> */}
              <StyledSelect
                value={queryState.searchKey}
                onChange={(value) => {
                  setQueryState({
                    ...queryState,
                    searchKey: value as string,
                  });
                }}
              >
                <Select.Option value="ALL">전체</Select.Option>
                {/* <Select.Option value="CATEGORY">카테고리</Select.Option> */}
                <Select.Option value="TITLE">제목</Select.Option>
              </StyledSelect>

              <Input
                value={queryState.searchVal}
                onChange={(event) => {
                  setQueryState({
                    ...queryState,
                    searchVal: event.target.value,
                  });
                }}
                onKeyDown={handleKeyPress}
              />
            </StyledSelectInput>
            <FaqCategorySelectList
              value={queryState.category}
              onChange={(e: any) => {
                setQueryState({
                  ...queryState,
                  category: e,
                });
              }}
            />
          </GridHeader>
        </DefaultDiv>
        <GridContainer height="calc(100vh - 15.7rem)">
          <FaqGrid
            loading={loading}
            data={data}
            state={state}
            setState={setState}
            setcateSelected={setcateSelected}
            settitleInput={settitleInput}
            setFaqId={setFaqId}
            FaqId={FaqId}
            totalCount={totalCount}
            queryState={queryState}
            setQueryState={setQueryState}
            setCheckRowId={setCheckRowId}
            checkRowId={checkRowId}
          />
        </GridContainer>
      </DefaultDiv>
    </>
  );
};
