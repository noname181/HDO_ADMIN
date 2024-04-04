import {
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
  useEffect,
  useState,
} from 'react';

import { Form, notification } from 'antd';
import { postApi } from 'apis/postApi';
import { defaultUrl } from 'apis/api.helpers';
import { putApi } from 'apis/putApi';
import { type StateInterface, type INotice } from 'interfaces/ICommon';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
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
import { StyledButtonUpload } from 'components/common/Button/Button.styled';
import { hdoInstance } from 'apis/hdoInstance';
import { CloseButton } from 'components/common/Button/CloseButton';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>> | any;
  isEditOpen: boolean;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
  setNoticeId: Dispatch<SetStateAction<number | ''>>;
  NoticeId: number | '';
}

export const NoticeEdit = ({
  state,
  setState,
  isEditOpen,
  setIsEditOpen,
  setNoticeId,
  NoticeId,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [contentData, setContentData] = useState<string>('');
  const apiUrl = process.env.REACT_APP_API_URL;
  function handleCloseModal() {
    setIsEditOpen(false);
    setNoticeId('');
    setFileUrl('');
    form.resetFields();
  }
  const { loading, error, data, getData } = useGetDataWtTrigger<INotice>();

  useEffect(() => {
    // bannereventId를 받아오면 api 호출
    if (NoticeId !== '') {
      void getData({
        url: `/notice/${NoticeId}`,
      });
    }
  }, [NoticeId]);

  // api 호출 후 data를 받아오면 실행
  useEffect(() => {
    if (data !== null) {
      // console.log(data);
      // 모달 열림
      form.setFieldsValue({
        title: data?.title,
        content: data?.content,
        imageUrl: data?.imageUrl,
      });
      setIsEditOpen(true);
      setFileUrl(data?.imageUrl);
      setContentData(data?.content);
    }
  }, [data]);
  const handleDeleteImage = () => {
    setFileUrl('');
    const currentData = { ...form.getFieldsValue(), imageUrl: null };
    form.resetFields();
    form.setFieldsValue(currentData);
  };
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

  async function onFinish(values: any) {
    const newData = {
      content: values.content,
      title: values.title,
      imageUrl: values.imageUrl,
    };
    await putApi(
      {
        url: `/v1/notice/${NoticeId}`,
        data: newData,
      },
      setState,
    );
    handleCloseModal();
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
  const validateContent = async (_: any, value: any) => {
    const regExp = /<\/?[^>]+(>|$)/g;
    if (!regExp.test(value)) {
      return await Promise.reject(new Error('내용를 입력해주세요.'));
    }
    await Promise.resolve();
  };
  return (
    <Modal open={isEditOpen} title="공지사항" close={handleCloseModal}>
      <StyledForm
        form={form}
        name="noticeEdit"
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
              rules={[{ validator: validateContent }]}
              required
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
                      alt="이미지 첨부"
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
  );
};
