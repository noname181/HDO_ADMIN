import { useState, useEffect, useRef } from 'react';

// 패키지
import { Form, Switch, Upload, notification } from 'antd';

// api
// import { defaultUrl } from 'apis/api.helpers';
import { StyledButtonUpload } from 'components/common/Button/Button.styled';
// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
} from 'components/common/test/Styled.ant';

import { Button } from 'components/common/Button/Button';
import { postApi, postApiUpdate } from 'apis/postApi';
// import { alertModalState } from 'recoil/modalState';
// import { useRecoilState } from 'recoil';
import { hdoInstance } from 'apis/hdoInstance';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { Spinner } from 'styles/style';

const ChargerModelFWRegister = ({
  chargerModelData,
  state,
  setState,
  fwLastVer,
  setfwLastVer,
}: any) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [isLoadingFile, setILoadingFile] = useState<boolean>(false);
  const [errorFile, setErrorFile] = useState<null | string>(null);
  // const [fileList, setFileList] = useState<any>([]);
  const [fileUrl, setFileUrl] = useState('');
  const [isChecked, setIsChecked] = useState(true);
  const updateFileRef = useRef<HTMLInputElement>(null);

  function handleOpenModal() {
    setIsModalOpen(true);
    setFileUrl('');
    // console.log(fwLastVer);
    form.setFieldValue('fwVer', fwLastVer.toFixed(1));
  }

  const handleCloseModal = () => {
    form.resetFields();
    // setFileList([]);
    setErrorFile(null);
    setIsModalOpen(false);
  };

  const handleOk = () => {
    if (!fileUrl) {
      setErrorFile('파일을 입력하세요.');
    }
    form
      .validateFields()
      .then((values: any) => {
        void onFinish(values);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const onFinish = async (values: any) => {
    if (!fileUrl) {
      return;
    }
    const FirmwareData = {
      modelId: chargerModelData?.id || null,
      fwVer: parseFloat(values.fwVer).toFixed(1) || 0.1,
      fwFileUrl: fileUrl,
      fwFileName:
        values.fwFileName || (fileUrl ? extractFileNameFromURL(fileUrl) : null),
      isLast: isChecked,
    };
    // console.log('values-', FirmwareData, JSON.stringify(FirmwareData));

    await postApi(
      {
        url: `/model-firmware`,
        data: FirmwareData,
      },
      setState,
    );
  };

  // const onChange = (value: any) => {
  //   setFileList(value.fileList);
  // };

  const onChangeChecked = (value: any) => {
    setIsChecked(value);
  };

  function getCurrentDateTime() {
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day}.${hours}.${minutes}`;
  }

  function extractFileNameFromURL(url: string) {
    const urlParts = url.split('/');
    const lastPathSegment = urlParts[urlParts.length - 1];

    // URL에서 쿼리 문자열 제거
    const queryStringIndex = lastPathSegment.indexOf('?');
    const cleanPathSegment =
      queryStringIndex !== -1
        ? lastPathSegment.substring(0, queryStringIndex)
        : lastPathSegment;

    return cleanPathSegment;
  }
  const handleUpload: any = async (event: any) => {
    if (event.target.files.length === 0) {
      return;
    }
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) {
      return;
    }
    setILoadingFile(true);
    const file = event.target.files[0];
    // const fileExt = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
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
        timeout: 3600000,
      })
      .then((res: any) => {
        const url = res?.data?.result?.id;
        setFileUrl(url);
        setErrorFile(null);
        // setAlertModal({
        //   ...alertModal,
        //   open: true,
        //   type: 'success',
        //   title: '알림',
        //   content: '완료되었습니다.',
        // });
        setILoadingFile(false);
      })
      .catch((err) => {
        const errorMessage = err.response ? err.response.data.message : 'Error';
        setState({
          isLoading: false,
          isSuccess: false,
          error: err?.response?.data?.message || errorMessage,
        });
        console.log(err);
        setILoadingFile(false);
      });
  };
  // const handleUpload: any = async (options: any) => {
  //   const { onSuccess, onError, file, onProgress, category } = options;

  //   const fmData = new FormData();
  //   fmData.append('file', file);
  //   try {
  //     const accessToken = localStorage.getItem('accessToken') ?? '';

  //     if (accessToken) {
  //       const axios = hdoInstance();
  //       axios
  //         .post(`/uploads`, fmData, {
  //           headers: {
  //             Authorization: accessToken,
  //             'Content-Type': 'multipart/form-data',
  //           },
  //         })
  //         .then((res: any) => {
  //           setFileUrl(res?.data?.result?.url);
  //           onSuccess('ok', 'res');
  //           setErrorFile(null);
  //           // setState({ isLoading: false, error: null, isSuccess: true });
  //         })
  //         .catch((err) => {
  //           onError({ err });
  //           const errorMessage = err.response
  //             ? err.response.data.message
  //             : 'Error';
  //           setState({
  //             isLoading: false,
  //             isSuccess: false,
  //             error: err?.response?.data?.message || errorMessage,
  //           });
  //           console.log('error-', err?.response?.data?.message);
  //         });
  //     } else {
  //       setState({
  //         isLoading: false,
  //         isSuccess: false,
  //         error: 'token이 유효하지 않습니다.',
  //       });

  //       window.location.replace('/');
  //     }
  //   } catch (err) {
  //     console.log('Error: ', err);
  //     // const error = new Error('Some error');
  //     onError({ err });
  //   }
  // };

  useEffect(() => {
    if (state.isSuccess) {
      handleCloseModal();
    }
  }, [state]);

  return (
    <>
      <Button onClick={handleOpenModal}>신규등록</Button>
      <Modal title="F/W 등록" open={isModalOpen} close={handleCloseModal}>
        <StyledForm
          form={form}
          name="AddFWModal"
          colon={false}
          gridcol="1fr 1fr 1fr 1fr"
        >
          <StyledFormItem
            name="fwVer"
            label="FW 버전"
            rules={[
              {
                required: true,
                message: 'FW 버전을 입력해주세요.',
              },
            ]}
            style={{ minHeight: 80 }}
          >
            <StyledInput type="number" step="0.1" placeholder="FW 버전 입력" />
          </StyledFormItem>
          <StyledFormItem
            name="isLast"
            label="최신버전"
            style={{ minHeight: 80 }}
          >
            <Switch onChange={onChangeChecked} defaultChecked={true} />
          </StyledFormItem>

          <StyledFormItem
            name="file"
            label="파일"
            customfile="Y"
            style={{ minHeight: 80, gridColumn: '3 / span 2' }}
          >
            <div>
              <div style={{ display: 'flex' }}>
                <input
                  type="file"
                  ref={updateFileRef}
                  style={{ display: 'none' }}
                  onChange={handleUpload}
                />
                <StyledButtonUpload
                  size="md"
                  color="reset"
                  onClick={() => {
                    if (updateFileRef.current) {
                      updateFileRef.current.click();
                    }
                  }}
                  disabled={isLoadingFile}
                >
                  파일 선택
                  {isLoadingFile && <Spinner size="small" />}
                </StyledButtonUpload>
              </div>
              <div className="nl-filename">
                {fileUrl?.split('/').pop() ?? ''}
              </div>
              <div style={{ color: 'var(--red)' }}>{errorFile}</div>
            </div>
          </StyledFormItem>
          {/* <StyledFormItem
            name="fwFileUrl"
            label="FW 파일"
            type="upload"
            style={{ gridColumn: '1 / span 3' }}
            rules={[
              {
                required: true,
                message: '파일을 업로드해주세요.',
              },
            ]}
          >
            <Upload
              maxCount={1}
              onRemove={() => {
                setFileList([]);
              }}
              fileList={fileList}
              openFileDialogOnClick={fileList.length === 0}
              name={'file'}
              customRequest={uploadFile}
              onChange={onChange}
            >
              <Button color="reset" disabled={fileList.length > 0}>
                파일 선택
              </Button>
            </Upload>
          </StyledFormItem> */}
        </StyledForm>
        <ModalFooter
          okText="등록"
          closeText="취소"
          close={handleCloseModal}
          onOk={handleOk}
        />
      </Modal>
    </>
  );
};

export default ChargerModelFWRegister;
