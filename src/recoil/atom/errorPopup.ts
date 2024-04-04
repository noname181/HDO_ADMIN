import { atom } from 'recoil';

export const popupModal = atom({
  key: 'popupModal',
  default: {
    alert: {
      idx: 0,
      name: '알림',
      desc: "The biggest risk is not taking any risk. In a world that's changing really quickly, the only strategy that is guaranteed to fail is not taking risks.",
    },
    error: {
      idx: 1,
      name: '오류 / 에러',
      desc: "The biggest risk is not taking any risk. In a world that's changing really quickly, the only strategy that is guaranteed to fail is not taking risks.",
    },
    warning: {
      idx: 2,
      name: '성공 / 실행',
      desc: "The biggest risk is not taking any risk. In a world that's changing really quickly, the only strategy that is guaranteed to fail is not taking risks.",
    },
    success: {
      idx: 3,
      name: '성공 / 실행',
      desc: "The biggest risk is not taking any risk. In a world that's changing really quickly, the only strategy that is guaranteed to fail is not taking risks.",
    },
    info: {
      idx: 4,
      name: '정보 / 활성',
      desc: "The biggest risk is not taking any risk. In a world that's changing really quickly, the only strategy that is guaranteed to fail is not taking risks.",
    },
  },
});
