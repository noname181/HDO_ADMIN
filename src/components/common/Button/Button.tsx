import { type ButtonProps } from 'interfaces/common/IButton';
import { LabelWrap } from '../Form/Form';
import { ButtonIcon, ButtonSpinner, StyledButton } from './Button.styled';

export function Button({
  label,
  children,
  size = 'md',
  color = 'primary',
  margin,
  minWidth,
  w100 = false,
  disabled = false,
  onChange,
  onClick,
  icon,
  iconSize,
  alt,
  isSearch = false,
  isLoading = false,
  type,
}: ButtonProps) {
  return label ? (
    <LabelWrap label={label} requiredMark={false} width={'none'}>
      <StyledButton
        size={size}
        color={color}
        margin={margin}
        minWidth={minWidth}
        w100={w100}
        disabled={disabled}
        onChange={onChange}
        onClick={onClick}
        isSearch={isSearch}
      >
        {icon && <ButtonIcon src={icon} iconSize={iconSize} alt={alt} />}
        {isLoading ? <ButtonSpinner /> : children}
      </StyledButton>
    </LabelWrap>
  ) : (
    <StyledButton
      size={size}
      color={color}
      margin={margin}
      minWidth={minWidth}
      w100={w100}
      disabled={disabled}
      onChange={onChange}
      onClick={onClick}
      isSearch={isSearch}
      type={type}
    >
      {icon && <ButtonIcon src={icon} iconSize={iconSize} alt={alt} />}
      {isLoading ? <ButtonSpinner /> : children}
    </StyledButton>
  );
}
