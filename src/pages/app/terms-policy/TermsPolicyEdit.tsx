import { type Dispatch, type SetStateAction, useState, useEffect } from 'react';
import { Form, Select } from 'antd';
import { postApiUpdate } from 'apis/postApi';
import { putApi } from 'apis/putApi';
import { defaultUrl } from 'apis/api.helpers';
// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledTextArea,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { type TermsPolicyInterface } from 'interfaces/ITermsPolicy';
import { type StateInterface } from 'interfaces/ICommon';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { TermsModel } from 'utils/stationUtils';

interface ModalProps {
  state: StateInterface;
  setState: (param: any) => void;
  isModalOpen: boolean;
  setIsModalOpen: (param: any) => void;
  setTermsPolicyId: Dispatch<SetStateAction<number | ''>>;
  TermsPolicyId: number | '';
}

export const TermsPolicyEdit = ({
  state,
  setState,
  isModalOpen,
  setIsModalOpen,
  setTermsPolicyId,
  TermsPolicyId,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  // const { loadingTermsList, TermsModelList } = TermsModel();
  const [termChilds, setTermChilds] = useState<any>();
  const [content, setContent] = useState<string>('');
  const [contentData, setContentData] = useState<string>('');
  const [showSaveButton, setShowSaveButton] = useState<boolean>(true);

  function handleCloseModal() {
    setIsModalOpen(false);
    setTermsPolicyId('');
    setShowSaveButton(true);
    setContent('');
    setContentData('');
    form.resetFields();
  }
  const { loading, error, data, getData } =
    useGetDataWtTrigger<TermsPolicyInterface>();

  useEffect(() => {
    // bannereventId를 받아오면 api 호출
    if (TermsPolicyId !== '') {
      void getData({
        url: `/terms/${TermsPolicyId}`,
      });
    }
  }, [TermsPolicyId]);

  // api 호출 후 data를 받아오면 실행
  useEffect(() => {
    // console.log(data?.childs);

    const childTerms2 =
      data?.childs.length > 0
        ? data?.childs?.map((item: any, index: any) => item?.id)
        : '';
    // const childTermsContent =
    //   data?.childs.length > 0
    //     ? data?.childs?.map((item: any, index: any) => item?.content)
    //     : '';
    // const lastElement: string | undefined =
    //   childTermsContent.length > 0
    //     ? childTermsContent[childTermsContent.length - 1]
    //     : undefined;

    if (data !== null) {
      form.setFieldsValue({
        title: data?.title,
        // content: lastElement,
        category:
          data?.childs?.length > 0
            ? data?.childs[data?.childs.length - 1].category
            : '',
        parentId: childTerms2 ? Math.max(...childTerms2) : '',
      });
      setTermChilds(data?.childs);
      setContentData(
        data?.childs?.length > 0
          ? data?.childs[data?.childs.length - 1].content
          : '',
      );

      setIsModalOpen(true);
    }
  }, [data]);

  async function onFinish(values: any) {
    // console.log(values);
    const newData = {
      category: values.category,
      title: values.title,
      content: content,
      parentId: data?.id,
    };
    await putApi(
      {
        url: `/terms/${TermsPolicyId}`,
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
        console.log(error);
      });
  }
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
  const validateContent = async (_: any, value: any) => {
    const regExp = /<\/?[^>]+(>|$)/g;
    if (!regExp.test(value)) {
      return await Promise.reject(new Error('내용를 입력해주세요.'));
    }
    await Promise.resolve();
  };
  return (
    <>
      {isModalOpen && (
        <Modal open={isModalOpen} title="정책 및 약관" close={handleCloseModal}>
          <StyledForm
            form={form}
            name="termsPolicyEditData"
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
                <StyledFormItem name="parentId" label="히스토리">
                  <StyledSelect
                    onChange={(e, option: any) => {
                      // console.log(option);
                      const contentSelect = option?.content;
                      setContentData(contentSelect);
                      const childTerms2 =
                        data?.childs.length > 0
                          ? data?.childs?.map(
                              (item: any, index: any) => item?.id,
                            )
                          : '';
                      const mainId = Math.max(...childTerms2);
                      if (mainId !== option?.value) {
                        setShowSaveButton(false);
                      } else {
                        setShowSaveButton(true);
                      }
                    }}
                  >
                    {termChilds?.map((item: any) => {
                      const dateString = item?.version;
                      const dateTimeParts = dateString?.split('T'); // Split the date and time parts
                      const datePart: string = dateTimeParts?.[0];
                      const timePart: string = dateTimeParts?.[1].split('+')[0]; // Remove the timezone offset

                      const formattedDate = `${datePart} ${timePart}`;

                      return (
                        <Select.Option
                          key={item.id}
                          value={item?.id}
                          content={item?.content}
                        >
                          {item?.title} ( {formattedDate} )
                        </Select.Option>
                      );
                    })}
                  </StyledSelect>
                </StyledFormItem>
              </li>
              <li>
                <StyledFormItem
                  name="category"
                  label="카테고리"
                  rules={[
                    {
                      required: true,
                      message: '카테고리를 입력해주세요.',
                    },
                  ]}
                >
                  <StyledSelect disabled>
                    <Select.Option value="필수약관">필수약관</Select.Option>
                    <Select.Option value="선택약관">선택약관</Select.Option>
                    <Select.Option value="카드약관">카드약관</Select.Option>
                    <Select.Option value="결제약관">결제약관</Select.Option>
                  </StyledSelect>
                </StyledFormItem>
              </li>
              <li>
                <StyledFormItem name="title" label="제목">
                  <StyledInput readOnly />
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
                    height="400px"
                    setContents={contentData}
                    // readOnly={true}

                    onChange={(content) => {
                      const regex = /(<([^>]+)>)/gi;
                      const hasText = !!content.replace(regex, '').length;
                      if (hasText) {
                        form.setFieldValue('content', content);
                        setContent(content);
                      } else {
                        form.setFieldValue('content', null);
                        setContent('');
                      }
                    }}
                    setOptions={{
                      historyStackDelayTime: 0,
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
            </ul>
          </StyledForm>
          <ModalFooter
            okText="저장"
            closeText="취소"
            close={handleCloseModal}
            onOk={handleOk}
            isOk={showSaveButton}
          />
        </Modal>
      )}
    </>
  );
};
