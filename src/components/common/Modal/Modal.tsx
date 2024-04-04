import { useEffect, useRef } from 'react';

import { Button } from 'components/common/Button/Button';
import { CloseButton } from 'components/common/Button/CloseButton';

import {
  type ModalProps,
  type ModalFooterProps,
  type ModalHeaderProps,
  type ModalWrapProps,
  type ModalFooterStationProps,
  type ModalFooterChargerProps,
} from 'interfaces/common/IModal';

import {
  StyledFormItem,
  StyledRadio,
  StyledRadioBtn,
  StyledForm,
  StyledFormCharger,
} from 'components/common/test/Styled.ant';
import { Form } from 'antd';
import {
  ModalBody,
  ModalContainer,
  ModalContent,
  ModalFooterWrap,
  ModalFooterChargerWrap,
  ModalHeaderWrap,
  ModalTitle,
} from './Modal.styled';
import { TabHeader } from '../Tab/Tab.styled';

export const Modal = ({
  open,
  title,
  close,
  children,
  style,
  button,
  buttonClick,
}: ModalProps) => {
  // 모달 바깥 쪽 클릭 시 창 닫힘 기능 & Esc키 클릭 시 창 닫힘 기능
  // const modalRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       modalRef.current &&
  //       !modalRef.current.contains(event.target as Node)
  //     ) {
  //       close();
  //     }
  //   };

  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     if (event.key === 'Escape') {
  //       close();
  //     }
  //   };

  //   if (open) {
  //     document.addEventListener('mousedown', handleClickOutside);
  //     document.addEventListener('keydown', handleKeyDown);
  //   } else {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //     document.removeEventListener('keydown', handleKeyDown);
  //   }

  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //     document.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, [close, open]);

  return (
    <ModalContainer open={open}>
      <div style={style}>
        <ModalContent
        // ref={modalRef}
        >
          <ModalHeader
            title={title}
            close={close}
            buttonText={button}
            buttonClick={buttonClick}
          />
          <ModalBody>{children}</ModalBody>
          {/* <ModalFooter close={close} onSave={handleSave} /> */}
        </ModalContent>
      </div>
    </ModalContainer>
  );
};

export const ModalWrap = ({ open, children }: ModalWrapProps) => {
  return (
    <ModalContainer open={open}>
      <div>
        <ModalContent>{children}</ModalContent>
      </div>
    </ModalContainer>
  );
};

export const ModalHeader = ({
  title,
  close,
  buttonText,
  buttonClick,
}: ModalHeaderProps) => {
  return (
    <ModalHeaderWrap>
      <ModalTitle>{title}</ModalTitle>
      {buttonText && (
        <Button size="md" color="primary" margin="10px" onClick={buttonClick}>
          {buttonText}
        </Button>
      )}
      {close && <CloseButton onClick={close} />}
    </ModalHeaderWrap>
  );
};

export const ModalFooter = ({
  close,
  closeText = '취소',
  onOk,
  okText = '저장',
  onDelete,
  isOk = true,
}: ModalFooterProps) => {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onDelete) {
      onDelete(e);
    }
  };
  return (
    <ModalFooterWrap>
      <Button size="md" color="reset" onClick={close}>
        {closeText}
      </Button>
      {onDelete && (
        <Button
          size="md"
          icon="/assets/img/icon/icon-trash.png"
          color="reset"
          onClick={handleDelete}
        />
      )}
      {isOk && (
        <Button size="md" color="primary" onClick={onOk}>
          {okText}
        </Button>
      )}
    </ModalFooterWrap>
  );
};

