import {
  type Dispatch,
  type SetStateAction,
  useState,
  useEffect,
  type ChangeEvent,
} from 'react';

import { Form, DatePicker, TimePicker, notification, Select } from 'antd';
import { postApiUpdate } from 'apis/postApi';
import { defaultUrl } from 'apis/api.helpers';

// 타입
import { type StateInterface } from 'interfaces/ICommon';
// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyltedIMG,
  StyltedIMGMany,
  StyledSelect,
  RemoveIMGButton,
} from 'components/common/test/Styled.ant';
import { Button } from 'components/common/Button/Button';
import { CloseButton } from 'components/common/Button/CloseButton';
import { alertModalState } from 'recoil/modalState';
import { useRecoilState } from 'recoil';
import { StyledButtonUpload } from 'components/common/Button/Button.styled';
import { hdoInstance } from 'apis/hdoInstance';
import dayjs from 'dayjs';

interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
}

export const AddData = ({ state, setState }: ModalProps) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [optionSelect, setOptionSelect] = useState<string>('');
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [showManyImage, setShowManyImage] = useState<string>('t');
  const [DateError, setDateError] = useState<any>('undefined');
  // upload 1 image
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [manyImgError, setManyImgError] = useState<string>('none');

  // upload multiple image
  const [selectedMultipleImage, setSelectedMultipleImage] = useState<File[]>(
    [],
  );
  const [previewImageMultiple, setPreviewImageMultiple] = useState<string[]>(
    [],
  );

  // function handleOpenModal() {
  //   setIsModalOpen(true);
  // }

  function handleCloseModal() {
    setIsModalOpen(false);
    form.resetFields();
    setFileUrl('');
    setSelectedImage(null);
    setPreviewImage('');
    setDateError('undefined');
    setShowManyImage('t');
    setOptionSelect('');
    setManyImgError('none');
    setPreviewImageMultiple([]);
    setSelectedMultipleImage([]);
  }
  async function onFinish(values: any) {
    let newUrls: any[] = [];
    const accessToken = localStorage.getItem('accessToken') ?? '';
    const axios = hdoInstance();

    if (!accessToken) {
      return;
    }
    // if (selectedImage) {
    //   const fmData = new FormData();
    //   fmData.append('file', selectedImage);

    //   const uploadResponse = await axios
    //     .post(`/uploads`, fmData, {
    //       headers: {
    //         Authorization: accessToken,
    //         'Content-Type': 'multipart/form-data',
    //         'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(
    //           selectedImage.name,
    //         )}`,
    //       },
    //     })
    //     .catch((err) => {
    //       const errorMessage = err.response
    //         ? err.response.data.message
    //         : 'Error';
    //       setState({
    //         isLoading: false,
    //         isSuccess: false,
    //         error: err?.response?.data?.message || errorMessage,
    //       });
    //       console.log('error-', err?.response?.data?.message);
    //     });

    //   const url = uploadResponse?.data?.result?.url;

    //   setFileUrl(url);
    //   form.setFieldValue('image', url);
    // }
    if (selectedMultipleImage.length > 0) {
      const fmData = new FormData();
      Array.from(selectedMultipleImage).forEach((file, index) => {
        // console.log(file);
        fmData.append(`files`, file);
      });
      const uploadResponse = await axios
        .post(`/uploads-many`, fmData, {
          headers: {
            Authorization: accessToken,
            'Content-Type': 'multipart/form-data',
          },
        })
        .catch((err) => {
          const errorMessage = err.response
            ? err.response.data.message
            : 'Error';
          setState({
            isLoading: false,
            isSuccess: false,
            error: err?.response?.data?.message || errorMessage,
          });
          console.log('error-', err?.response?.data?.message);
        });

      newUrls = uploadResponse?.data?.result.map((file: any) => ({
        id: file.id,
        url: file.url,
      }));
    }
    const valuesData = await form.getFieldsValue();

    const newData = {
      title: values.title,
      image: valuesData.image,
      startdate:
        dayjs(values.startdate).format('YYYY-MM-DD') +
        ' ' +
        dayjs(values.timeStartDate).format('HH:mm') +
        ':00',
      enddate:
        dayjs(values.enddate).format('YYYY-MM-DD') +
        ' ' +
        dayjs(values.timeEndDate).format('HH:mm') +
        ':00',
      secondaryImage: newUrls?.map((file: any) => ({
        id: file.id,
        url: file.url,
      })),
      option: values?.option,
      url: values.option === '제휴' ? values.url : null,
    };
    await postApiUpdate(
      {
        url: `/banner`,
        data: newData,
      },
      setState,
      // (error) => {
      //   if (error) {
      //     alert(error.message);
      //   }
      // },
    );
  }
  async function handleOk() {
    const accessToken = localStorage.getItem('accessToken') ?? '';
    const axios = hdoInstance();
    if (selectedImage) {
      const fmData = new FormData();
      fmData.append('file', selectedImage);

      const uploadResponse = await axios
        .post(`/uploads`, fmData, {
          headers: {
            Authorization: accessToken,
            'Content-Type': 'multipart/form-data',
            'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(
              selectedImage.name,
            )}`,
          },
        })
        .catch((err) => {
          const errorMessage = err.response
            ? err.response.data.message
            : 'Error';
          setState({
            isLoading: false,
            isSuccess: false,
            error: err?.response?.data?.message || errorMessage,
          });
          console.log('error-', err?.response?.data?.message);
        });

      const url = uploadResponse?.data?.result?.url;
      const id = uploadResponse?.data?.result?.id;

      setFileUrl(id);
      form.setFieldValue('image', id);
    }
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
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (state.isSuccess) {
      handleCloseModal();
    }
  }, [state]);

  const handleUpload: any = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length === 0) {
      return;
    }
    const fileUpload = event.target.files?.[0];
    if (fileUpload) {
      setSelectedImage(fileUpload);
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = e?.target?.result;
        setPreviewImage(dataURL as string);
      };
      reader?.readAsDataURL(fileUpload);
    }

    // const accessToken = localStorage.getItem('accessToken') ?? '';
    // if (!accessToken) {
    //   return;
    // }
    // const file = event.target.files?.[0];
    // const fmData = new FormData();
    // fmData.append('file', file);

    // const axios = hdoInstance();
    // axios
    //   .post(`/uploads`, fmData, {
    //     headers: {
    //       Authorization: accessToken,
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   })
    //   .then((res: any) => {
    //     const url = res?.data?.result?.url;
    //     setFileUrl(url);
    //     form.setFieldValue('image', url);
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
  };
  const handleUploadImgDetail: any = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files) {
      return;
    }
    const selectedFiles = Array.from(event.target.files);
    setManyImgError('none');
    if (event.target.files.length > 5) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: 'Form 에러',
        content: '5개 이미지 이상을 등록할 수 없습니다.',
      });
    } else {
      setSelectedMultipleImage(selectedFiles);
      const imagePreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file),
      );
      setPreviewImageMultiple(imagePreviews);
    }
    // const accessToken = localStorage.getItem('accessToken') ?? '';
    // if (!accessToken) {
    //   return;
    // }
    // const fmData = new FormData();

    // Array.from(event.target.files).forEach((file, index) => {
    //   // console.log(file);
    //   fmData.append(`files`, file);
    // });
    // // console.log(fileList);
    // const axios = hdoInstance();
    // try {
    //   const res = await axios.post(`/uploads-many`, fmData, {
    //     headers: {
    //       Authorization: accessToken,
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   });
    //   if (res) {

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
  const handleDeleteImage = (index: number) => {
    const updatedSelectedMultipleImage = [...selectedMultipleImage];
    const updatedPreviewImages = [...previewImageMultiple];

    updatedSelectedMultipleImage.splice(index, 1);
    updatedPreviewImages.splice(index, 1);

    const updatedImages = updatedSelectedMultipleImage.map((file, idx) =>
      URL.createObjectURL(file),
    );
    setManyImgError('none');
    setSelectedMultipleImage(updatedSelectedMultipleImage);
    setPreviewImageMultiple(updatedImages);

    const newUrls = selectedMultipleImage.map((file) => file);
    form.setFieldValue('secondaryImage', newUrls?.join(','));

    const currentData = { ...form.getFieldsValue(), secondaryImage: null };
    form.resetFields();
    form.setFieldsValue(currentData);
  };
  // console.log(optionSelect);
  return (
    <>
      <Button
        size="md"
        color="primary"
        icon="/assets/img/icon/icon-add-w.png"
        alt="등록"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        등록
      </Button>
      <Modal open={isModalOpen} title="배너/이벤트" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="bannereventAddData"
          colon={false}
          type="modal"
          initialValues={{
            closed: false,
            option: '자사',
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
            {optionSelect === '제휴' && (
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
                      // pattern:
                      //   /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi,
                      // message: '유효하지 않은 URL',
                      pattern:
                        /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g,
                      message: '유효하지 않은 URL',
                    },
                  ]}
                >
                  <StyledInput />
                </StyledFormItem>
              </li>
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
                  status={DateError}
                  picker="date"
                  placeholder="YYYY-MM-DD"
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
                  status={DateError}
                  format={'HH:mm'}
                  placeholder="시작시간"
                  minuteStep={1}
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
                  status={DateError}
                  picker="date"
                  placeholder="YYYY-MM-DD"
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
                  status={DateError}
                  placeholder="종료시간"
                  minuteStep={1}
                  onChange={() => {
                    setDateError(undefined);
                  }}
                />
              </StyledFormItem>
            </li>
            <li>
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
                  {previewImage ? (
                    <img src={previewImage} alt="리스트 배너" />
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
            <li>
              {showManyImage === 't' && (
                <StyledFormItem name="secondaryImage" label="상세 이미지">
                  <StyltedIMGMany>
                    <StyledInput
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        // event.stopPropagation();
                        // const value = event.target.value;
                        // if (value) {
                        // }
                        const value = event.target.value;
                        if (value) {
                          handleUploadImgDetail(event);
                        } else {
                          event.stopPropagation();
                        }
                      }}
                      multiple
                    />

                    {selectedMultipleImage.length !== 0 && (
                      <div
                        style={{
                          display: 'flex',
                          overflowX: 'auto',
                          width: '100%',
                          maxWidth: 988,
                        }}
                      >
                        {selectedMultipleImage.map((file, index) => (
                          <div
                            key={index}
                            style={{ position: 'relative', marginRight: 10 }}
                          >
                            <RemoveIMGButton>
                              <CloseButton
                                onClick={(event) => {
                                  event.preventDefault();
                                  handleDeleteImage(index);
                                }}
                              ></CloseButton>
                            </RemoveIMGButton>

                            <img
                              src={previewImageMultiple[index]}
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
                        marginTop:
                          selectedMultipleImage?.length !== 0 ? '10px' : '0',
                      }}
                    >
                      파일 선택
                    </StyledButtonUpload>
                  </StyltedIMGMany>
                  {manyImgError !== 'none' && (
                    <p
                      style={{
                        marginTop: '0px',
                        fontSize: '14px',
                        color: '#ff4d4f',
                      }}
                    >
                      5개 이미지 이상을 등록할 수 없습니다.
                    </p>
                  )}
                  <div style={{ marginTop: '5px' }}>
                    <label style={{ color: 'red', fontSize: '16px' }}>
                      ② 이미지 사이즈: 360 * 500
                    </label>
                  </div>
                </StyledFormItem>
              )}
            </li>
          </ul>
        </StyledForm>
        <ModalFooter
          okText="저장"
          closeText="취소"
          close={handleCloseModal}
          onOk={() => {
            void handleOk();
          }}
        />
      </Modal>
    </>
  );
};
