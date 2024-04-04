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
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
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
  StyledRadio,
  StyledRadioBtn,
  StyledTextArea,
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
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [DateError, setDateError] = useState<any>('undefined');
  // upload 1 image
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
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
    setDateError('undefined');
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

      setFileUrl(url);
      form.setFieldValue('image', url);
    }
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
      contents: values.contents,
      // image: valuesData.image,
      firstDate:
        dayjs(values.firstDate).format('YYYY-MM-DD') +
        ' ' +
        dayjs(values.timeFirstDate).format('HH:mm') +
        ':00',
      lastDate:
        dayjs(values.lastDate).format('YYYY-MM-DD') +
        ' ' +
        dayjs(values.timeLastDate).format('HH:mm') +
        ':00',
      imagesUrl: newUrls?.map((file: any) => ({
        id: file.id,
        url: file.url,
      })),
      isActive: values?.isActive,
      type: values?.type,
    };
    await postApiUpdate(
      {
        url: `/v1/web/notice`,
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
  function handleOk() {
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
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (state.isSuccess) {
      handleCloseModal();
    }
  }, [state]);

  const handleUploadImgDetail: any = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files) {
      return;
    }
    const selectedFiles = Array.from(event.target.files);
    console.log(event.target.files);

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
    form.setFieldValue('imagesUrl', newUrls?.join(','));

    const currentData = { ...form.getFieldsValue(), imagesUrl: null };
    form.resetFields();
    form.setFieldsValue(currentData);
  };
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
      <Modal open={isModalOpen} title="공지 팝업" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="noticepopupAddData"
          colon={false}
          type="modal"
          initialValues={{
            isActive: 'Y',
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
                  status={DateError}
                  picker="date"
                  placeholder="YYYY-MM-DD"
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
                  status={DateError}
                  format={'HH:mm'}
                  placeholder="시작시간"
                  minuteStep={1}
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
                  status={DateError}
                  picker="date"
                  placeholder="YYYY-MM-DD"
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
                rules={[
                  {
                    required: true,
                    message: '내용을 입력해주세요.',
                  },
                ]}
              >
                <SunEditor
                  height="290px"
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
              <StyledFormItem
                name="imagesUrl"
                label="첨부파일"
                // rules={[
                //   {
                //     required: true,
                //     message: '첨부파일를 입력해주세요.',
                //   },
                // ]}
              >
                <div
                  style={{
                    display: 'grid',
                    width: '100%',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                  }}
                >
                  {selectedMultipleImage.map((file, index) => (
                    <div
                      key={index}
                      style={{ position: 'relative', marginRight: 10 }}
                    >
                      {/* <img
                          src={previewImageMultiple[index]}
                          alt="리스트 배너"
                          style={{ display: 'none' }}
                        /> */}
                      <div
                        style={{
                          color: '#184bf3',
                          textDecoration: 'underline',
                          marginRight: '10px',
                        }}
                      >
                        {file?.name}
                      </div>
                      <RemoveIMGButton>
                        <CloseButton
                          onClick={(event) => {
                            event.preventDefault();
                            handleDeleteImage(index);
                          }}
                        ></CloseButton>
                      </RemoveIMGButton>
                    </div>
                  ))}
                </div>
                <StyltedIMGMany>
                  <StyledInput
                    type="file"
                    accept="*/*"
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

                  <StyledButtonUpload
                    size="md"
                    color="reset"
                    w100={true}
                    style={{
                      width: '75px',
                      marginTop:
                        selectedMultipleImage?.length !== 0 ? '10px' : '0',
                    }}
                    onClick={(event) => {
                      if (selectedMultipleImage.length >= 5) {
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
