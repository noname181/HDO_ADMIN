import { createContext, useState } from 'react';
import Tab from 'components/common/Tab/Tab';
import { Faq } from './Faq';
import { type OrganizationInterface } from 'interfaces/ICommon';
import { Tabs } from 'components/common/Tab/Tabs';

interface FAQContextType {
  FAQData: OrganizationInterface | '';
  setFAQData: React.Dispatch<React.SetStateAction<OrganizationInterface | ''>>;
}

const FAQContextState: FAQContextType = {
  FAQData: '',
  setFAQData: () => {},
};
export const FAQContext = createContext(FAQContextState);
export const FaqPage = () => {
  const [searchFaq, setsearchFaq] = useState<boolean>(false);
  const [titleInput, settitleInput] = useState('');
  const [cateSelected, setcateSelected] = useState('');
  return (
    // <Tab
    //   onSearch={() => {
    //     setsearchFaq(!searchFaq);
    //   }}
    //   onClick={() => {
    //     settitleInput('');
    //     setcateSelected('');
    //     setsearchFaq(!searchFaq);
    //   }}
    //   tabs={[
    //     {
    //       id: 'faq',
    //       label: 'FAQ',
    //       content: (
    //         <Faq
    //           search={searchFaq}
    //           titleInput={titleInput}
    //           cateSelected={cateSelected}
    //           settitleInput={settitleInput}
    //           setcateSelected={setcateSelected}
    //         />
    //       ),
    //     },
    //   ]}
    // />
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="FAQ" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <Faq
            search={searchFaq}
            titleInput={titleInput}
            cateSelected={cateSelected}
            settitleInput={settitleInput}
            setcateSelected={setcateSelected}
          />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
