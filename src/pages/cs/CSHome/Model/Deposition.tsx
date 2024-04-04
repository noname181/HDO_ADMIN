import { type Dispatch, type SetStateAction } from 'react';

// 스타일
import { Modal } from 'components/common/Modal/Modal';

interface ModalProps {
  isDepositionModalOpen: boolean;
  setIsDepositionModalOpen: Dispatch<SetStateAction<boolean>>;
  recordFile: string | null;
}

export const Deposition = ({
  isDepositionModalOpen,
  setIsDepositionModalOpen,
  recordFile,
}: ModalProps) => {
  function handleCloseModal() {
    setIsDepositionModalOpen(false);
  }

  if (!recordFile) recordFile = '';

  return (
    <>
      <Modal
        open={isDepositionModalOpen}
        title="녹취 플레이어"
        close={handleCloseModal}
        style={{ width: '540px', height: '600px' }}
      >
        <iframe
          title="myFrame"
          name="myFrame"
          id="myFrame"
          width="510"
          height="180"
          src={`https://ktapi-evnu.oilbank.co.kr:8100/api/v2/record-player/${recordFile}`}
        />
      </Modal>
    </>
  );
};
