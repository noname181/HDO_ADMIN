import styled from 'styled-components';

interface LabelWrapTestProps {
  label: string;
  children: React.ReactNode;
}

const LabelForm = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
  position: relative;
`;

const Label = styled.label`
  color: var(--dark-default);
  font-weight: 500;
  font-size: 14px;
  line-height: 40px;
  margin-bottom: 0;
  width: 140px;
`;

export const LabelWrapTest = ({ label, children }: LabelWrapTestProps) => {
  return (
    <LabelForm>
      <Label>{label}</Label>
      {children}
    </LabelForm>
  );
};
