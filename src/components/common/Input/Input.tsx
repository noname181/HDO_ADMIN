import {
  type ChangeEvent,
  type KeyboardEvent,
  useState,
  useEffect,
} from 'react';
import { LabelWrap } from 'components/common/Form/Form';
import { type InputValue, type InputProps } from 'interfaces/common/IInput';
import {
  ErrorMessage,
  InputWrap,
  ShowPasswordIcon,
  StyledInput,
} from './Input.styled';

export const Input = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  type = 'text',
  label,
  pattern,
  minLength,
  maxLength,
  isModal = false,
  isRequired = false,
  isVertical = false,
  isReadOnly = false,
  isDisabled = false,
  requiredMark = true,
  ...rest
}: InputProps) => {
  const [inputValue, setInputValue] = useState<InputValue>(value);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    validateInput(event.target.value);
    setInputValue(event.target.value);
    onChange?.(event);
  };

  const handleOnKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onKeyDown) {
      onKeyDown(event);
    }
  };

  const validateInput = (value: string) => {
    if (isRequired && value.trim() === '') {
      setError('필수 입력 항목입니다.');
    } else if (minLength && value.length < minLength) {
      setError(`Minimum length is ${minLength}.`);
    } else if (maxLength && value.length > maxLength) {
      setError(`Maximum length is ${maxLength}.`);
    } else if (pattern && !new RegExp(pattern).test(value)) {
      setError('Invalid input.');
    } else {
      setError(null);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <>
      {label ? (
        <LabelWrap
          label={label}
          isVertical={isVertical}
          isRequired={isRequired}
          requiredMark={requiredMark}
        >
          <InputWrap label={label} isVertical={isVertical}>
            <StyledInput
              type={type !== 'password' ? type : showPassword ? 'text' : type}
              value={inputValue}
              onChange={handleInputChange}
              placeholder={placeholder}
              hasError={error !== null}
              readOnly={isReadOnly}
              disabled={isDisabled}
              isModal={isModal}
              onKeyDown={handleOnKeyDown}
              {...rest}
            />
            {type === 'password' && (
              <ShowPasswordIcon
                showPassword={showPassword}
                onClick={toggleShowPassword}
                disabled={isDisabled}
              />
            )}
            {error !== null && <ErrorMessage>{error}</ErrorMessage>}
          </InputWrap>
        </LabelWrap>
      ) : (
        <>
          <StyledInput
            type={type !== 'password' ? type : showPassword ? 'text' : type}
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            hasError={error !== null}
            readOnly={isReadOnly}
            disabled={isDisabled}
            isModal={isModal}
            onKeyDown={handleOnKeyDown}
            {...rest}
          />
          {type === 'password' && (
            <ShowPasswordIcon
              showPassword={showPassword}
              onClick={toggleShowPassword}
              disabled={isDisabled}
            />
          )}
          {error !== null && <ErrorMessage>{error}</ErrorMessage>}
        </>
      )}
    </>
  );
};
