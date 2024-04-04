import {
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
  useState,
  useEffect,
} from 'react';
import { Form, notification } from 'antd';
import { postApi } from 'apis/postApi';
import { type StateInterface } from 'interfaces/ICommon';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  RemoveIMGButton,
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledTextArea,
  StyltedIMG,
} from 'components/common/test/Styled.ant';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { Button } from 'components/common/Button/Button';
import { StyledButtonUpload } from 'components/common/Button/Button.styled';
import { hdoInstance } from 'apis/hdoInstance';
import { CloseButton } from 'components/common/Button/CloseButton';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>> | any;
}

export const AddData = ({ state, setState }: ModalProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string>('');
  const apiUrl = process.env.REACT_APP_API_URL;
  const [contentData, setContentData] = useState<string>('');
  function handleCloseModal() {
    setFileUrl('');
    setIsModalOpen(false);
    form.resetFields();
  }
  const handleUpload: any = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) {
      return;
    }
    const file = event.target.files[0];
    const fmData = new FormData();
    fmData.append('file', file);

    const axios = hdoInstance();
    axios
      .post(`/uploads`, fmData, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'multipart/form-data',
          'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(
            file.name,
          )}`,
        },
      })
      .then((res: any) => {
        const url = res?.data?.result?.id;
        setFileUrl(url);
        form.setFieldValue('imageUrl', url);
        // setAlertModal({
        //   ...alertModal,
        //   open: true,
        //   type: 'success',
        //   title: '알림',
        //   content: '완료되었습니다.',
        // });
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
  const handleDeleteImage = () => {
    // const updatedSelectedMultipleImage = [...selectedMultipleImage];
    // const updatedPreviewImages = [...previewImageMultiple];

    // updatedSelectedMultipleImage.splice(index, 1);
    // updatedPreviewImages.splice(index, 1);

    // const updatedImages = updatedSelectedMultipleImage.map((file, idx) =>
    //   URL.createObjectURL(file),
    // );

    // setSelectedMultipleImage(updatedSelectedMultipleImage);
    // setPreviewImageMultiple(updatedImages);

    // const newUrls = selectedMultipleImage.map((file) => file);
    // form.setFieldValue('secondaryImage', newUrls?.join(','));
    setFileUrl('');
    const currentData = { ...form.getFieldsValue(), imageUrl: null };
    form.resetFields();
    form.setFieldsValue(currentData);
    setContentData(form.getFieldValue('content'));
  };
  async function onFinish(values: any) {
    const newData = {
      content: values.content,
      title: values.title,
      imageUrl: values.imageUrl,
    };
    await postApi(
      {
        url: `/v1/notice`,
        data: newData,
      },
      setState,
    );
  }

  function handleOk() {
    form
      .validateFields()
      .then((values: any) => {
        // form.resetFields();
        void onFinish(values);
      })
      .catch((error: any) => {
        setAlertModal({
          ...alertModal,
          type: 'error',
          title: 'Form 에러',
          content: error,
        });
      });
  }

  useEffect(() => {
    if (state.isSuccess) {
      handleCloseModal();
    }
    if (state.error?.errorCode) {
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

      <Modal open={isModalOpen} title="공지사항" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="noticeAddData"
          colon={false}
          type="modal"
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
                name="content"
                label="내용"
                rules={[
                  {
                    required: true,
                    message: '내용를 입력해주세요.',
                  },
                ]}
              >
                <SunEditor
                  height="370px"
                  setContents={contentData}
                  onChange={(content) => {
                    const regex = /(<([^>]+)>)/gi;
                    const hasText = !!content.replace(regex, '').length;
                    if (hasText) {
                      form.setFieldValue('content', content);
                    } else {
                      form.setFieldValue('content', '');
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
            <li style={{ height: '150px' }}>
              <StyledFormItem
                name="imageUrl"
                label="이미지 첨부"
                // rules={[
                //   {
                //     required: true,
                //     message: '이미지 첨부를 입력해주세요.',
                //   },
                // ]}
              >
                <StyltedIMG fileUrl={fileUrl}>
                  <StyledInput
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                  />
                  {fileUrl ? (
                    <div style={{ position: 'relative' }}>
                      <RemoveIMGButton>
                        <CloseButton
                          onClick={(event) => {
                            event.preventDefault();
                            handleDeleteImage();
                          }}
                        ></CloseButton>
                      </RemoveIMGButton>
                      <img
                        src={String(apiUrl) + '/view-file?path=' + fileUrl}
                        alt="리스트 배너"
                      />
                    </div>
                  ) : (
                    <StyledButtonUpload size="md" color="reset" w100={true}>
                      파일 선택
                    </StyledButtonUpload>
                  )}
                </StyltedIMG>
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
