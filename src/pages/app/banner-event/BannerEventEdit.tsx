import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
  type ChangeEvent,
} from 'react';

// antd
import {
  Form,
  DatePicker,
  TimePicker,
  notification,
  Select,
  Upload,
} from 'antd';
import { CloseButton } from 'components/common/Button/CloseButton';

// api
import { defaultUrl } from 'apis/api.helpers';
import { putApi } from 'apis/putApi';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';

// 전역상태관리
import { alertModalState } from 'recoil/modalState';
import { useRecoilState } from 'recoil';

// 공통컴포넌트
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import dayjs from 'dayjs';

// 타입
import {
  type StateInterface,
  type BannerEventInterface,
} from 'interfaces/ICommon';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyltedIMG,
  StyltedIMGMany,
  StyledSelect,
  RemoveIMGButton,
} from 'components/common/test/Styled.ant';
import { StyledButtonUpload } from 'components/common/Button/Button.styled';
import { hdoInstance } from 'apis/hdoInstance';

interface BannerEventEditProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
  bannereventId: number | '';
  setBannerEventId: Dispatch<SetStateAction<number | ''>>;
}

function toDatetime(date: dayjs.Dayjs, time: dayjs.Dayjs): Date {
  return new Date(
    `${date.format('YYYY-MM-DD')}T${time.format('HH:mm') + ':00'}`,
  );
}

