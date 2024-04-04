import styled from 'styled-components';

interface CloseButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export const CloseButton = ({ onClick }: CloseButtonProps) => {
  return <StyledCloseButton onClick={onClick} />;
};

const StyledCloseButton = styled.button`
  background-image: url('/assets/img/icon/icon-x.png');
  background-size: 16px;
  background-repeat: no-repeat;
  background-color: transparent;
  background-position: center;
  opacity: 1;
  padding: 0.5rem 0.5rem;
  margin: -0.5rem -0.5rem -0.5rem auto;
  box-sizing: content-box;
  width: 1em;
  height: 1em;
  color: #000;
  border: 0;
  border-radius: 0.25rem;
  cursor: pointer;
  &:hover {
    background-image: url('/assets/img/icon/icon-x-blue.png');
  }
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }
`;
export const CustomCloseButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  // gap: 4px;
  border-radius: 6px;
  margin: 0;
  min-width: 40px;
  padding: 0 0 0 10px;
  height: 40px;
  font-weight: 500;
  font-size: 14px;
  line-height: 40px;
  color: var(--dark-default) !important;
  background-color: var(--white) !important;
  border: 1px solid var(--btn-gray-300) !important;
  button {
    background-size: 12px;
    width: 30px;
    height: 30px;
    margin: 0;
  }
`;
