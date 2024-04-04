import PropTypes from 'prop-types';
// AUIGrid 엑셀, PDF 바로 다운로딩 처리 모듈
import FileSaver from 'file-saver';
// AUIGrid PDF 처리 모듈
import type AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import { Button } from 'components/common/Button/Button';
interface IProps {
  myGrid: any;
  xlsxProps: any;
  excelText?: string;
  label?: string;
}

declare global {
  interface Window {
    saveAs: any;
  }
}

// FileSaver 전역처리화
window.saveAs = FileSaver.saveAs;

const ExportGridDataView = (props: IProps) => {
  // 엑셀로 내보내기
  const exportClick = () => {
    const grid = props.myGrid.current as AUIGrid;

    // 내보내기 실행
    grid.exportToXlsx({ ...props.xlsxProps, progressBar: true });
  };

  return (
    <Button
      label={props.label}
      size="md"
      color="reset"
      icon="/assets/img/icon/icon-excel.png"
      alt="엑셀"
      onClick={exportClick}
    >
      {props.excelText}
    </Button>
  );
};

ExportGridDataView.propTypes = {
  myGrid: PropTypes.object.isRequired,
  xlsxProps: PropTypes.object,
  excelText: PropTypes.string,
  label: PropTypes.string,
};

ExportGridDataView.defaultProps = {
  xlsxProps: {},
  excelText: '엑셀 다운로드',
  label: '엑셀 다운로드',
};

export default ExportGridDataView;
