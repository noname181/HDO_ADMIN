import { useState } from 'react';

import { Modal } from 'components/common/Modal/Modal';

import Tabs from 'components/common/Tab/Tabs';

import ContractorInfo from './ContractorInfo';
import ContractorAdmin from './ContractorAdmin';

const ContractorEdit = ({
  state,
  setState,
  contractorData,
  setContractorData,
  isModalOpen,
  setIsModalOpen,
}: any) => {
  // console.log(isModalOpen);
  function handleCloseModal() {
    setContractorData('');
    setIsModalOpen(false);
  }

  return (
    <>
      {isModalOpen && (
        <Modal open={isModalOpen} title="협력사 정보" close={handleCloseModal}>
          <Tabs defaultValue="1">
            <Tabs.List>
              <Tabs.Trigger value="1" text="기본 정보" />
              <Tabs.Trigger value="2" text="관리자 계정" />
            </Tabs.List>
            <Tabs.Content>
              <Tabs.Panel value="1">
                <ContractorInfo
                  state={state}
                  setState={setState}
                  contractorData={contractorData}
                  setIsModalOpen={setIsModalOpen}
                  handleCloseModal={handleCloseModal}
                />
              </Tabs.Panel>
              <Tabs.Panel value="2">
                <ContractorAdmin
                  contractorData={contractorData}
                  setIsModalOpen={setIsModalOpen}
                  isModalOpen={isModalOpen}
                />
              </Tabs.Panel>
            </Tabs.Content>
          </Tabs>
        </Modal>
      )}
    </>
  );
};

export default ContractorEdit;
