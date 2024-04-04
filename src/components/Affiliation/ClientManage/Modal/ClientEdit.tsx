import { useState, useEffect } from 'react';

import { Modal } from 'components/common/Modal/Modal';

import Tabs from 'components/common/Tab/Tabs';

import ClientInfo from 'components/Affiliation/ClientManage/Modal/ClientInfo';
import ClientAdmin from 'components/Affiliation/ClientManage/Modal/ClientAdmin';
import ClientPaymentMethod from 'components/Affiliation/ClientManage/Modal/ClientPaymentMethod';

const ClientEdit = ({
  state,
  setState,
  clientData,
  setClientData,
  setShowPaymentManage,
}: any) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  function handleCloseModal() {
    setClientData('');
    setIsModalOpen(false);
  }
  useEffect(() => {
    if (clientData !== '') {
      // 모달 열림
      setIsModalOpen(true);
    }
  }, [clientData]);
  return (
    <>
      {isModalOpen && (
        <Modal open={isModalOpen} title="고객사 정보" close={handleCloseModal}>
          <Tabs defaultValue="1">
            <Tabs.List>
              <Tabs.Trigger value="1" text="기본 정보" />
              <Tabs.Trigger value="2" text="관리자 계정" />
              {clientData.category === 'BIZ' && (
                <Tabs.Trigger value="3" text="결제방법" />
              )}
            </Tabs.List>
            <Tabs.Content>
              <Tabs.Panel value="1">
                <ClientInfo
                  state={state}
                  setState={setState}
                  clientData={clientData}
                  setIsModalOpen={setIsModalOpen}
                  handleCloseModal={handleCloseModal}
                />
              </Tabs.Panel>
              <Tabs.Panel value="2">
                <ClientAdmin
                  clientData={clientData}
                  setIsModalOpen={setIsModalOpen}
                  isModalOpen={isModalOpen}
                />
              </Tabs.Panel>
              {clientData.category === 'BIZ' && (
                <Tabs.Panel value="3">
                  <ClientPaymentMethod
                    clientData={clientData}
                    setShowPaymentManage={setShowPaymentManage}
                  />
                </Tabs.Panel>
              )}
            </Tabs.Content>
          </Tabs>
        </Modal>
      )}
    </>
  );
};

export default ClientEdit;
