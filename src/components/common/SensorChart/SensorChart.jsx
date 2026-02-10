import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './SensorChart.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SensorChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="sensor-chart-container">
        <div className="no-data-text">Tidak ada data untuk ditampilkan</div>
      </div>
    );
  }

  const chartData = data.slice(0, 10).reverse();

  // Chart options configuration
  const getChartOptions = (label) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: {
            size: 13,
            weight: '500',
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'rectRounded',
          boxWidth: 15,
          boxHeight: 15,
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(26, 47, 71, 0.95)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#334155',
          borderDash: [4, 4],
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11,
          },
          maxRotation: 0,
          autoSkip: true,
        }
      },
      y: {
        grid: {
          color: '#334155',
          borderDash: [4, 4],
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11,
          },
          callback: function(value) {
            return value.toFixed(1);
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
        backgroundColor: '#1a2f47',
      }
    }
  });

  // Render chart with multiple datasets
  const renderMultiChart = (datasets, title) => {
    const labels = datasets[0].values.map((_, index) => 
      index === 0 ? 'Start' : index === datasets[0].values.length - 1 ? 'Latest' : ''
    );

    const chartDataset = {
      labels,
      datasets: datasets.map(dataset => ({
        label: dataset.label,
        data: dataset.values,
        borderColor: dataset.color,
        backgroundColor: dataset.color,
        borderWidth: 3,
        fill: false,
        pointBackgroundColor: dataset.color,
        pointBorderColor: '#1a2f47',
        pointHoverBackgroundColor: dataset.color,
        pointHoverBorderColor: '#fff',
      })),
    };

    return (
      <div className="chart-card">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-container">
          <Line data={chartDataset} options={getChartOptions(title)} />
        </div>
      </div>
    );
  };

  const temperatureValues = chartData.map((item) => parseFloat(item.temperature));
  const humidityValues = chartData.map((item) => parseFloat(item.humidity));
  const mq135Values = chartData.map((item) => parseFloat(item.mq135_ratio));
  const mq7Values = chartData.map((item) => parseFloat(item.mq7_ratio));

  return (
    <div className="sensor-chart-wrapper">
      {renderMultiChart([
        { label: 'Suhu (°C)', values: temperatureValues, color: '#ff6b6b' },
        { label: 'Kelembapan (%)', values: humidityValues, color: '#00b4d8' }
      ], "Data Suhu & Kelembapan")}
      
      {renderMultiChart([
        { label: 'Sensor Gas MQ-135 (PPM)', values: mq135Values, color: '#9b59b6' },
        { label: 'Sensor Gas MQ-7 (PPM)', values: mq7Values, color: '#e74c3c' }
      ], "Data Sensor Gas MQ-135 & MQ-7")}
    </div>
  );
}
