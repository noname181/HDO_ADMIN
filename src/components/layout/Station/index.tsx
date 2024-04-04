import { useState, useEffect, useRef, memo } from 'react';
import {
  NavbarSearch,
  SearchModel,
  ListStation,
  ItemRow,
  ItemColumn,
  Column,
  ItemRowHead,
  ItemRowBody,
} from './styled';
// api
import { useGetListWtTriggerSearchStation } from 'hooks/useGetListWt';
// 타입
// import { type StateInterface } from 'interfaces/ICommon';
import { type StationInterface } from 'interfaces/ICharger';
import useClickOutside from 'components/common/Ref/UseClickOutside';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { userAuthState } from 'recoil/authState';

const SearchStation = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<number>(-1);
  const [searchValue, setSearchValue] = useState('');
  const [{ user }] = useRecoilState(userAuthState);
  const [isShowSearch, setShowSearch] = useState<boolean>(false);
  const [queryState, setQueryState] = useState({
    search: '',
    rpp: 5,
  });
  const navigate = useNavigate();

  // 충전소 데이터 조회
  // const { loading, error, data, refetch } = useGetListWt<StationInterface>({
  //   url: `/search?search=${queryState.search}&rpp=${queryState.rpp}`,
  // });
  const { loading, error, data, getData } =
    useGetListWtTriggerSearchStation<StationInterface>();

  useEffect(() => {
    // console.log(queryState.search);
    if (isOpen) {
      void getData({
        url: `/search?search=${queryState.search}&rpp=${queryState.rpp}`,
      });
    }
  }, [queryState.search]);

  useClickOutside(modalRef, () => {
    setIsOpen(false);
  });

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.keyCode === 38) {
          // Up arrow key pressed
          // Perform action
          if (activeItem && activeItem > 0) {
            setActiveItem(activeItem - 1);
          } else {
            setActiveItem(4);
          }
        } else if (event.keyCode === 40) {
          if (activeItem < 4) {
            setActiveItem(activeItem + 1);
          } else {
            setActiveItem(0);
          }
          // console.log('key down');
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
    // console.log('hanle keyboard called');
  }, [isOpen, activeItem]);
  // console.log(data);
  const handleSearch = (value: { chgs_name: string }, index: number) => {
    const valuesData = value?.chgs_name;
    // console.log(valuesData);
    setQueryState({
      ...queryState,
      search: valuesData,
    });
    setActiveItem(index);
    setSearchValue(valuesData);
    navigate(`/charging-station`, {
      state: { searchKey: 'chgs_name', searchVal: valuesData, from: 'parent' },
    });
    setIsOpen(false);
  };
  // console.log(queryState.search);
  useEffect(() => {
    if (error) {
      console.log(error);
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title:
          error?.response?.data?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
        content:
          error?.response?.data?.message ?? 'api 호출 에러 : 콘솔창 확인',
      });
    }
  }, [error]);

  useEffect(() => {
    if (user?.role?.charger?.permissions[0]?.rules?.read) {
      setShowSearch(true);
    } else {
      setShowSearch(false);
    }
  }, [user]);
  return isShowSearch ? (
    <NavbarSearch ref={modalRef}>
      <img src="/assets/img/icon/icon-search.png" alt="검색 아이콘" />
      <input
        type="text"
        className="form-control"
        placeholder="충전소명, ID를 검색하세요."
        name="search"
        autoComplete="off"
        value={queryState.search ?? searchValue}
        onChange={(e: any) => {
          if (e.target.value === '정지')
            setQueryState({
              ...queryState,
              search: 'INACTIVE',
            });
          else if (e.target.value === '운영')
            setQueryState({
              ...queryState,
              search: 'ACTIVE',
            });
          else
            setQueryState({
              ...queryState,
              search: e.target.value,
            });
        }}
        onFocus={() => {
          setIsOpen(true);
        }}
      />
      {isOpen && queryState.search !== '' && (
        <>
          <SearchModel>
            <ListStation>
              {data && data?.length > 0 ? (
                data.map((value: any, index: number) => {
                  return (
                    <ItemRow
                      key={index}
                      isActive={activeItem === index}
                      onClick={() => {
                        handleSearch(value, index);
                      }}
                    >
                      <ItemColumn col="left">
                        <ItemRowHead>{value?.chgs_name}</ItemRowHead>
                        <ItemRowBody>
                          <Column>{value?.chgs_station_id}</Column>
                        </ItemRowBody>
                      </ItemColumn>
                      <ItemColumn col="right" status={value?.status}>
                        {value?.status === 'INACTIVE' ? '정지' : '운영'}
                      </ItemColumn>
                    </ItemRow>
                  );
                })
              ) : (
                <ItemRow isEmpty={true}>작업 내역이 없습니다.</ItemRow>
              )}
            </ListStation>
          </SearchModel>
        </>
      )}
    </NavbarSearch>
  ) : (
    <></>
  );
};
export default memo(SearchStation);
