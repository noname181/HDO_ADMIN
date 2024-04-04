import Tabs from 'components/common/Tab/Tabs';
import React from 'react';

interface PopupProps {
  closePopup: () => void;
  data: any;
}

const TestPopupComponent: React.FC<PopupProps> = ({ closePopup, data }) => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List>
        <Tabs.Trigger value="1" text="기본 정보" />
        {/* <Tabs.Trigger value="2" text="관리자 계정" /> */}
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <div>
            <h2>작업 진행중</h2>
            <p>곧 OPEN 예정입니다.</p>
            <button onClick={closePopup}>닫기</button>
          </div>
        </Tabs.Panel>
        {/* <Tabs.Panel value="2">
            <StationAdmin stationData={stationData} isModalOpen={isModalOpen} />
          </Tabs.Panel> */}
      </Tabs.Content>
    </Tabs>
  );
};

export default TestPopupComponent;
export type TestPopupComponentType = React.ComponentType<PopupProps>;
