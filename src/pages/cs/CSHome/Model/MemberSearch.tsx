import { type Dispatch, type SetStateAction, useState, useEffect } from 'react';

import { Form } from 'antd';
// import { postApi } from 'apis/postApi';
// import { defaultUrl } from 'apis/api.helpers';

import { type StateCsInterface } from 'interfaces/ICommon';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
} from 'components/common/test/Styled.ant';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import MemberSearchGrid from './MemberSearchGrid';
import { Button } from 'components/common/Button/Button';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { useGetList } from 'hooks/useGetList';
import { type UserData } from 'interfaces/IConsultant';
import { hdoInstance } from 'apis/hdoInstance';
import { DRow } from '../style';

interface ModalProps {
  state: StateCsInterface;
  setState: React.Dispatch<React.SetStateAction<StateCsInterface>>;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  userPhoneNo: string;
}

export const MemberSearch = ({
  state,
  setState,
  isModalOpen,
  setIsModalOpen,
  userPhoneNo,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [selectedData, setSelectedData] = useState(null);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [isSendModel, setIsSendModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData>();
  const [totalCount, setTotalCount] = useState<number>(0);

  interface MSearchOptionInterface {
    rpp: number;
    page: number;
    odby: 'DESC' | 'ASC';
    phoneNo: string;
    userId: string;
  }

  const [queryState, setQueryState] = useState<MSearchOptionInterface>({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    phoneNo: userPhoneNo,
    userId: '',
  });
  // 상담 유저 데이터
  const fetchUser = async () => {
    const url = `/v1/web/cs-customer?phoneNo=${queryState.phoneNo}&userId=${queryState.userId}`;
    const accessToken = localStorage.getItem('accessToken') ?? '';
    setLoading(true);
    const axios = hdoInstance();
    await axios(url, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((result) => {
        setUserData(result.data);
        setTotalCount(result.data.totalCount);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function handleCloseModal() {
    setIsModalOpen(false);
    form.resetFields();
  }
  // async function onFinish(values: any) {
  //   // const newData = {
  //   //   number: values.number,
  //   //   regtime: '',
  //   //   division: values.division,
  //   //   information: values.information,
  //   //   isUsed: values.isUsed,
  //   //   count: 0,
  //   // };
  //   // await postApi(
  //   //   {
  //   //     url: `/cs-main`,
  //   //     data: newData,
  //   //   },
  //   //   setState,
  //   // );
  //   handleCloseModal();
  // }
  function handleOk() {
    const formData = form.getFieldsValue();
    setState({
      ...state,
      formData: formData,
      isLoading: true,
    });
    handleCloseModal();
  }

  const searchMember = () => {
    void fetchUser();
  };
  useEffect(() => {
    form.setFieldsValue({
      phoneNo: userPhoneNo,
    });
    setQueryState({
      ...queryState,
      phoneNo: userPhoneNo,
    });
  }, [userPhoneNo]);

  return (
    <>
      <Modal
        open={isModalOpen}
        title="회원/비회원 검색"
        close={handleCloseModal}
      >
        <StyledForm form={form} name="MemberSearch" colon={false} type="modal">
          <StyledFormItem
            name="phoneNo"
            label="전화번호"
            rules={[
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
          >
            <StyledInput
              value={queryState.phoneNo}
              onChange={(event) => {
                setQueryState({
                  ...queryState,
                  phoneNo: event?.target.value,
                });
              }}
            />
          </StyledFormItem>
          <StyledFormItem name="userId" label="회원 ID">
            <StyledInput
              value={queryState.userId}
              onChange={(event) => {
                setQueryState({
                  ...queryState,
                  userId: event?.target.value,
                });
              }}
            />
          </StyledFormItem>
          <DRow style={{ justifyContent: 'flex-end' }}>
            <Button
              onClick={() => {
                void fetchUser();
              }}
              minWidth="100px"
            >
              검색
            </Button>
          </DRow>
          <div style={{ gridColumn: '1 / 4' }}>
            <MemberSearchGrid
              loading={loading}
              data={userData}
              state={state}
              setState={setState}
              totalCount={totalCount}
            />
          </div>
        </StyledForm>
        <span>
          ** 회원은 등록된 전화번호와 id정보로 결제 정보가 검색되어 보여지며,
          비회원은 결제시 사용자가 입력한 전화번호로 검색이 됩니다. <br />
          ** 결제 내역 확인이 불가한 경우, 결제내역 - 충전결제내역 메뉴에서
          처리가 가능합니다
        </span>
        <ModalFooter
          okText="선택"
          closeText="취소"
          close={handleCloseModal}
          onOk={handleOk}
        />
      </Modal>
    </>
  );
};
