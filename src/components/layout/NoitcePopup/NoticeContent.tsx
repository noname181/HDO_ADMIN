import { hdoInstance } from 'apis/hdoInstance';
import { ListFile, NoticeBoard, TitleBoard } from './styled';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import styled from 'styled-components';
interface INotice {
  data: any;
  key: number;
}
export const NoticeContent = ({ data, key }: INotice) => {
  // Alert 모달
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const isKoreanText = (text: string): boolean => {
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    return koreanRegex.test(text);
  };
  const downloadFile = (fileURL: string) => {
    if (!fileURL || fileURL === '') {
      setAlertModal((prev) => ({
        ...prev,
        open: true,
        content: '다운로드할 파일이 없습니다.',
      }));
      return;
    }
    // window.location.href = fileURL;
    const axios = hdoInstance();
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) {
      return;
    }
    const url = fileURL;
    const spFileName = url.split('/').pop();
    if (isKoreanText(spFileName as string)) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        content: '한글파일명은 지원하지 않습니다.',
      });
      return;
    }
    axios
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`/download-file?path=upload/${spFileName}`, {
        responseType: 'blob',
        timeout: 7200000,
      })
      .then((response) => {
        const blob = new Blob([response?.data]);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.target = '_blank';
        link.download = spFileName ?? '충전기 전송파일 관리';
        link.click();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <NoticeBoard>
      <table key={key} className="nl-table-detail" style={{ width: '100%' }}>
        <tbody>
          <tr>
            <th>제목</th>
            <td>
              <TitleBoard style={{ overflowWrap: 'break-word' }}>
                {data?.title}
              </TitleBoard>
            </td>
          </tr>
          <tr style={{ height: 285 }}>
            <th>내용</th>
            <td>
              <div dangerouslySetInnerHTML={{ __html: data?.contents }} />
              {/* <pre></pre> */}
            </td>
          </tr>
          <tr style={{ height: 85 }}>
            <th>첨부파일</th>
            <td>
              <ListFile>
                {data?.imagesUrl?.map((item: any, index: any) => {
                  return (
                    <div
                      key={index}
                      className="nl-filename"
                      onClick={() => {
                        downloadFile(item?.id);
                      }}
                      style={{
                        color: '#184bf3',
                        textDecoration: 'underline',
                      }}
                    >
                      {item?.id}
                    </div>
                  );
                })}
              </ListFile>
            </td>
          </tr>
        </tbody>
      </table>
    </NoticeBoard>
  );
};
