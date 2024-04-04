import { useState } from 'react';

import { DefaultDiv } from 'styles/style';

import ClientAdminGrid from 'components/Affiliation/ClientManage/Modal/ClientAdminGrid';
import ClientAdminWaitGrid from 'components/Affiliation/ClientManage/Modal/ClientAdminWaitGrid';

const ClientAdmin = ({ clientData, setIsModalOpen, isModalOpen }: any) => {
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  return (
    <DefaultDiv style={{ paddingBottom: 20 }}>
      <ClientAdminGrid
        clientData={clientData}
        state={state}
        setState={setState}
        setIsModalOpen={setIsModalOpen}
      />
      <ClientAdminWaitGrid
        clientData={clientData}
        state={state}
        setState={setState}
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
      />
    </DefaultDiv>
  );
};

export default ClientAdmin;
