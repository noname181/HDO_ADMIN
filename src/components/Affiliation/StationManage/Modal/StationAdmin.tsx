import { useState } from 'react';

import { DefaultDiv } from 'styles/style';

import StationAdminGrid from './StationAdminGrid';
import StationAdminWaitGrid from './StationAdminWaitGrid';

const StationAdmin = ({ stationData, isModalOpen }: any) => {
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  return (
    <DefaultDiv>
      <StationAdminGrid
        stationData={stationData}
        state={state}
        setState={setState}
      />
      <StationAdminWaitGrid
        stationData={stationData}
        state={state}
        setState={setState}
        isModalOpen={isModalOpen}
      />
    </DefaultDiv>
  );
};

export default StationAdmin;
