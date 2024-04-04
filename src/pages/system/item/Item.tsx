import React, { useState } from 'react';
import { Form } from 'antd';
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
import {
  StyledForm,
  StyledFormItem,
  StyledRadio,
  StyledRadioBtn,
} from 'components/common/test/Styled.ant';

export const Item = () => {
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
  const [checked11, setChecked11] = useState(false);
  const [checked12, setChecked12] = useState(false);
  const [checked13, setChecked13] = useState(false);
  const [checked14, setChecked14] = useState(false);
  const [checked15, setChecked15] = useState(false);
  const [checked16, setChecked16] = useState(false);
  const [checked17, setChecked17] = useState(false);
  const [checked18, setChecked18] = useState(false);
  const [checked19, setChecked19] = useState(false);
  const [checked20, setChecked20] = useState(false);
  const [checked21, setChecked21] = useState(false);
  const [checked22, setChecked22] = useState(false);
  const [checked23, setChecked23] = useState(false);
  const [checked24, setChecked24] = useState(false);
  const [form] = Form.useForm();

  return (
    <>
      <ItemContainer>
        <StyledForm
          form={form}
          name="charge-register"
          colon={false}
          type="modal"
          initialValues={{
            price: true,
            member: true,
          }}
        >
          <ItemBody>
            <ItemSide right="20px">
              <ItemForm paddingBottom="10px">
                <Title title="부문"></Title>
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
              <ItemForm paddingBottom="20px">
                <Title title="적용"></Title>
                <FormSelect>
                  <Checkbox checked={checked} onChange={setChecked}>
                    중부
                  </Checkbox>
                  <Checkbox checked={checked2} onChange={setChecked2}>
                    남부
                  </Checkbox>
                  <Effect operation={false}></Effect>
                </FormSelect>
              </ItemForm>

              <ItemForm paddingBottom="10px">
                <Title title="요금제"></Title>
                <InputBox placeholder="입력" width="calc(100% - 545px)" />
                <InputBox
                  placeholder="할인금액 입력"
                  width="140px"
                  margin="0 10px 0 10px"
                />
                <StyledFormItem name="price">
                  <StyledRadio>
                    <StyledRadioBtn value={true}>기본단가</StyledRadioBtn>
                    <StyledRadioBtn value={false}>환경부 단가</StyledRadioBtn>
                  </StyledRadio>
                </StyledFormItem>

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
              <ItemForm paddingBottom="20px">
                <Title title="적용"></Title>
                <FormSelect>
                  <Checkbox checked={checked3} onChange={setChecked3}>
                    기본단가
                  </Checkbox>
                  <Checkbox checked={checked4} onChange={setChecked4}>
                    일반회원단가 50원
                  </Checkbox>
                  <Checkbox checked={checked5} onChange={setChecked5}>
                    10원 할인
                  </Checkbox>
                  <Checkbox checked={checked6} onChange={setChecked6}>
                    20원 할인
                  </Checkbox>
                  <Checkbox checked={checked7} onChange={setChecked7}>
                    30원 할인
                  </Checkbox>
                  <Checkbox checked={checked8} onChange={setChecked8}>
                    카카오T할인 50원
                  </Checkbox>
                  <Checkbox checked={checked9} onChange={setChecked9}>
                    후불제
                  </Checkbox>
                  <Effect operation={false}></Effect>
                </FormSelect>
              </ItemForm>
              <ItemForm paddingBottom="10px">
                <Title title="충전기제조사"></Title>
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
              <ItemForm paddingBottom="20px">
                <Title title="적용"></Title>
                <FormSelect>
                  <Checkbox checked={checked10} onChange={setChecked10}>
                    클린일렉스
                  </Checkbox>
                  <Checkbox checked={checked11} onChange={setChecked11}>
                    기타
                  </Checkbox>
                  <Effect operation={false}></Effect>
                </FormSelect>
              </ItemForm>
              <ItemForm paddingBottom="10px">
                <Title title="인증방법"></Title>
                <InputBox
                  placeholder="입력"
                  margin="0 10px 0 0"
                  width="calc( 100% - 343px )"
                />
                <StyledFormItem name="member">
                  <StyledRadio>
                    <StyledRadioBtn value={true}>회원</StyledRadioBtn>
                    <StyledRadioBtn value={false}>비회원</StyledRadioBtn>
                  </StyledRadio>
                </StyledFormItem>
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
              <ItemForm paddingBottom="20px">
                <Title title="적용"></Title>
                <FormSelect>
                  <Checkbox checked={checked12} onChange={setChecked12}>
                    QR
                  </Checkbox>
                  <Checkbox checked={checked13} onChange={setChecked13}>
                    모바일 회원카드
                  </Checkbox>
                  <Checkbox checked={checked14} onChange={setChecked14}>
                    실물카드
                  </Checkbox>
                  <Checkbox checked={checked15} onChange={setChecked15}>
                    PnC
                  </Checkbox>
                  <Checkbox checked={checked16} onChange={setChecked16}>
                    신용카드
                  </Checkbox>
                  <Effect operation={false}></Effect>
                </FormSelect>
              </ItemForm>
              <ItemForm paddingBottom="10px">
                <Title title="제휴충전소"></Title>
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
              <ItemForm paddingBottom="20px">
                <Title title="적용"></Title>
                <FormSelect>
                  <Checkbox checked={checked17} onChange={setChecked17}>
                    카카오T
                  </Checkbox>
                  <Checkbox checked={checked18} onChange={setChecked18}>
                    기타
                  </Checkbox>
                  <Effect operation={false}></Effect>
                </FormSelect>
              </ItemForm>
            </ItemSide>
            <ItemSide>
              <ItemForm paddingBottom="10px">
                <Title title="지사"></Title>
                <InputBox placeholder="입력" disabled={true} />
                <Button
                  size="md"
                  color="reset"
                  icon="/assets/img/icon/icon_add_black.svg"
                  alt="추가"
                  margin="0 0 0 10px"
                  disabled={true}
                >
                  추가
                </Button>
              </ItemForm>
              <ItemForm paddingBottom="20px">
                <Title title="적용"></Title>
                <FormSelect disabled={true}>
                  <Checkbox checked={checked19} onChange={setChecked19}>
                    적용
                  </Checkbox>
                  <Checkbox checked={checked20} onChange={setChecked20}>
                    경기남부
                  </Checkbox>
                  <Checkbox checked={checked21} onChange={setChecked21}>
                    경기북부
                  </Checkbox>
                  <Checkbox checked={checked22} onChange={setChecked22}>
                    경기남부
                  </Checkbox>
                  <Checkbox checked={checked23} onChange={setChecked23}>
                    인천
                  </Checkbox>
                  <Checkbox checked={checked24} onChange={setChecked24}>
                    강원
                  </Checkbox>
                  <Effect operation={false}></Effect>
                </FormSelect>
              </ItemForm>
            </ItemSide>
          </ItemBody>
        </StyledForm>
      </ItemContainer>
    </>
  );
};
