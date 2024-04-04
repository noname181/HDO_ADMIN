import { useEffect } from 'react';
import { Box, BoxBody, BoxHead } from './styled';

export const CallsTable = ({ ktApiData, loading }: any) => {
  return (
    <div style={{ display: 'flex', gap: 20, width: '100%' }}>
      <Box isTop={true}>
        <BoxBody>
          <img src="assets/img/icon/call_blue.png" alt="연결시도" />
          <span className="text">연결시도</span>
          <span className="number">{ktApiData?.in_total_cnt || 0}</span>
        </BoxBody>
      </Box>
      <Box isTop={true}>
        <BoxBody>
          <img src="assets/img/icon/call_green.png" alt="응대호" />
          <span className="text">응대호</span>
          <span className="number">{ktApiData?.in_success_cnt || 0}</span>
        </BoxBody>
      </Box>
      <Box isTop={true}>
        <BoxBody>
          <img src="assets/img/icon/call_grey.png" alt="포기 호" />
          <span className="text">포기 호</span>
          <span className="number">{ktApiData?.give_up_cnt || 0}</span>
        </BoxBody>
      </Box>
      <Box isTop={true}>
        <BoxBody>
          <img src="assets/img/icon/call_yellow.png" alt="대기 콜" />
          <span className="text">대기 콜</span>
          <span className="number">0</span>
        </BoxBody>
      </Box>
    </div>
  );
};
export const CSCallsTable = ({ consultationData }: any) => {
  return (
    <>
      <div style={{ display: 'flex', gap: 20, width: '100%' }}>
        <Box>
          <BoxBody>
            <span className="text">상담 건수</span>
            <span className="number">{consultationData?.ALLCount || 0}</span>
          </BoxBody>
        </Box>
        <Box>
          <BoxBody>
            <span className="text">이용방법</span>
            <span className="number">{consultationData?.CHG || 0}</span>
          </BoxBody>
        </Box>
        <Box>
          <BoxBody>
            <span className="text">결제문의</span>
            <span className="number">{consultationData?.BRK || 0}</span>
          </BoxBody>
        </Box>
        <Box>
          <BoxBody>
            <span className="text">장애문의</span>
            <span className="number">{consultationData?.PAY || 0}</span>
          </BoxBody>
        </Box>
        <Box>
          <BoxBody>
            <span className="text">환불</span>
            <span className="number">{consultationData?.REG || 0}</span>
          </BoxBody>
        </Box>
        <Box>
          <BoxBody>
            <span className="text">단순 문의</span>
            <span className="number">{consultationData?.CAR || 0}</span>
          </BoxBody>
        </Box>
        <Box>
          <BoxBody>
            <span className="text">기타</span>
            <span className="number">{consultationData?.ETC || 0}</span>
          </BoxBody>
        </Box>
      </div>
    </>
  );
};
