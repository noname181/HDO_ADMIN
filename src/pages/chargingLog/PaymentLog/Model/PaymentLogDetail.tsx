import { useState, useEffect } from 'react';
// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
import { DefaultDiv } from 'styles/style';

const PaymentLogDetail = ({ itemId, setItemId }: any) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  function handleCloseModal() {
    setIsModalOpen(false);
    setItemId('');
  }
  const { loading, error, data, getDetail } = useGetDataWtTrigger<any>();

  useEffect(() => {
    if (itemId !== '') {
      void getDetail({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/v1/admin/logs/payments/${itemId}`,
      });
      setIsModalOpen(true);
    }
  }, [itemId]);

  // useEffect(() => {
  //   if (data) {
  //     // 모달 열림
  //     setIsModalOpen(true);
  //   }
  // }, [data]);

  return (
    <Modal open={isModalOpen} title="결제로그 내용" close={handleCloseModal}>
      <DefaultDiv style={{ paddingBottom: 20 }}>
        <table className="nl-table-detail">
          <tbody>
            <tr>
              <th>Url</th>
              <td>{data?.url}</td>
            </tr>
            <tr>
              <th>Content</th>
              <td style={{ height: 421 }}>
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    maxHeight: '400px',
                    overflowY: 'auto',
                  }}
                >
                  {JSON.stringify(data?.content, null, 2)}
                </div>
              </td>
            </tr>
            <tr>
              <th>회원</th>
              <td>{data?.user?.accountId}</td>
            </tr>
            <tr>
              <th>이름</th>
              <td>{data?.user?.name}</td>
            </tr>
            <tr>
              <th>생성일</th>
              <td>{data?.createdAt}</td>
            </tr>
          </tbody>
        </table>
      </DefaultDiv>
      <ModalFooter
        okText="수정"
        closeText="취소"
        close={handleCloseModal}
        isOk={false}
      />
    </Modal>
  );
};

export default PaymentLogDetail;
