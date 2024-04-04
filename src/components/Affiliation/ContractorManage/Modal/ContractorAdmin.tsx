import { useState } from 'react';

import { DefaultDiv } from 'styles/style';
import ContractorAdminWaitGrid from './ContractorAdminWaitGrid';
import ContractorAdminGrid from './ContractorAdminGrid';

const ContractorAdmin = ({
  contractorData,
  setIsModalOpen,
  isModalOpen,
}: any) => {
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  return (
    <DefaultDiv style={{ paddingBottom: 20 }}>
      <ContractorAdminGrid
        contractorData={contractorData}
        state={state}
        setState={setState}
      />
      <ContractorAdminWaitGrid
        contractorData={contractorData}
        state={state}
        setState={setState}
        isModalOpen={isModalOpen}
      />
    </DefaultDiv>
  );
};

export default ContractorAdmin;
