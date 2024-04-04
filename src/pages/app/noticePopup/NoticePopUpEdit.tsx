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
  type NoticePopUpInterface,
} from 'interfaces/ICommon';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyltedIMG,
  StyltedIMGMany,
  StyledSelect,
  RemoveIMGButton,
  StyledRadio,
  StyledRadioBtn,
  StyledTextArea,
} from 'components/common/test/Styled.ant';
import { StyledButtonUpload } from 'components/common/Button/Button.styled';
import { hdoInstance } from 'apis/hdoInstance';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
interface NoticePopUpEditProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
  NoticePopUpId: number | '';
  setNoticePopUpId: Dispatch<SetStateAction<number | ''>>;
}

function toDatetime(date: dayjs.Dayjs, time: dayjs.Dayjs): Date {
  return new Date(
    `${date.format('YYYY-MM-DD')}T${time.format('HH:mm') + ':00'}`,
  );
}

export const NoticePopUpEdit = ({
  state,
  setState,
  NoticePopUpId,
  setNoticePopUpId,
}: NoticePopUpEditProps) => {
  // Form 상태
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  // 1image value
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [DateError, setDateError] = useState<any>('undefined');
  // manyimage
  const [selectedMultipleImage, setSelectedMultipleImage] = useState<File[]>(
    [],
  );
  const [previewImageMultiple, setPreviewImageMultiple] = useState<string[]>(
    [],
  );
  const [contentsData, setContentsData] = useState<string>('');

  // Edit 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Alert 모달
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  // 모달 닫는 함수
  const handleCloseModal = () => {
    setNoticePopUpId('');
    setIsModalOpen(false);
    setSelectedImage(null);
    setDateError('undefined');
    setPreviewImageMultiple([]);
    setSelectedMultipleImage([]);
  };

  // api 호출 준비
  const { data, getData } = useGetDataWtTrigger<NoticePopUpInterface>();

  useEffect(() => {
    // NoticePopUpId를 받아오면 api 호출
    if (NoticePopUpId !== '') {
      void getData({
        url: `/v1/web/notice/${NoticePopUpId}`,
      });
    }
  }, [NoticePopUpId]);

  // api 호출 후 data를 받아오면 실행
  useEffect(() => {
    if (data !== null) {
      form.setFieldsValue({
        title: data?.title,
        contents: data?.contents,

        imagesUrl: data?.imagesUrl,
        firstDate: dayjs(data?.firstDate),
        lastDate: dayjs(data?.lastDate),
        timeFirstDate: data?.firstDate ? dayjs(data?.firstDate) : null,
        timeLastDate: data?.lastDate ? dayjs(data.lastDate) : null,
        isActive: data?.isActive,
        type: data?.type,
      });
      setIsModalOpen(true);
      setFileList(data?.imagesUrl);
      setContentsData(data?.contents);
    }
  }, [data]);

  // 모달 저장
  const handleOk = () => {
    form
      .validateFields()
      .then((values: any) => {
        // form.resetFields();
        // void onFinish(values);
        const firstDate =
          dayjs(values.firstDate).format('YYYY-MM-DD') +
          dayjs(values.timeFirstDate).format('HH:mm') +
          ':00';

        const lastDate =
          dayjs(values.lastDate).format('YYYY-MM-DD') +
          dayjs(values.timeLastDate).format('HH:mm') +
          ':00';

        if (firstDate > lastDate) {
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
      const chargingNoticePopUpData = {
        title: values.title,
        contents: values.contents,
        image: url,
        firstDate: toDatetime(values.firstDate, values.timeFirstDate),
        lastDate: toDatetime(values.lastDate, values.timeLastDate),
        imagesUrl: fileList?.map((file) => ({
          id: file.id,
          url: file.url,
        })),
        isActive: values?.isActive,
        type: values?.type,
      };
      await putApi(
        {
          url: `/v1/web/notice/${NoticePopUpId}`,
          data: chargingNoticePopUpData,
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
      const chargingNoticePopUpData = {
        title: values.title,
        contents: values.contents,
        // image: values.image,
        firstDate: toDatetime(values.firstDate, values.timeFirstDate),
        lastDate: toDatetime(values.lastDate, values.timeLastDate),
        imagesUrl: [...fileList, ...newUrls].filter((file) => {
          if (file.id !== '') {
            return true;
          } else {
            return false;
          }
        }),
        isActive: values?.isActive,
        type: values?.type,
      };
      await putApi(
        {
          url: `/v1/web/notice/${NoticePopUpId}`,
          data: chargingNoticePopUpData,
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

      const chargingNoticePopUpData = {
        title: values.title,
        contents: values.contents,
        // image: url,
        firstDate: toDatetime(values.firstDate, values.timeFirstDate),
        lastDate: toDatetime(values.lastDate, values.timeLastDate),
        imagesUrl: [...fileList, ...newUrls].filter((file) => {
          if (file.id !== '') {
            return true;
          } else {
            return false;
          }
        }),
        isActive: values?.isActive,
        type: values?.type,
      };
      await putApi(
        {
          url: `/v1/web/notice/${NoticePopUpId}`,
          data: chargingNoticePopUpData,
        },
        setState,
      );
    } else {
      const chargingNoticePopUpData = {
        title: values.title,
        contents: values.contents,
        // image: values.image,
        firstDate: toDatetime(values.firstDate, values.timeFirstDate),
        lastDate: toDatetime(values.lastDate, values.timeLastDate),
        imagesUrl: fileList?.map((file) => ({
          id: file.id,
          url: file.url,
        })),
        isActive: values?.isActive,
        type: values?.type,
      };
      await putApi(
        {
          url: `/v1/web/notice/${NoticePopUpId}`,
          data: chargingNoticePopUpData,
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
      // console.log(selectedFiles);
      const newUrls = selectedFiles.map((file: any) => ({
        id: '',
        url: URL.createObjectURL(file),
        name: file.name,
      }));
      if (fileList && fileList?.length > 0) {
        setFileList([...fileList, ...newUrls]);
      } else {
        setFileList(newUrls);
      }
      // console.log(fileList);
      const axios = hdoInstance();
    }
  };

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
  };
  // useEffect(() => {
  //   console.log(optionSelect);
  // }, [optionSelect]);
  const isKoreanText = (text: string): boolean => {
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    return koreanRegex.test(text);
  };
  const downloadFile = (fileURL: string) => {
    if (!fileURL || fileURL === '') {
      setAlertModal((prev) => ({
        ...alertModal,
        open: true,
        type: 'error',
        content: '다운로드할 파일이 없습니다.',
      }));
      return;
    }
    // window.location.href = fileURL;
    const url = fileURL;
    const spFileName = url.split('/').pop();
    if (isKoreanText(spFileName as string)) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        content: '한글파일명은 지원하지 않습니다.',
      });
      return;
    }

    const axios = hdoInstance();
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) {
      return;
    }

    axios
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`/download-file?path=upload/${spFileName}`, {
        responseType: 'blob',
        timeout: 7200000,
      })
      .then((response) => {
        const blob = new Blob([response?.data]);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.target = '_blank';
        link.download = spFileName ?? '충전기 전송파일 관리';
        link.click();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const validateContent = async (_: any, value: any) => {
    const regExp = /<\/?[^>]+(>|$)/g;
    if (!regExp.test(value)) {
      return await Promise.reject(new Error('내용을 입력해주세요.'));
    }
    await Promise.resolve();
  };
  // console.log(fileList);
  return (
    <>
      <Modal open={isModalOpen} title="공지 팝업" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="NoticePopUpEditData"
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
              <StyledFormItem label="노출여부" name="isActive" required>
                <StyledRadio>
                  <StyledRadioBtn value="Y">노출</StyledRadioBtn>
                  <StyledRadioBtn value="N">비노출</StyledRadioBtn>
                </StyledRadio>
              </StyledFormItem>
            </li>
            <li>
              <StyledFormItem
                label="유형"
                name="type"
                rules={[
                  {
                    required: true,
                    message: '유형을 입력해주세요.',
                  },
                ]}
              >
                <StyledSelect>
                  <Select.Option value="WEB">WEB</Select.Option>
                  <Select.Option value="MOBILE">MOBILE</Select.Option>
                </StyledSelect>
              </StyledFormItem>
            </li>
            <li style={{ display: 'flex' }}>
              <StyledFormItem
                name="firstDate"
                label="노출기간"
                rules={[
                  {
                    required: true,
                    message: '노출기간을 입력해주세요.',
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
                name="timeFirstDate"
                style={{ marginLeft: '10px' }}
                rules={[
                  {
                    required: true,
                    message: '시작시간을 입력해주세요.',
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
              <StyledFormItem
                name="lastDate"
                style={{ marginLeft: '10px' }}
                rules={[
                  {
                    required: true,
                    message: '노출기간을 입력해주세요.',
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
                name="timeLastDate"
                rules={[
                  {
                    required: true,
                    message: '종료시간을 입력해주세요.',
                  },
                ]}
                // style={{ marginLeft: '10px' }}
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
            <li>
              <StyledFormItem
                name="title"
                label="제목"
                rules={[
                  {
                    required: true,
                    message: '제목을 입력해주세요.',
                  },
                ]}
              >
                <StyledInput />
              </StyledFormItem>
            </li>

            <li>
              <StyledFormItem
                name="contents"
                label="내용"
                rules={[{ validator: validateContent }]}
                required
              >
                <SunEditor
                  height="290px"
                  setContents={contentsData}
                  onChange={(contents) => {
                    const regex = /(<([^>]+)>)/gi;
                    const hasText = !!contents.replace(regex, '').length;
                    if (hasText) {
                      form.setFieldValue('contents', contents);
                    } else {
                      form.setFieldValue('contents', '');
                    }
                  }}
                  setOptions={{
                    buttonList: [
                      // default
                      ['undo', 'redo'],
                      ['fontSize'],
                      ['bold', 'underline', 'italic'],
                      ['fontColor', 'hiliteColor'],
                      ['indent', 'outdent'],
                      ['align', 'horizontalRule'],
                      // ["table", "link", "image", "codeView"],
                      ['table', 'link', 'list'],
                      ['removeFormat'],
                      ['fullScreen'],
                    ],
                  }}
                />
              </StyledFormItem>
            </li>
            <li>
              <StyledFormItem name="imagesUrl" label="첨부파일">
                {fileList?.length !== 0 && fileList !== null && (
                  <div
                    style={{
                      display: 'grid',
                      width: '100%',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '20px',
                    }}
                  >
                    {fileList?.map((file, index) => (
                      <div
                        key={index}
                        style={{ position: 'relative', marginRight: 10 }}
                      >
                        <div
                          style={{
                            color: '#184bf3',
                            textDecoration: 'underline',
                            marginRight: '10px',
                            cursor: file?.id ? 'pointer' : 'default',
                          }}
                          onClick={(event) => {
                            downloadFile(file?.id);
                          }}
                        >
                          {file?.id || file?.name}
                        </div>

                        <RemoveIMGButton>
                          <CloseButton
                            onClick={(event) => {
                              event.preventDefault();
                              handleDeleteImage(index, file.id);
                            }}
                          ></CloseButton>{' '}
                        </RemoveIMGButton>
                        {/* <img key={index} src={file.url} alt="리스트 배너" /> */}
                      </div>
                    ))}
                  </div>
                )}
                <StyltedIMGMany>
                  <StyledInput
                    type="file"
                    accept="*/*"
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

                  <StyledButtonUpload
                    size="md"
                    color="reset"
                    w100={true}
                    style={{
                      width: '75px',
                      marginTop: fileList?.length !== 0 ? '10px' : '0',
                    }}
                    onClick={(event) => {
                      // console.log(fileList);
                      if (fileList.length >= 5) {
                        setAlertModal({
                          ...alertModal,
                          open: true,
                          type: 'error',
                          title: 'Form 에러',
                          content: '5개 이미지 이상을 등록할 수 없습니다.',
                        });
                        event.preventDefault();
                      }
                    }}
                  >
                    파일 선택
                  </StyledButtonUpload>
                </StyltedIMGMany>
                <div style={{ marginTop: '5px' }}>
                  <label style={{ color: 'red', fontSize: '16px' }}>
                    첨부파일은 최대 5개까지 등록 가능합니다.
                  </label>
                </div>
              </StyledFormItem>
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
