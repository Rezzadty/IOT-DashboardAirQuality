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

// Check if mobile
const isMobile = () => window.innerWidth <= 480;
const isTablet = () => window.innerWidth <= 768;

export default function SensorChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="sensor-chart-container">
        <div className="no-data-text">Tidak ada data untuk ditampilkan</div>
      </div>
    );
  }

  const chartData = data.slice(0, 10).reverse();

  // Responsive sizes
  const mobile = isMobile();
  const tablet = isTablet();
  const fontSize = mobile ? 9 : tablet ? 10 : 11;
  const legendFontSize = mobile ? 10 : tablet ? 11 : 13;
  const pointRadius = mobile ? 2 : tablet ? 2 : 3;
  const pointHoverRadius = mobile ? 3 : tablet ? 4 : 5;
  const borderWidth = mobile ? 1 : 2;

  // Chart options configuration
  const getChartOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: {
            size: legendFontSize,
            weight: '500',
          },
          padding: mobile ? 8 : tablet ? 10 : 15,
          usePointStyle: true,
          pointStyle: 'rectRounded',
          boxWidth: mobile ? 10 : tablet ? 12 : 15,
          boxHeight: mobile ? 10 : tablet ? 12 : 15,
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(12, 29, 51, 0.96)',
        padding: mobile ? 10 : tablet ? 12 : 16,
        titleColor: '#fff',
        titleFont: {
          size: mobile ? 11 : tablet ? 12 : 14,
          weight: 'bold',
        },
        bodyColor: '#e2e8f0',
        bodyFont: {
          size: mobile ? 10 : tablet ? 11 : 13,
        },
        bodySpacing: mobile ? 4 : 6,
        borderColor: 'rgba(148, 163, 184, 0.25)',
        borderWidth: 1,
        displayColors: true,
        boxWidth: mobile ? 8 : 10,
        boxHeight: mobile ? 8 : 10,
        usePointStyle: true,
        cornerRadius: mobile ? 6 : 8,
        caretSize: mobile ? 6 : 8,
        callbacks: {
          title: function(tooltipItems) {
            const index = tooltipItems[0].dataIndex;
            const totalPoints = tooltipItems[0].dataset.data.length;
            if (index === 0) return 'Data Terlama';
            if (index === totalPoints - 1) return 'Data Terbaru';
            return `Data ke-${totalPoints - index}`;
          },
          label: function(context) {
            return ` ${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.12)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(226, 232, 240, 0.55)',
          font: {
            size: fontSize,
          },
          maxRotation: 0,
          autoSkip: true,
        }
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.12)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(226, 232, 240, 0.55)',
          font: {
            size: fontSize,
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
        radius: pointRadius,
        hoverRadius: pointHoverRadius,
        borderWidth: mobile ? 1 : 2,
        backgroundColor: 'rgba(12, 29, 51, 0.9)',
        hitRadius: mobile ? 20 : 30,
        hoverBorderWidth: mobile ? 2 : 3,
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
        borderWidth: borderWidth,
        fill: false,
        pointBackgroundColor: dataset.color,
        pointBorderColor: '#1a2f47',
        pointHoverBackgroundColor: dataset.color,
        pointHoverBorderColor: '#fff',
        pointRadius: pointRadius,
        pointHoverRadius: pointHoverRadius,
        pointHitRadius: mobile ? 20 : 30,
        pointHoverBorderWidth: mobile ? 2 : 3,
      })),
    };

    return (
      <div className="chart-card">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-container">
          <Line data={chartDataset} options={getChartOptions()} />
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
        { label: 'Sensor Gas MQ-7 (PPM)', values: mq7Values, color: '#f39c12' }
      ], "Data Sensor Gas MQ-135 & MQ-7")}
    </div>
  );
}
