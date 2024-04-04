import {
  Box,
  BoxBody,
  BoxHead,
  RateBar,
  RateContainer,
  RateFrame,
  RateProcess,
  ReteValue,
} from './styled';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);
const ChartResponseRate = ({ ktApiData }: any) => {
  return (
    <Box>
      <BoxHead>
        <span>응대율</span>
      </BoxHead>
      <BoxBody isHead={true} style={{ paddingTop: 0 }}>
        <RateFrame>
          <RateContainer>
            <RateBar value={ktApiData?.in_success_per}>
              <RateProcess>
                <ReteValue>
                  {ktApiData?.in_success_per || 0}
                  <span>%</span>
                </ReteValue>
              </RateProcess>
            </RateBar>
          </RateContainer>
        </RateFrame>
      </BoxBody>
    </Box>
  );
};
const ChartDailyCall = ({ timeData }: any) => {
  const [ringingCountsArray, setRingingCountsArray] = useState<number[]>([]);
  const [hangupCountsArray, setHangupCountsArray] = useState<number[]>([]);
  const [forgoneCallsArray, setForgoneCallsArray] = useState<number[]>([]);
  const [countSize, setCountSize] = useState<number>(100);
  useEffect(() => {
    if (timeData) {
      timeData = normalizeData(timeData);
    }
  }, []);

  useEffect(() => {
    setRingingCountsArray(
      timeData?.map((item: { ringingCount: string }) =>
        parseInt(item.ringingCount),
      ) || [],
    );

    setHangupCountsArray(
      timeData?.map((item: { hangupCount: string }) =>
        parseInt(item.hangupCount),
      ) || [],
    );

    if (ringingCountsArray && hangupCountsArray) {
      const calculatedForgoneCalls = ringingCountsArray?.map(
        (ringingCount, index) => {
          const hangupCount = hangupCountsArray[index] || 0; // hangupCountsArray가 짧을 경우를 대비해 기본값 0을 사용
          return ringingCount - hangupCount > 0
            ? ringingCount - hangupCount
            : 0;
        },
      );

      setForgoneCallsArray(calculatedForgoneCalls);
    }
  }, [timeData]);

  useEffect(() => {
    setCountSize(calculateMaxPlusTen);
  }, [forgoneCallsArray]);

  const calculateMaxPlusTen = () => {
    // 모든 배열을 하나로 결합합니다.
    const combinedArray = [
      ...ringingCountsArray,
      ...hangupCountsArray,
      ...forgoneCallsArray,
    ];

    const maxNumber = Math.max(...combinedArray);

    return maxNumber * 2;
  };

  const normalizeData = (data: any) => {
    for (let i = 0; i < data.length - 1; i++) {
      // 현재 ringingCount가 hangupCount보다 작다면 조정
      if (parseInt(data[i].ringingCount) < parseInt(data[i].hangupCount)) {
        // 현재 시간대의 ringingCount를 -1
        data[i].ringingCount = (parseInt(data[i].ringingCount) - 1).toString();
        // 다음 시간대의 ringingCount를 +1
        data[i + 1].ringingCount = (
          parseInt(data[i + 1].ringingCount) + 1
        ).toString();
      }
    }
    return data;
  };
  const timesArray = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#484848',
        cornerRadius: 6,
        borderColor: '#CDD0D3',
        borderWidth: 1,
        padding: 10,
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 16,
        },
        boxWidth: 12,
        boxHeight: 12,
        callbacks: {
          labelColor: function (context: any) {
            if (context.dataset.label === '연결시도') {
              return {
                borderColor: '#fff',
                backgroundColor: 'rgba(13, 138, 253, 0.6)',
                borderRadius: 5,
              };
            } else if (context.dataset.label === '응대수') {
              return {
                borderColor: '#fff',
                backgroundColor: 'rgba(0, 174, 66, 0.6)',
                borderRadius: 5,
              };
            } else {
              return {
                borderColor: '#fff',
                backgroundColor: 'rgba(148, 149, 150, 0.6)',
                borderRadius: 5,
              };
            }
          },
          labelTextColor: function (context: any) {
            return '#9C9C9C';
          },
          label: function (context: any) {
            var label = String(context.dataset.label) || '';

            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label +=
                new Intl.NumberFormat('ko-KR').format(context.parsed.y) + '호';
            }
            return label;
          },
          // title: function (context: any) {
          //   var label = daysArrayTitle[context[0].dataIndex] || '';
          //   return label;
          // },
        },
      },
    },
    // elements: {
    //   line: {
    //     borderWidth: 2,
    //   },
    //   point: {
    //     radius: 0,
    //     hitRadius: 8,
    //   },
    // },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        suggestedMax: countSize,
        suggestedMin: 0,
        ticks: {
          font: {
            size: 14,
          },
          beginAtZero: true,
        },
        border: {
          dash: [4, 4],
          color: 'transparent',
        },
        grid: {
          color: '#CDD0D3',
        },
      },
    },
  };
  const labels = timesArray;
  const data = {
    labels,
    datasets: [
      {
        label: '연결시도',
        data: ringingCountsArray,
        borderColor: 'rgba(13, 138, 253, 0.6)',
        backgroundColor: 'rgba(13, 138, 253, 0.6)',
        tension: 0.4,
      },
      {
        label: '응대수',
        data: hangupCountsArray,
        borderColor: 'rgba(0, 174, 66, 0.6)',
        backgroundColor: 'rgba(0, 174, 66, 0.6)',
        tension: 0.4,
      },
      {
        label: '포기호',
        data: forgoneCallsArray,
        borderColor: 'rgba(148, 149, 150, 0.6)',
        backgroundColor: 'rgba(148, 149, 150, 0.6)',
        tension: 0.4,
      },
    ],
  };
  return (
    <Box>
      <BoxHead style={{ textAlign: 'left' }}>
        <span>시간대별 통화건 수</span>
        <div className="nl-note">
          <div className="note-item">
            <div className="box one"></div>
            <span className="text">연결시도</span>
          </div>
          <div className="note-item">
            <div className="box two"></div>
            <span className="text">응대수</span>
          </div>
          <div className="note-item">
            <div className="box three"></div>
            <span className="text">포기호</span>
          </div>
        </div>
      </BoxHead>
      <BoxBody isHead={true} style={{ paddingBottom: 10 }}>
        <Bar
          options={options}
          data={data}
          style={{ height: '100%', width: '100%' }}
        />
      </BoxBody>
    </Box>
  );
};
export { ChartResponseRate, ChartDailyCall };
