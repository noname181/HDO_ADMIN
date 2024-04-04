import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { hdoInstance } from 'apis/hdoInstance';
import React, { useEffect, useRef } from 'react';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
interface DataItem {
  day: string;
  totalPayment: number;
}
function extractDayFromDate(dateString: string): string {
  const parts = dateString?.split('-');

  const day = parts[2];

  return day;
}

function DashChartTotalPaymentThisMonth({
  dataChart,
}: {
  dataChart: DataItem[];
}) {
  const daysArray: string[] = dataChart?.map((item) =>
    extractDayFromDate(item.day),
  );
  const daysArrayTitle: string[] = dataChart?.map((item) => item.day);

  const totalKwhArray: number[] = dataChart?.map((item) => item.totalPayment);
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
            return {
              borderColor: '#fff',
              backgroundColor: '#00AE42',
              borderRadius: 5,
            };
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
                new Intl.NumberFormat('ko-KR').format(context.parsed.y) + '원';
            }
            return label;
          },
          title: function (context: any) {
            var label = daysArrayTitle[context[0].dataIndex] || '';
            return label;
          },
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 0,
        hitRadius: 8,
      },
    },
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
        suggestedMax: 800,
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
  const labels = daysArray;
  const data = {
    labels,
    datasets: [
      {
        label: '',
        data: totalKwhArray,
        borderColor: '#00AE42',
        backgroundColor: '#00AE42',
        tension: 0.4,
      },
    ],
  };
  return (
    <Line
      options={options}
      data={data}
      style={{ height: '160px', width: '100%' }}
    />
  );
}

export default DashChartTotalPaymentThisMonth;
