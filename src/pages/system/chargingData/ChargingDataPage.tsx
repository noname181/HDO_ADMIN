import Tab from 'components/common/Tab/Tab';
import ChargingData from './ChargingData';

const ChargingDataPage = () => {
  return (
    <Tab
      tabs={[
        {
          id: 'charging-data',
          label: '충전기 데이터 관리',
          content: <ChargingData />,
        },
      ]}
      hasAddButton={true}
    />
  );
};

export default ChargingDataPage;
