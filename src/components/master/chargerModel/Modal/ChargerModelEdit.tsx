import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { Modal } from 'components/common/Modal/Modal';
import Tabs from 'components/common/Tab/Tabs';
import ChargerModelInfo from './ChargerModelInfo';
import ChargerModelFWGrid from './ChargerModelFWGrid';

const ChargerModelEdit = ({
  state,
  setState,
  chargerModelData,
  setChargerModelData,
  reload,
}: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setChargerModelData('');
    setIsModalOpen(false);
    // console.log(isModalOpen);
  };

  return (
    <Modal open={isModalOpen} title="충전기 모델 정보" close={handleCloseModal}>
      <Tabs defaultValue="1" isModalOpen={isModalOpen}>
        <Tabs.List>
          <Tabs.Trigger value="1" text="기본 정보" />
          <Tabs.Trigger value="2" text="F/W 관리" />
        </Tabs.List>
        <Tabs.Content>
          <Tabs.Panel value="1">
            <ChargerModelInfo
              state={state}
              setState={setState}
              chargerModelData={chargerModelData}
              setIsModalOpen={setIsModalOpen}
              handleCloseModal={handleCloseModal}
            />
          </Tabs.Panel>
          <Tabs.Panel value="2">
            <ChargerModelFWGrid
              chargerModelData={chargerModelData}
              setIsModalOpen={setIsModalOpen}
              reload={reload}
            />
          </Tabs.Panel>
        </Tabs.Content>
      </Tabs>
    </Modal>
  );
};

export default ChargerModelEdit;
