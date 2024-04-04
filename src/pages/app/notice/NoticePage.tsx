import { createContext, useState } from 'react';
import Tab from 'components/common/Tab/Tab';
import { Notice } from './Notice';
import { Tabs } from 'components/common/Tab/Tabs';
import { Faq } from '../faq/Faq';
import { BannerEvent } from '../banner-event/BannerEvent';

export const NoticePage = () => {
  // const [searchNotice, setsearchNotice] = useState<boolean>(false);
  // const [titleInput, settitleInput] = useState('');
  const [searchFaq, setsearchFaq] = useState<boolean>(false);
  const [titleInput, settitleInput] = useState('');
  const [cateSelected, setcateSelected] = useState('');
  return (
    // <Tab
    //   onSearch={() => {
    //     setsearchNotice(!searchNotice);
    //   }}
    //   onClick={() => {
    //     settitleInput('');
    //     setsearchNotice(!searchNotice);
    //   }}
    //   tabs={[
    //     {
    //       id: 'notice',
    //       label: '공지사항',
    //       content: (
    //         <Notice
    //           search={searchNotice}
    //           settitleInput={settitleInput}
    //           titleInput={titleInput}
    //         />
    //       ),
    //     },
    //   ]}
    // />
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="공지사항" />
        {/* <Tabs.Trigger value="2" text="FAQ" />
        <Tabs.Trigger value="3" text="배너/이벤트" /> */}
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <Notice />
        </Tabs.Panel>
        {/* <Tabs.Panel value="2">
          <Faq
            search={searchFaq}
            titleInput={titleInput}
            cateSelected={cateSelected}
            settitleInput={settitleInput}
            setcateSelected={setcateSelected}
          />
        </Tabs.Panel>
        <Tabs.Panel value="3">
          <BannerEvent />
        </Tabs.Panel> */}
      </Tabs.Content>
    </Tabs>
  );
};
