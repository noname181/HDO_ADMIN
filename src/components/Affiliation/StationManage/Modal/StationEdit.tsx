import { createContext, useState } from 'react';

import { Modal } from 'components/common/Modal/Modal';

import Tabs from 'components/common/Tab/Tabs';

import StationInfo from './StationInfo';
import StationAdmin from './StationAdmin';
import { type OrganizationInterface } from 'interfaces/ICommon';

// interface StationEditModalContextType {
//   stationData: OrganizationInterface | '';
//   setStationData: React.Dispatch<
//     React.SetStateAction<OrganizationInterface | ''>
//   >;
// }

// const StationContextState: StationEditModalContextType = {
//   stationData: '',
//   setStationData: () => {},
// };

const StationEdit = ({
  state,
  setState,
  isModalOpen,
  setIsModalOpen,
  stationData,
  setStationData,
}: any) => {
  // const StationContext = createContext(StationContextState);

  function handleCloseModal() {
    setStationData('');
    setIsModalOpen(false);
  }

  return (
    <Modal open={isModalOpen} title="사업장 정보" close={handleCloseModal}>
      {/* <StationContext.Provider value={{ stationData, setStationData }}> */}
      <Tabs defaultValue="1">
        <Tabs.List>
          <Tabs.Trigger value="1" text="기본 정보" />
          {/* <Tabs.Trigger value="2" text="관리자 계정" /> */}
        </Tabs.List>
        <Tabs.Content>
          <Tabs.Panel value="1">
            <StationInfo
              state={state}
              setState={setState}
              stationData={stationData}
              setIsModalOpen={setIsModalOpen}
              handleCloseModal={handleCloseModal}
              isModalOpen={isModalOpen}
            />
          </Tabs.Panel>
          {/* <Tabs.Panel value="2">
            <StationAdmin stationData={stationData} isModalOpen={isModalOpen} />
          </Tabs.Panel> */}
        </Tabs.Content>
      </Tabs>
      {/* </StationContext.Provider> */}
    </Modal>
  );
};

export default StationEdit;
