import React, { useState } from 'react';
import { Button } from 'components/common/Button/Button';
import { Checkbox } from 'components/common/Checkbox/Checkbox';
import {
  ItemContainer,
  ItemBody,
  ItemSide,
  ItemForm,
  Title,
  InputBox,
  FormSelect,
  Effect,
} from './styled';

export const Charger = () => {
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [checked4, setChecked4] = useState(false);
  const [checked5, setChecked5] = useState(false);
  const [checked6, setChecked6] = useState(false);
  const [checked7, setChecked7] = useState(false);
  const [checked8, setChecked8] = useState(false);
  const [checked9, setChecked9] = useState(false);
  const [checked10, setChecked10] = useState(false);

  const handleCheckboxClick = () => {
    setChecked(!checked); // Toggle the state (true to false or false to true)
  };
  return (
    <>
      <ItemContainer>
        <ItemBody>
          <ItemSide right="20px">
            <ItemForm paddingBottom="20px">
              <Title title="충전기제조사"></Title>
              <FormSelect minHeight="56px">
                <Checkbox checked={checked} onChange={setChecked}>
                  클린일렉스
                </Checkbox>
                <Checkbox checked={checked2} onChange={setChecked2}>
                  기타
                </Checkbox>
                <Effect operation={true}></Effect>
              </FormSelect>
            </ItemForm>
            <ItemForm paddingBottom="10px">
              <Title title="충전기모델"></Title>
              <InputBox placeholder="입력" width="calc( 100% - 50px )" />
              <Button
                size="md"
                color="reset"
                icon="/assets/img/icon/icon_add_black.svg"
                alt="추가"
                margin="0 0 0 10px"
                minWidth="unset"
              >
                추가
              </Button>
            </ItemForm>
            <ItemForm>
              <Title title="적용"></Title>
              <FormSelect readonly={true}>
                <Checkbox checked={checked3} onChange={setChecked3}>
                  AB123
                </Checkbox>
                <Checkbox checked={checked4} onChange={setChecked4}>
                  CD123
                </Checkbox>
                <Checkbox checked={checked5} onChange={setChecked5}>
                  EF123
                </Checkbox>
                <Checkbox checked={checked6} onChange={setChecked6}>
                  XX123
                </Checkbox>
                <Effect operation={true}></Effect>
              </FormSelect>
            </ItemForm>
          </ItemSide>
          <ItemSide>
            <ItemForm paddingBottom="10px" paddingTop="80px">
              <Title title="충전기속도"></Title>
              <InputBox placeholder="입력" />
              <Button
                size="md"
                color="reset"
                icon="/assets/img/icon/icon_add_black.svg"
                alt="추가"
                margin="0 0 0 10px"
              >
                추가
              </Button>
            </ItemForm>
            <ItemForm>
              <Title title="적용"></Title>
              <FormSelect>
                <Checkbox checked={checked7} onChange={setChecked7}>
                  200kWh
                </Checkbox>
                <Checkbox checked={checked8} onChange={setChecked8}>
                  150kWh
                </Checkbox>
                <Checkbox checked={checked9} onChange={setChecked9}>
                  100kWh
                </Checkbox>
                <Checkbox checked={checked10} onChange={setChecked10}>
                  50kWh
                </Checkbox>
                <Effect operation={false}></Effect>
              </FormSelect>
            </ItemForm>
          </ItemSide>
        </ItemBody>
      </ItemContainer>
    </>
  );
};
