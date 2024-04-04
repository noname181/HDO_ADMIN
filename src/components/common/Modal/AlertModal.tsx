import {
  useRecoilState,
  // useResetRecoilState
} from 'recoil';
import { alertModalState } from 'recoil/modalState';

import { CloseButton } from 'components/common/Button/CloseButton';
import { Button } from 'components/common/Button/Button';

import { type AlertModalType } from 'interfaces/common/IModal';
import { type ButtonProps } from 'interfaces/common/IButton';

import {
  AlertModalContainer,
  AlertModalContent,
  AlertModalFooter,
  AlertModalHeader,
  AlertModalHeaderTitle,
  AlertModalIcon,
  AlertModalWrap,
} from './Modal.styled';

export const AlertModal = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  // const resetAlertModal = useResetRecoilState(alertModalState);
  const getAlertModalTypeFromButtonColor = (
    type: AlertModalType,
  ): ButtonProps['color'] => {
    switch (type) {
      case 'alert':
        return 'primary';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'info':
        return 'secondary';
    }
  };
  return (
    <>
      {alertModal.open && (
        <AlertModalContainer open={alertModal.open}>
          <AlertModalWrap>
            <AlertModalHeader>
              <AlertModalIcon type={alertModal.type ?? 'alert'} />
              <AlertModalHeaderTitle>{alertModal.title}</AlertModalHeaderTitle>
              <CloseButton
                onClick={() => {
                  if (alertModal.onCancel) {
                    alertModal.onCancel();
                  }
                  setAlertModal({
                    ...alertModal,
                    isOk: true,
                    open: false,
                  });
                }}
              />
            </AlertModalHeader>
            <AlertModalContent>
              {/* {typeof alertModal.content === 'object' ? (
                <pre>{JSON.stringify(alertModal.content, null, 2)}</pre>
              ) : (
                alertModal.content
              )} */}
              {alertModal.content}
            </AlertModalContent>
            <AlertModalFooter
              style={{
                justifyContent:
                  alertModal.type === 'alert' && !alertModal.isOk
                    ? 'center'
                    : 'flex-end',
              }}
            >
              {alertModal.type === 'alert' && (
                <Button
                  color="reset"
                  onClick={() => {
                    if (alertModal.onCancel) {
                      alertModal.onCancel();
                    }
                    setAlertModal({
                      ...alertModal,
                      isOk: true,
                      open: false,
                    });
                  }}
                >
                  {alertModal.cancelText}
                </Button>
              )}
              {alertModal.isOk && (
                <Button
                  color={getAlertModalTypeFromButtonColor(
                    alertModal.type ?? 'alert',
                  )}
                  onClick={
                    alertModal.onOk ??
                    (() => {
                      setAlertModal({
                        ...alertModal,
                        isOk: true,
                        open: false,
                      });
                      // resetAlertModal();
                    })
                  }
                >
                  {alertModal.okText}
                </Button>
              )}
            </AlertModalFooter>
          </AlertModalWrap>
        </AlertModalContainer>
      )}
    </>
  );
};
