// import { type ModalType } from 'interfaces/common/IModal';
import { type AlertModalStateInterface } from 'interfaces/common/IModal';
import { atom } from 'recoil';

export const alertModalState2 = atom<AlertModalStateInterface>({
  key: 'alertModalState2',
  default: {
    open: false,
    type: 'alert',
    title: '알림',
    content: '',
    onCancel: null,
    onOk: null,
    cancelText: '취소',
    okText: '확인',
    isOk: true,
  },
});