export const BannerEventEdit = ({
  state,
  setState,
  bannereventId,
  setBannerEventId,
}: BannerEventEditProps) => {
  // Form 상태
  const [form] = Form.useForm();
  const [fileUrl, setFileUrl] = useState<string>('');
  const [fileList, setFileList] = useState<any[]>([]);
  const [idDelete, setidDelete] = useState<any[]>([]);
  const [optionSelect, setOptionSelect] = useState<string>('');
  // 1image value
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [DateError, setDateError] = useState<any>('undefined');
  // manyimage
  const [selectedMultipleImage, setSelectedMultipleImage] = useState<File[]>(
    [],
  );
  const [previewImageMultiple, setPreviewImageMultiple] = useState<string[]>(
    [],
  );
  // Edit 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showManyImage, setShowManyImage] = useState<string>('t');
  // Alert 모달
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const apiUrl = process.env.REACT_APP_API_URL;
  // 모달 닫는 함수
  const handleCloseModal = () => {
    setBannerEventId('');
    setIsModalOpen(false);
    setSelectedImage(null);
    setPreviewImage('');
    setShowManyImage('t');
    setDateError('undefined');
    setPreviewImageMultiple([]);
    setSelectedMultipleImage([]);
  };

  // api 호출 준비
  const { data, getData } = useGetDataWtTrigger<BannerEventInterface>();

  useEffect(() => {
    // bannereventId를 받아오면 api 호출
    if (bannereventId !== '') {
      void getData({
        url: `/banner/${bannereventId}`,
      });
    }
  }, [bannereventId]);

  // api 호출 후 data를 받아오면 실행
  useEffect(() => {
    if (data !== null) {
      form.setFieldsValue({
        title: data?.title,
        image: data?.image,
        startdate: dayjs(data?.startdate),
        enddate: dayjs(data?.enddate),
        timeStartDate: data?.startdate ? dayjs(data?.startdate) : null,
        timeEndDate: data?.enddate ? dayjs(data.enddate) : null,
        option: data?.option,
        url: data?.url,
      });
      setIsModalOpen(true);
      setPreviewImage(data?.image);
      setFileList(data?.secondaryImage);
      setOptionSelect(data?.option);
      if (data?.option === '제휴') {
        setShowManyImage('f');
      } else {
        setShowManyImage('t');
      }
    }
  }, [data]);

  // 모달 저장
  const handleOk = () => {
    form
      .validateFields()
      .then((values: any) => {
        // form.resetFields();
        // void onFinish(values);
        const startDate =
          dayjs(values.startdate).format('YYYY-MM-DD') +
          dayjs(values.timeStartDate).format('HH:mm') +
          ':00';

        const endDate =
          dayjs(values.enddate).format('YYYY-MM-DD') +
          dayjs(values.timeEndDate).format('HH:mm') +
          ':00';

        if (startDate > endDate) {
          setAlertModal({
            ...alertModal,
            open: true,
            type: 'error',
            title: 'Form 에러',
            content: '시작일이 종료일보다 클 수 없습니다.',
          });
          setDateError('error');
        } else if (selectedMultipleImage.length > 5) {
          setAlertModal({
            ...alertModal,
            open: true,
            type: 'error',
            title: 'Form 에러',
            content: '5개 이미지 이상을 등록할 수 없습니다.',
          });
          // setManyImgError('error');
        } else {
          void onFinish(values);
        }
      })
      .catch((error: any) => {
        // setAlertModal({
        //   ...alertModal,
        //   open: true,
        //   type: 'error',
        //   title: 'Form 에러',
        //   content: error,
        // });
        console.log(error);
      });
  };

  // 폼제출
  async function onFinish(values: any) {
    // console.log(values);
    const accessToken = localStorage.getItem('accessToken') ?? '';
    const axios = hdoInstance();
    let newUrls: any[] = [];

    if (selectedImage && selectedMultipleImage.length === 0) {
      const fmData = new FormData();
      fmData.append('file', selectedImage);

      const uploadResponse = await axios.post(`/uploads`, fmData, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'multipart/form-data',
          'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(
            selectedImage.name,
          )}`,
        },
      });

      const url = uploadResponse?.data?.result?.url;

      // setFileUrl(url);
      // form.setFieldValue('image', url);
      // console.log(url);
      const chargingBannerEventData = {
        title: values.title,
        image: url,
        startdate: toDatetime(values.startdate, values.timeStartDate),
        enddate: toDatetime(values.enddate, values.timeEndDate),
        secondaryImage: fileList?.map((file) => ({
          id: file.id,
          url: file.url,
        })),
        option: values.option,
        url: values.option === '제휴' ? values.url : null,
      };
      await putApi(
        {
          url: `/banner/${bannereventId}`,
          data: chargingBannerEventData,
        },
        setState,
      );
    } else if (selectedMultipleImage.length > 0 && !selectedImage) {
      const fmData = new FormData();
      // console.log(selectedMultipleImage);
      Array.from(selectedMultipleImage).forEach((file, index) => {
        // console.log(file);
        fmData.append(`files`, file);
      });
      const uploadResponse = await axios.post(`/uploads-many`, fmData, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'multipart/form-data',
        },
      });

      newUrls = uploadResponse?.data?.result.map((file: any) => ({
        id: file.id,
        url: file.url,
      }));
      // console.log([...fileList, ...newUrls]);
      const chargingBannerEventData = {
        title: values.title,
        image: values.image,
        startdate: toDatetime(values.startdate, values.timeStartDate),
        enddate: toDatetime(values.enddate, values.timeEndDate),
        secondaryImage: [...fileList, ...newUrls].filter((file) => {
          if (file.id !== '') {
            return true;
          } else {
            return false;
          }
        }),
        option: values.option,
        url: values.option === '제휴' ? values.url : null,
      };
      await putApi(
        {
          url: `/banner/${bannereventId}`,
          data: chargingBannerEventData,
        },
        setState,
      );
    } else if (selectedImage && selectedMultipleImage.length > 0) {
      const fmData = new FormData();
      fmData.append('file', selectedImage);

      // const uploadResponse = await axios.post(`/uploads`, fmData, {
      //   headers: {
      //     Authorization: accessToken,
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      Array.from(selectedMultipleImage).forEach((file, index) => {
        // console.log(file);
        fmData.append(`files`, file);
      });
      const uploadResponse = await axios.post(`/uploads-many-images`, fmData, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'multipart/form-data',
        },
      });
      const url = uploadResponse?.data?.file?.url;
      newUrls = uploadResponse?.data?.files?.map((file: any) => ({
        id: file.id,
        url: file.url,
      }));

      const chargingBannerEventData = {
        title: values.title,
        image: url,
        startdate: toDatetime(values.startdate, values.timeStartDate),
        enddate: toDatetime(values.enddate, values.timeEndDate),
        secondaryImage: [...fileList, ...newUrls].filter((file) => {
          if (file.id !== '') {
            return true;
          } else {
            return false;
          }
        }),
        option: values.option,
        url: values.option === '제휴' ? values.url : null,
      };
      await putApi(
        {
          url: `/banner/${bannereventId}`,
          data: chargingBannerEventData,
        },
        setState,
      );
    } else {
      const chargingBannerEventData = {
        title: values.title,
        image: values.image,
        startdate: toDatetime(values.startdate, values.timeStartDate),
        enddate: toDatetime(values.enddate, values.timeEndDate),
        secondaryImage: fileList?.map((file) => ({
          id: file.id,
          url: file.url,
        })),
        option: values.option,
        url: values.option === '제휴' ? values.url : null,
      };
      await putApi(
        {
          url: `/banner/${bannereventId}`,
          data: chargingBannerEventData,
        },
        setState,
      );
    }
  }

  // 폼제출 후 state 상태로 분기 처리
  useEffect(() => {
    // 등록 완료
    if (state.isSuccess) {
      // 모달 창 닫기
      handleCloseModal();
    }

    // 등록 에러
    if (state.error) {
      const textError = state?.error?.errorMessage ?? state?.error?.message;
      console.log(state.error);
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: state.error?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
        content: textError ?? 'api 호출 에러 : 콘솔창 확인',
      });
    }
  }, [state]);

  const handleUpload: any = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) {
      return;
    }
    const file = event.target.files[0];
    // if (fileUpload) {
    //   setSelectedImage(fileUpload);
    //   // const file = event.target.files[0];
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     const dataURL = e?.target?.result;
    //     // console.log('vao: ', dataURL);
    //     setPreviewImage(dataURL as string);
    //   };
    //   reader.readAsDataURL(fileUpload);
    // }

    const fmData = new FormData();
    fmData.append('file', file);
    const axios = hdoInstance();
    axios
      .post(`/uploads`, fmData, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res: any) => {
        const url = res?.data?.result?.id;
        setPreviewImage(url);
        form.setFieldValue('image', url);
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'success',
          title: '알림',
          content: '완료되었습니다.',
        });
      })
      .catch((err) => {
        const errorMessage = err.response ? err.response.data.message : 'Error';
        setState({
          isLoading: false,
          isSuccess: false,
          error: err?.response?.data?.message || errorMessage,
        });
        console.log('error-', err?.response?.data?.message);
      });
  };
  const handleUploadImgDetail: any = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files) {
      return;
    }
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) {
      return;
    }
    const fmData = new FormData();
    const selectedFiles = Array.from(event.target.files);
    if (event.target.files.length > 5) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: 'Form 에러',
        content: '5개 이미지 이상을 등록할 수 없습니다.',
      });
    } else {
      Array.from(event.target.files).forEach((file, index) => {
        // console.log(file);
        fmData.append(`files`, file);
      });

      setSelectedMultipleImage([...selectedMultipleImage, ...selectedFiles]);
      const imagePreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file),
      );
      setPreviewImageMultiple(imagePreviews);
      const newUrls = selectedFiles.map((file: any) => ({
        id: '',
        url: URL.createObjectURL(file),
      }));
      if (fileList && fileList?.length > 0) {
        setFileList([...fileList, ...newUrls]);
      } else {
        setFileList(newUrls);
      }
      // console.log(fileList);
      const axios = hdoInstance();
    }
    // try {
    //   const res = await axios.post(`/uploads-many`, fmData, {
    //     headers: {
    //       Authorization: accessToken,
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   });
    //   if (res) {
    //     setAlertModal({
    //       ...alertModal,
    //       open: true,
    //       type: 'success',
    //       title: '알림',
    //       content: '완료되었습니다.',
    //     });
    //   }
    //   const newUrls = res?.data?.result.map((file: any) => ({
    //     id: file.id,
    //     url: file.url,
    //   }));

    //   setFileList([...fileList, ...newUrls]);
    //   // console.log(newUrls);
    //   // console.log(fileList);

    //   form.setFieldValue('secondaryImage', fileList.join(','));
    // } catch (err) {}
  };
  // useEffect(() => {
  //   console.log(fileList);
  //   const newUrls = fileList?.map((file) => file.url);
  //   form.setFieldValue('secondaryImage', newUrls?.join(','));
  //   console.log(form.getFieldValue('secondaryImage'));
  // }, [fileList]);
  const handleDeleteImage = (index: number, id: string) => {
    let updatedSelectedMultipleImage = [...selectedMultipleImage];
    const updatedPreviewImages = [...previewImageMultiple];
    const updatedFileList = [...fileList];
    const updatedFileList2 = updatedFileList.filter((file) => {
      if (file.id !== '') {
        return true;
      } else {
        return false;
      }
    });
    updatedFileList.splice(index, 1);
    if (id === '') {
      if (updatedSelectedMultipleImage?.length === 1) {
        updatedSelectedMultipleImage = [];
      } else {
        // console.log(index - updatedFileList2?.length);
        updatedSelectedMultipleImage.splice(
          index - updatedFileList2?.length,
          1,
        );
      }
      updatedPreviewImages.splice(index, 1);
    }

    // updatedFileList.forEach((file, index) => {
    //   file.id = index;
    // });
    setFileList(updatedFileList);
    const updatedImages = updatedSelectedMultipleImage.map((file, idx) =>
      URL.createObjectURL(file),
    );
    setSelectedMultipleImage(updatedSelectedMultipleImage);
    setPreviewImageMultiple(updatedImages);
    const currentData = { ...form.getFieldsValue(), secondaryImage: null };
    form.resetFields();
    form.setFieldsValue(currentData);
    // updatedFileList.forEach((file, index) => {
    //   file.id = index;
    // });
    // setFileList(updatedFileList);

    // const accessToken = localStorage.getItem('accessToken') ?? '';
    // if (!accessToken) {
    //   return;
    // }

    // const axios = hdoInstance();
    // axios
    //   .delete(`/uploads/${id}`, {
    //     headers: {
    //       Authorization: accessToken,
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   })
    //   .then((res: any) => {
    //     setAlertModal({
    //       ...alertModal,
    //       open: true,
    //       type: 'success',
    //       title: '알림',
    //       content: '완료되었습니다.',
    //     });
    //   })
    //   .catch((err) => {
    //     const errorMessage = err.response ? err.response.data.message : 'Error';
    //     setState({
    //       isLoading: false,
    //       isSuccess: false,
    //       error: err?.response?.data?.message || errorMessage,
    //     });
    //     console.log('error-', err?.response?.data?.message);
    //   });
    // const newUrls = updatedFileList?.map((file) => file.url);
    // form.setFieldValue('secondaryImage', newUrls.join(','));
  };
  // useEffect(() => {
  //   console.log(optionSelect);
  // }, [optionSelect]);

  return (
    <>
      <Modal open={isModalOpen} title="배너/이벤트" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="bannereventEditData"
          colon={false}
          type="modal"
          initialValues={{
            closed: false,
          }}
          gridcol="1fr"
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
                name="title"
                label="제목"
                rules={[
                  {
                    required: true,
                    message: '제목를 입력해주세요.',
                  },
                ]}
              >
                <StyledInput />
              </StyledFormItem>
            </li>
            <li>
              <StyledFormItem
                name="option"
                label="유형"
                rules={[
                  {
                    required: true,
                    message: '유형를 입력해주세요.',
                  },
                ]}
              >
                <StyledSelect
                  onChange={(val: any) => {
                    // console.log(val);
                    if (val === '제휴') {
                      setShowManyImage('f');
                    } else {
                      setShowManyImage('t');
                    }
                    setOptionSelect(val);
                  }}
                >
                  <Select.Option value="자사">자사</Select.Option>
                  <Select.Option value="제휴">제휴</Select.Option>
                </StyledSelect>
              </StyledFormItem>
            </li>
            {optionSelect === '제휴' ? (
              <li>
                <StyledFormItem
                  name="url"
                  label="URL"
                  rules={[
                    {
                      required: true,
                      message: 'URL를 입력해주세요.',
                    },
                    {
                      pattern:
                        /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g,
                      message: '유효하지 않은 URL',
                    },
                  ]}
                >
                  <StyledInput />
                </StyledFormItem>
              </li>
            ) : (
              ''
            )}

            <li style={{ display: 'flex' }}>
              <StyledFormItem
                name="startdate"
                label="시작일"
                rules={[
                  {
                    required: true,
                    message: '제목를 입력해주세요.',
                  },
                ]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  picker="date"
                  placeholder="YYYY-MM-DD"
                  status={DateError}
                  onChange={() => {
                    setDateError(undefined);
                  }}
                />
              </StyledFormItem>
              <StyledFormItem
                name="timeStartDate"
                style={{ marginLeft: '10px' }}
                rules={[
                  {
                    required: true,
                    message: '시작시간를 입력해주세요.',
                  },
                ]}
              >
                <TimePicker
                  format={'HH:mm'}
                  placeholder="시작시간"
                  minuteStep={1}
                  status={DateError}
                  onChange={() => {
                    setDateError(undefined);
                  }}
                />
              </StyledFormItem>
            </li>
            <li style={{ display: 'flex' }}>
              <StyledFormItem
                name="enddate"
                label="종료일"
                rules={[
                  {
                    required: true,
                    message: '제목를 입력해주세요.',
                  },
                ]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  picker="date"
                  placeholder="YYYY-MM-DD"
                  status={DateError}
                  onChange={() => {
                    setDateError(undefined);
                  }}
                />
              </StyledFormItem>
              <StyledFormItem
                name="timeEndDate"
                rules={[
                  {
                    required: true,
                    message: '종료시간를 입력해주세요.',
                  },
                ]}
                style={{ marginLeft: '10px' }}
              >
                <TimePicker
                  format={'HH:mm'}
                  placeholder="종료시간"
                  minuteStep={1}
                  status={DateError}
                  onChange={() => {
                    setDateError(undefined);
                  }}
                />
              </StyledFormItem>
            </li>
            {/* <li>
              <StyledFormItem name="content" label="내용">
                <StyledTextArea rows={4} style={{ resize: 'none' }} />
              </StyledFormItem>
            </li> */}
            <li style={{ height: '150px' }}>
              <StyledFormItem
                name="image"
                label="리스트 배너"
                rules={[
                  {
                    required: true,
                    message: '리스트 배너를 입력해주세요.',
                  },
                ]}
              >
                <StyltedIMG fileUrl={fileUrl}>
                  <StyledInput
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value) {
                        handleUpload(event);
                      } else {
                        event.stopPropagation();
                      }
                    }}
                  />
                  {/* {fileUrl ? (
                    <img src={fileUrl} alt="리스트 배너" />
                  ) : (
                    <StyledButtonUpload size="md" color="reset" w100={true}>
                      파일 선택
                    </StyledButtonUpload>
                  )} */}
                  {previewImage ? (
                    <img
                      src={String(apiUrl) + '/view-file?path=' + previewImage}
                      alt="리스트 배너"
                    />
                  ) : (
                    <StyledButtonUpload size="md" color="reset" w100={true}>
                      파일 선택
                    </StyledButtonUpload>
                  )}
                </StyltedIMG>
                <div style={{ marginTop: '5px' }}>
                  <label style={{ color: 'red', fontSize: '16px' }}>
                    ① 이미지 사이즈 : 320 * 162
                  </label>
                </div>
              </StyledFormItem>
            </li>
            <li style={{ marginTop: '20px' }}>
              {showManyImage === 't' && (
                <StyledFormItem name="secondaryImage" label="상세 이미지">
                  <StyltedIMGMany>
                    <StyledInput
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const value = event.target.value;
                        if (value) {
                          handleUploadImgDetail(event);
                        } else {
                          event.stopPropagation();
                        }
                      }}
                      multiple
                    />
                    {/* {selectedMultipleImage.length !== 0 && (
                    <div style={{ display: 'flex' }}>
                      {selectedMultipleImage.map((file, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                          <div
                            style={{ position: 'absolute', right: 2, top: -1 }}
                          >
                            <CloseButton
                              onClick={(event) => {
                                event.preventDefault();
                                handleDeleteImage(index);
                              }}
                            ></CloseButton>{' '}
                          </div>

                          <img key={index} src={file.url} alt="리스트 배너" />
                        </div>
                      ))}
                    </div>
                  )} */}
                    {fileList?.length !== 0 && fileList !== null && (
                      <div
                        style={{
                          display: 'flex',
                          overflowX: 'auto',
                          width: '100%',
                          maxWidth: 988,
                        }}
                      >
                        {fileList?.map((file, index) => (
                          <div
                            key={index}
                            style={{ position: 'relative', marginRight: 10 }}
                          >
                            <RemoveIMGButton>
                              <CloseButton
                                onClick={(event) => {
                                  event.preventDefault();
                                  handleDeleteImage(index, file.id);
                                }}
                              ></CloseButton>{' '}
                            </RemoveIMGButton>
                            <img
                              key={index}
                              src={
                                file?.url
                                  ? file.url
                                  : String(apiUrl) +
                                    '/view-file?path=' +
                                    String(file?.id)
                              }
                              alt="리스트 배너"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <StyledButtonUpload
                      size="md"
                      color="reset"
                      w100={true}
                      style={{
                        width: '75px',
                        marginTop: fileList?.length !== 0 ? '10px' : '0',
                      }}
                    >
                      파일 선택
                    </StyledButtonUpload>
                    <div style={{ marginTop: '5px' }}>
                      <label style={{ color: 'red', fontSize: '16px' }}>
                        ② 이미지 사이즈: 360 * 500
                      </label>
                    </div>
                  </StyltedIMGMany>
                </StyledFormItem>
              )}
            </li>
          </ul>
        </StyledForm>
        <ModalFooter
          okText="저장"
          closeText="취소"
          close={handleCloseModal}
          onOk={handleOk}
        />
      </Modal>
    </>
  );
};
