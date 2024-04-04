import { createContext, useState } from 'react';
import { TermsPolicy } from './TermsPolicy';
import { type OrganizationInterface } from 'interfaces/ICommon';
import { Tabs } from 'components/common/Tab/Tabs';

interface TermsPolicyContextType {
  TermsPolicyData: OrganizationInterface | '';
  setTermsPolicyData: React.Dispatch<
    React.SetStateAction<OrganizationInterface | ''>
  >;
}
const TermsPolicyContextState: TermsPolicyContextType = {
  TermsPolicyData: '',
  setTermsPolicyData: () => {},
};
export const TermsPolicyContext = createContext(TermsPolicyContextState);

export const TermsPolicyPage = () => {
  const [searchTermsPolicy, setsearchTermsPolicy] = useState<boolean>(false);
  const [titleInput, settitleInput] = useState('');
  const [cateSelected, setcateSelected] = useState('');
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="정책 및 약관" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <TermsPolicy
            search={searchTermsPolicy}
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
