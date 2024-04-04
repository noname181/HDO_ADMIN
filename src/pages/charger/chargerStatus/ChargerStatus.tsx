// import Tab from 'components/common/Tab/Tab';
// import ChargerStatusAdmin from './chargerStatusAdmin/ChargerStatusAdmin';
// import ChargerStatusExternal from './chargerStatusExternal/ChargerStatusExternal';
// export const ChargerStatus = () => {
//   return (
//     <Tab
//       tabs={[
//         {
//           id: 'chargerStatusAdmin',
//           label: '충전기 현황',
//           content: <ChargerStatusAdmin />,
//         },
//         {
//           id: 'chargerStatusExternal',
//           label: '충전기 현황',
//           content: <ChargerStatusExternal />,
//         },
//       ]}
//     />
//   );
// };
import Tabs from 'components/common/Tab/Tabs';
import ChargerStatusAdmin from './chargerStatusAdmin/ChargerStatusAdmin';
import ChargerStatusExternal from './chargerStatusExternal/ChargerStatusExternal';

export const ChargerStatus = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="충전기 현황" />
        <Tabs.Trigger value="2" text="충전기 현황" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <ChargerStatusAdmin />
        </Tabs.Panel>
        <Tabs.Panel value="2">
          <ChargerStatusExternal />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
export default ChargerStatus;
