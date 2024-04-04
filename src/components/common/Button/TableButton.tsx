import { Label } from '../Form/Form';
import { Button } from './Button';
import { ButtonGroup, TableButtonWrap } from './Button.styled';
import { type TableButtonProps } from 'interfaces/common/IButton';

export const TableButton = ({
  isExcel = true,
  isInactive = true,
  isRegiter = true,
  label,
  excel,
  excelText = '엑셀 다운로드',
  inactive,
  inactiveText = '삭제',
  register,
  registerText = '등록',
  children,
}: TableButtonProps) => {
  return (
    <TableButtonWrap>
      <ButtonGroup>
        {isExcel ? (
          <Button
            label={label}
            size="md"
            color="reset"
            icon="/assets/img/icon/icon-excel.png"
            alt="엑셀"
            onClick={excel}
          >
            {excelText}
          </Button>
        ) : (
          <div></div>
        )}
        {/* <Label width={'none'}>{label}</Label> */}
        {children}
      </ButtonGroup>
      <ButtonGroup>
        {isInactive && inactive && (
          <Button
            size="md"
            color="reset"
            icon="/assets/img/icon/icon-trash.png"
            alt="비활성"
            onClick={inactive}
          >
            {inactiveText}
          </Button>
        )}
        {isRegiter && register && (
          <Button
            size="md"
            color="primary"
            icon="/assets/img/icon/icon-add-w.png"
            alt="등록"
            onClick={register}
          >
            {registerText}
          </Button>
        )}
      </ButtonGroup>
    </TableButtonWrap>
  );
};
