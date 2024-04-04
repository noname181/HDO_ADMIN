import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
  useRef,
} from 'react';
import { Button } from 'components/common/Button/Button';

import { Form, Select, Switch, notification } from 'antd';

import { Modal, ModalFooter } from 'components/common/Modal/Modal';

import { defaultUrl } from 'apis/api.helpers';

import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { type StateInterface, type IUploadFile } from 'interfaces/ICommon';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
import axios from 'axios';
import { hdoInstance } from 'apis/hdoInstance';
import { StyledButtonUpload } from 'components/common/Button/Button.styled';
import { putApi } from 'apis/putApi';
import { Spinner } from 'styles/style';
// import { error } from 'console';
interface EditModelProps {
  isOpen: boolean;
  id: number | null;
}
interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
  editModelState: EditModelProps;
  setEditModelState: Dispatch<SetStateAction<EditModelProps>>;
  setCheckRowId: any;
}

const UpdateFileEdit = ({
  state,
  setState,
  editModelState,
  setEditModelState,
  setCheckRowId,
}: ModalProps) => {
  const [form] = Form.useForm();
  const updateFileRef = useRef<HTMLInputElement>(null);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [isLoadingFile, setILoadingFile] = useState<boolean>(false);
  // const [fileList, setFileList] = useState<any>([]);
  const [fileUrl, setFileUrl] = useState('');
  const [errorFile, setErrorFile] = useState<null | string>(null);
  const { loading, error, data, getData } = useGetDataWtTrigger<IUploadFile>();
  const [isChecked, setIsChecked] = useState<boolean | undefined>(false);

  useEffect(() => {
    // bannereventId를 받아오면 api 호출
    if (editModelState.id && editModelState.isOpen) {
      void getData({
        url: `/file-to-update/${editModelState.id}`,
      });
    }
  }, [editModelState.id, editModelState.isOpen]);
  // api 호출 후 data를 받아오면 실행
  useEffect(() => {
    if (data !== null) {
      form.setFieldsValue({
        division: data?.division,
        version: data?.version,
        // newestVersion: data?.newestVersion,
      });
      setFileUrl(data?.fileURL);
      setIsChecked(data?.newestVersion ?? false);
    }
  }, [data]);
  function handleCloseModal() {
    setEditModelState({
      isOpen: false,
      id: null,
    });
    setFileUrl('');
    form.resetFields();
    setErrorFile(null);
  }

  const allowedExtensions = [
    '.zip',
    '.txt',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.bmp',
    '.tiff',
    '.tif',
    '.raw',
    '.svg',
    '.webp',
    '.heif',
    '.heic',
    '.ico',
  ];
  const isKoreanText = (text: string): boolean => {
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    return koreanRegex.test(text);
  };
  // const onChange = (value: any) => {
  //   setFileList(value.fileList);
  // };

  // function getCurrentDateTime() {
  //   const now = new Date();
  //   const year = String(now.getFullYear()).slice(-2);
  //   const month = String(now.getMonth() + 1).padStart(2, '0');
  //   const day = String(now.getDate()).padStart(2, '0');
  //   const hours = String(now.getHours()).padStart(2, '0');
  //   const minutes = String(now.getMinutes()).padStart(2, '0');

  //   return `${year}.${month}.${day}.${hours}.${minutes}`;
  // }

  // const uploadFile: any = async (options: any) => {
  //   const { onSuccess, onError, file, onProgress, category } = options;
  //   const fileExt = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  //   if (!allowedExtensions.includes(fileExt)) {
  //     setAlertModal((prev) => ({
  //       ...prev,
  //       type: 'error',
  //       open: true,
  //       content:
  //         '이 파일 확장자는 허용되지 않습니다. .zip 또는 .txt 파일만 업로드할 수 있습니다.',
  //     }));
  //     setFileList([]);
  //     form.setFieldValue('file', null);
  //     return false;
  //   }

  //   const fmData = new FormData();
  //   fmData.append('file', file);
  //   try {
  //     const accessToken = localStorage.getItem('accessToken') ?? '';

  //     if (accessToken) {
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

  async function onFinish(values: any) {
    // console.log(values);
    if (!fileUrl) {
      return;
    }
    const fileExt = fileUrl?.slice(fileUrl?.lastIndexOf('.')).toLowerCase();
    // console.log(fileExt);
    if (values.division === 'AD' && fileExt !== '.zip') {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: 'Error',
        content:
          '약관은 .txt 파일, 광고 압축은 1.mp4 ~ 5.mp4 를 압축한 .zip로 업로드 하세요.',
      });

      return;
    }
    if (values.division === 'TM' && fileExt !== '.txt') {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: 'Error',
        content:
          '약관은 .txt 파일, 광고 압축은 1.mp4 ~ 5.mp4 를 압축한 .zip로 업로드 하세요.',
      });
      return;
    }
    const newData = {
      division: values.division,
      version: parseFloat(values.version).toFixed(1),
      fileURL: fileUrl,
      newestVersion: values.newestVersion ?? data?.newestVersion,
    };

    await putApi(
      {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/file-to-update/${editModelState.id}`,
        data: newData,
      },
      setState,
      // (error) => {
      //   if (error) {
      //     setAlertModal({
      //       ...alertModal,
      //       open: true,
      //       type: 'error',
      //       title: '업데이트 할 수 없습니다.' ?? 'api 호출 에러 : 콘솔창 확인',
      //       content: error?.message ?? 'api 호출 에러 : 콘솔창 확인',
      //     });
      //     setIsChecked(true);
      //     form.setFieldsValue({
      //       newestVersion: true,
      //     });
      //   }
      // },
    );
  }

  function handleOk() {
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
  }

  useEffect(() => {
    // 등록 완료
    if (state.isSuccess) {
      handleCloseModal();
      setCheckRowId([]);
    }
  }, [state]);
  const handleUpload: any = async (event: any) => {
    if (!event?.target?.files) {
      return;
    }
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) {
      return;
    }
    const file = event?.target?.files[0];
    const fileExt = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    const fileName = file?.name.split('.')[0];
    if (isKoreanText(fileName as string)) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        content: '한국어로된 파일명은 업로드 할수 없습니다.',
      });
      return;
    }
    if (!allowedExtensions.includes(fileExt)) {
      setAlertModal((prev) => ({
        ...prev,
        type: 'error',
        open: true,
        content:
          '이 파일 확장자는 허용되지 않습니다. .zip 또는 .txt 파일만 업로드할 수 있습니다.',
      }));
      // setFileList([]);
      form.setFieldValue('file', null);
      return false;
    }
    setILoadingFile(true);

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
        setILoadingFile(false);
        const errorMessage = err.response
          ? err?.response?.data?.message
          : 'Error';
        setState({
          isLoading: false,
          isSuccess: false,
          error: err?.response?.data?.message || errorMessage,
        });
        console.log(err);
      });
  };
  const onChangeChecked = (value: any) => {
    setIsChecked(value);
  };
  return (
    <>
      {editModelState.isOpen && (
        <Modal
          title="파일 추가"
          open={editModelState.isOpen}
          close={handleCloseModal}
        >
          <StyledForm
            gridcol="1fr 1fr"
            form={form}
            name="update-file-edit"
            colon={false}
          >
            <StyledFormItem
              name="division"
              label="카테고리"
              rules={[
                {
                  required: true,
                  message: '업데이트할 카테고리를 선택해주세요.',
                },
              ]}
            >
              <StyledSelect placeholder="구분">
                <Select.Option value="AD">광고</Select.Option>
                <Select.Option value="TM">약관</Select.Option>
              </StyledSelect>
            </StyledFormItem>
            <StyledFormItem
              name="version"
              label="버전"
              rules={[
                {
                  required: true,
                  message: '버전을 입력하세요.',
                },
                {
                  pattern: /^([+,0-9.]+)/,
                  message: '0보다 큰 숫자를 입력해야합니다.',
                },
              ]}
            >
              <StyledInput
                placeholder="버전"
                type="number"
                step="0.1"
                onChange={(event) => {
                  if (
                    event.target.value.length >= 2 &&
                    parseFloat(event.target.value) <= 0 &&
                    (event.target.value[1] !== '.' ||
                      (event.target.value[0] === '0' &&
                        event.target.value[1] === '.' &&
                        event.target.value[2] === '0')) &&
                    event.target.value[0] !== '-'
                  ) {
                    const text = event.target.value.replaceAll('0', '');
                    const currentData = {
                      ...form.getFieldsValue(),
                      version: text.replaceAll('.', ''),
                    };
                    form.resetFields();
                    form.setFieldsValue(currentData);
                  }
                }}
              />
            </StyledFormItem>

            <StyledFormItem name="file" label="파일" customfile="Y">
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
            <StyledFormItem name="newestVersion" label="전송버전">
              <Switch onChange={onChangeChecked} checked={isChecked} />
            </StyledFormItem>
            <div>
              * 광고파일은 mp4파일만 넣어서 zip파일로 등록해주세요. mp4파일의
              광고는{' '}
              <span style={{ color: 'var(--red)' }}>
                초당24Frame 이하에 1080*960 사이즈만 가능합니다.
              </span>
            </div>
          </StyledForm>

          <ModalFooter onOk={handleOk} close={handleCloseModal} />
        </Modal>
      )}
    </>
  );
};

export default UpdateFileEdit;
