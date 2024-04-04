import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';

import { Form } from 'antd';
import { postApi } from 'apis/postApi';
import { defaultUrl } from 'apis/api.helpers';
import { putApi } from 'apis/putApi';
import { type StateInterface, type IReview } from 'interfaces/ICommon';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledTextArea,
  StyltedIMG,
} from 'components/common/test/Styled.ant';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>> | any;
  isEditOpen: boolean;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
  setReviewId: Dispatch<SetStateAction<number | ''>>;
  ReviewId: number | '';
}

export const ReviewEdit = ({
  state,
  setState,
  isEditOpen,
  setIsEditOpen,
  setReviewId,
  ReviewId,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  function handleCloseModal() {
    setIsEditOpen(false);
    setReviewId('');
    setStars([]);
    setStars2([]);
    form.resetFields();
  }
  const { loading, error, data, getData } = useGetDataWtTrigger<IReview>();
  const [fileUrl, setFileUrl] = useState<any>([]);
  const [stars, setStars] = useState<any>([]);
  const [stars2, setStars2] = useState<any>([]);
  useEffect(() => {
    // bannereventId를 받아오면 api 호출
    if (ReviewId !== '') {
      void getData({
        url: `/review/${ReviewId}`,
      });
    }
  }, [ReviewId]);

  // api 호출 후 data를 받아오면 실행
  useEffect(() => {
    if (data !== null) {
      // 모달 열림
      form.setFieldsValue({
        content: data?.content,
        // stars: data?.stars,
      });
      setIsEditOpen(true);
      setFileUrl(data?.images);
      if (data?.stars) {
        const myVariable: any = [];
        const myVariable2: any = [];
        const myArray = myVariable as number[];
        const myArray2 = myVariable2 as number[];
        for (let i = 0; i < data?.stars; i++) {
          myArray.push(i);
        }
        if (data?.stars < 5) {
          for (let x = data?.stars; x < 5; x++) {
            myArray2.push(x);
          }
        }
        setStars(myArray);
        setStars2(myArray2);
      }
    }
  }, [data]);
  // console.log(fileUrl);

  // async function onFinish(values: any) {
  //   const newData = {
  //     content: values.content,
  //     stars: values?.stars,
  //   };
  //   await putApi(
  //     {
  //       url: `/v1/review/${ReviewId}`,
  //       data: newData,
  //     },
  //     setState,
  //   );
  //   handleCloseModal();
  // }
  // function handleOk() {
  //   form
  //     .validateFields()
  //     .then((values: any) => {
  //       // form.resetFields();
  //       void onFinish(values);
  //     })
  //     .catch((error: any) => {
  //       setAlertModal({
  //         ...alertModal,
  //         type: 'error',
  //         title: 'Form 에러',
  //         content: error,
  //       });
  //     });
  // }
  return (
    <Modal open={isEditOpen} title="리뷰" close={handleCloseModal}>
      <StyledForm
        form={form}
        name="reviewAddData"
        colon={false}
        type="modal"
        gridcol="1fr"
        style={{ borderBottom: '0' }}
      >
        <ul
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <li>
            <StyledFormItem
              name="content"
              label="내용"
              rules={[
                {
                  required: true,
                  message: '내용를 입력해주세요.',
                },
              ]}
            >
              <StyledTextArea readOnly rows={4} style={{ resize: 'none' }} />
            </StyledFormItem>
          </li>
          <li>
            <StyledFormItem name="stars" label="평점">
              <div>
                {stars?.map((item: any) => {
                  // console.log(item);
                  return (
                    <img
                      key={item.num}
                      src="./assets/img/icon/Vector.png"
                      alt="star"
                      style={{ marginRight: '10px' }}
                    />
                  );
                })}
                {stars2?.map((item: any) => {
                  // console.log(item);
                  return (
                    <img
                      key={item.num}
                      src="./assets/img/icon/VectorGrey.png"
                      alt="star"
                      style={{ marginRight: '10px' }}
                    />
                  );
                })}
              </div>
            </StyledFormItem>
          </li>

          <li style={{ height: '150px' }}>
            <StyledFormItem name="image" label="사진">
              <div>
                {fileUrl?.map((item: any, index: any) => {
                  return (
                    <>
                      <StyltedIMG
                        key="index"
                        fileUrl={item}
                        style={{ marginRight: '5px' }}
                      >
                        <StyledInput type="file" accept="image/*" disabled />
                        {item ? <img src={item} alt="사진" /> : <></>}
                      </StyltedIMG>
                    </>
                  );
                })}
              </div>
            </StyledFormItem>
          </li>
        </ul>
      </StyledForm>
      {/* <ModalFooter
        okText="저장"
        closeText="취소"
        close={handleCloseModal}
        onOk={handleCloseModal}
      /> */}
    </Modal>
  );
};
