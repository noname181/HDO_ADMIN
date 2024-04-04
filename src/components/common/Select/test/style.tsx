export const selectStyles = {
  input: (baseStyles: any) => ({
    ...baseStyles,
    padding: '0',
    margin: '0',
  }),
  control: (baseStyles: any, state: any) => ({
    ...baseStyles,
    boxShadow: 'none',
    display: 'flex',
    border: state.isFocused
      ? '1px solid var(--blue-200)'
      : '1px solid var(--btn-gray-300)',
    borderRadius: '4px',
    color: 'var(--dark-default)',
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '34px',
    cursor: 'pointer',
    zIndex: '1',
    '&:hover': {
      borderColor: 'var(--blue-200)',
    },
  }),
  menu: (baseStyles: any) => ({
    ...baseStyles,
    position: 'absolute',
    top: '38px',
    left: '0',
    right: '0',
    zIndex: '99',
    filter: 'drop-shadow(1px 1px 4px rgba(0,0,0,0.15))',
    borderRadius: '6px',
    overflow: 'hidden',
    display: 'block',
  }),
  menuList: (baseStyles: any) => ({
    ...baseStyles,
    color: 'var(--dark-default)',
    cursor: 'pointer',
    backgroundColor: 'var(--white)',
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '40px',
    padding: '0',
  }),
  container: (baseStyles: any) => ({
    ...baseStyles,
    width: '100%',
    maxWidth: '240px',
    position: 'relative',
  }),
  valueContainer: (baseStyles: any) => ({
    ...baseStyles,
    width: '0',
  }),
  placeholder: (baseStyles: any) => ({
    ...baseStyles,
    color: 'var(--dark-default)',
  }),
  indicatorSeparator: (baseStyles: any) => ({
    ...baseStyles,
    width: '0',
    '&::after': {
      position: 'absolute',
      content: '""',
      top: '0',
      right: '0',
      width: '40px',
      height: '40px',
      backgroundImage: 'url(/assets/img/icon/icon-arrow-up-rounded-d.png)',
      backgroundSize: '20px',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      transform: 'rotate(0deg)',
      pointerEvents: 'none',
    },
  }),
  dropdownIndicator: (baseStyles: any) => ({
    ...baseStyles,
    display: 'none',
  }),
  option: (baseStyles: any) => ({
    ...baseStyles,
    color: 'var(--dark-default)',
    padding: '0 10px',
    cursor: 'pointer',
    backgroundColor: 'var(--white)',
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '40px',
    '&:hover': {
      backgroundColor: 'var(--btn-gray-100)',
    },
    '&:active': {
      color: 'var(--blue-200)',
      backgroundImage: 'url(/assets/img/icon/icon-option-check.png)',
      backgroundSize: '18px',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center right 10px',
    },
  }),
};