export const ModalFooterStationChager = ({
  close,
  closeText = '취소',
  onOk,
  okText = '저장',
  onDelete,
  updateChgUseYn,
  data,
  isOk = true,
}: ModalFooterStationProps) => {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onDelete) {
      onDelete(e);
    }
  };

  const [form] = Form.useForm();

  useEffect(() => {
    // console.log(data);
    if (data !== null) {
      // 모달 열림
      form.setFieldsValue({
        chg_use_yn: data,
      });
    }
  }, [data]);

  return (
    <ModalFooterChargerWrap>
      <div style={{ display: 'flex', gap: 10, width: 265 }}></div>
      <div style={{ display: 'flex', gap: 10, margin: 'auto' }}>
        <div style={{ width: '110px' }}>
          <Button size="md" color="reset" onClick={close} w100={true}>
            {closeText}
          </Button>
        </div>
        {isOk && (
          <div
            style={{
              width: '110px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button size="md" color="primary" onClick={onOk} w100={true}>
              {okText}
            </Button>
          </div>
        )}
      </div>
      <div>
        <StyledFormCharger form={form}>
          <div style={{ width: '265px' }}>
            <StyledFormItem name="chg_use_yn" label="사용여부">
              <StyledRadio buttonStyle="solid" disabled={!isOk}>
                <StyledRadioBtn
                  value="Y"
                  onChange={() => {
                    updateChgUseYn('Y');
                  }}
                >
                  사용
                </StyledRadioBtn>
                <StyledRadioBtn
                  value="N"
                  onClick={() => {
                    updateChgUseYn('N');
                  }}
                >
                  미사용
                </StyledRadioBtn>
              </StyledRadio>
            </StyledFormItem>
          </div>
        </StyledFormCharger>
      </div>
    </ModalFooterChargerWrap>
  );
};

export const ModalFooterCharger = ({
  close,
  closeText = '취소',
  onOk,
  okText = '저장',
  onDelete,
  updateTypeSoft,
  updateTypeHard,
  updateChgUseYn,
  data,
}: ModalFooterChargerProps) => {
  const [form] = Form.useForm();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onDelete) {
      onDelete(e);
    }
  };

  useEffect(() => {
    // console.log(data);
    if (data !== null) {
      // 모달 열림
      form.setFieldsValue({
        chg_use_yn: data,
      });
    }
  }, [data]);

  return (
    <ModalFooterChargerWrap>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ width: '110px' }}>
          <Button
            size="md"
            color="primary"
            onClick={updateTypeSoft}
            w100={true}
          >
            소프트리셋
          </Button>
        </div>
        <div style={{ width: '110px' }}>
          <Button
            size="md"
            color="primary"
            onClick={updateTypeHard}
            w100={true}
          >
            하드리셋
          </Button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, margin: 'auto' }}>
        <div style={{ width: '110px' }}>
          <Button size="md" color="reset" onClick={close} w100={true}>
            {closeText}
          </Button>
        </div>
        <div style={{ width: '110px' }}>
          <Button size="md" color="primary" onClick={onOk} w100={true}>
            {okText}
          </Button>
        </div>
      </div>
      <div>
        <StyledFormCharger form={form}>
          <div style={{ width: '265px' }}>
            <StyledFormItem name="chg_use_yn" label="사용여부">
              <StyledRadio buttonStyle="solid">
                {/* {data === 'Y' ? (
                  <StyledRadioBtn value="Y">사용</StyledRadioBtn>
                ) : (
                  <StyledRadioBtn value="Y" onClick={updateChgUseYn}>
                    사용
                  </StyledRadioBtn>
                )}

                {data === 'N' ? (
                  <StyledRadioBtn value="N">미사용</StyledRadioBtn>
                ) : (
                  <StyledRadioBtn value="N" onClick={updateChgUseYn}>
                    미사용
                  </StyledRadioBtn>
                )} */}
                <StyledRadioBtn
                  value="Y"
                  onChange={() => {
                    updateChgUseYn('Y');
                  }}
                >
                  사용
                </StyledRadioBtn>
                <StyledRadioBtn
                  value="N"
                  onClick={() => {
                    updateChgUseYn('N');
                  }}
                >
                  미사용
                </StyledRadioBtn>
              </StyledRadio>
            </StyledFormItem>
          </div>
        </StyledFormCharger>
      </div>
    </ModalFooterChargerWrap>
  );
};
