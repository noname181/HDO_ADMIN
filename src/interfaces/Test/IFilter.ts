import { type Dispatch, type SetStateAction } from 'react';
import { filterInterface } from 'interfaces/ICharger';

export interface affFilterInterface extends filterInterface {
  closed: '' | boolean;
  category:
    | ''
    | 'DEF'
    | 'HDO'
    | 'STT_DIR'
    | 'STT_FRN'
    | 'CS'
    | 'AS'
    | 'BIZ'
    | 'ALLNC'
    | 'GRP';
  name: string;
  contactName: string;
  area?: '' | Number;
  branch?: '' | Number;
}

export interface affFilterInterfaceProps {
  queryState: affFilterInterface;
  setQueryState: Dispatch<SetStateAction<affFilterInterface>>;
}
