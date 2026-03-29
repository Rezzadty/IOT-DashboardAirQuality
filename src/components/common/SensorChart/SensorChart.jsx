import { useEffect, useMemo, useState } from 'react';
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

const endValueLabelsPlugin = {
  id: 'endValueLabels',
  afterDatasetsDraw(chart, _args, pluginOptions) {
    if (!pluginOptions?.enabled) return;

    const { ctx, chartArea } = chart;
    if (!ctx || !chartArea) return;

    const datasets = chart.data?.datasets ?? [];
    const formatter = pluginOptions.formatter;
    const fontSize = pluginOptions.fontSize ?? 11;
    const paddingX = pluginOptions.paddingX ?? 8;
    const paddingY = pluginOptions.paddingY ?? 6;

    ctx.save();
    ctx.font = `600 ${fontSize}px system-ui, -apple-system, Segoe UI, Roboto, Arial`;
    ctx.textBaseline = 'middle';

    datasets.forEach((ds, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (!meta || meta.hidden) return;

      const dataArr = ds.data ?? [];
      if (!Array.isArray(dataArr) || dataArr.length === 0) return;

      let lastIndex = dataArr.length - 1;
      while (lastIndex >= 0 && !Number.isFinite(Number(dataArr[lastIndex]))) lastIndex -= 1;
      if (lastIndex < 0) return;

      const element = meta.data?.[lastIndex];
      if (!element) return;

      const x = element.x;
      const y = element.y;
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;

      const rawValue = Number(dataArr[lastIndex]);
      const labelText = typeof formatter === 'function'
        ? formatter({ dataset: ds, value: rawValue })
        : `${ds.label}: ${rawValue}`;

      // Keep label within chart area
      const textWidth = ctx.measureText(labelText).width;
      const targetX = Math.min(chartArea.right - textWidth - paddingX, x + paddingX);
      const targetY = Math.max(chartArea.top + paddingY, Math.min(chartArea.bottom - paddingY, y));

      ctx.fillStyle = pluginOptions.textColor ?? 'rgba(226, 232, 240, 0.9)';
      ctx.strokeStyle = pluginOptions.strokeColor ?? 'rgba(12, 29, 51, 0.9)';
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.strokeText(labelText, targetX, targetY);

      const color = ds.borderColor || ds.backgroundColor;
      ctx.fillStyle = pluginOptions.useDatasetColor ? (color || ctx.fillStyle) : ctx.fillStyle;
      ctx.fillText(labelText, targetX, targetY);
    });

    ctx.restore();
  },
};

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  endValueLabelsPlugin
);

const clampFinite = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const getSuggestedRange = (values, { paddingRatio = 0.08, minPadding = 1 } = {}) => {
  const finite = values.map((v) => clampFinite(v, NaN)).filter(Number.isFinite);
  if (finite.length === 0) return {};

  const min = Math.min(...finite);
  const max = Math.max(...finite);
  const span = Math.max(0, max - min);
  const padding = Math.max(minPadding, span * paddingRatio);

  // If the series is almost flat, padding helps show variation.
  if (span === 0) {
    return {
      suggestedMin: min - padding,
      suggestedMax: max + padding,
    };
  }

  return {
    suggestedMin: min - padding,
    suggestedMax: max + padding,
  };
};

export default function SensorChart({ data }) {
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="sensor-chart-container">
        <div className="no-data-text">Tidak ada data untuk ditampilkan</div>
      </div>
    );
  }

  const chartData = data.slice(0, 10).reverse();

  // Responsive sizes
  const mobile = viewportWidth <= 480;
  const tablet = viewportWidth <= 768;
  const fontSize = mobile ? 9 : tablet ? 10 : 11;
  const legendFontSize = mobile ? 10 : tablet ? 11 : 13;
  const pointRadius = mobile ? 2 : tablet ? 3 : 4;
  const pointHoverRadius = mobile ? 3 : tablet ? 5 : 6;
  const borderWidth = mobile ? 2 : 2;

  const baseXAxis = useMemo(
    () => ({
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
      },
    }),
    [fontSize]
  );

  // Chart options configuration
  const getChartOptions = (yScale) => ({
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
      x: baseXAxis,
      y: yScale,
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

  const makeSingleYAxis = (axisTitle, allValues) => {
    const range = getSuggestedRange(allValues, { paddingRatio: 0.1, minPadding: 0.5 });

    return {
      type: 'linear',
      display: true,
      position: 'left',
      ...(range || {}),
      grid: {
        color: 'rgba(148, 163, 184, 0.12)',
        drawBorder: false,
      },
      title: {
        display: true,
        text: axisTitle,
        color: 'rgba(226, 232, 240, 0.65)',
        font: {
          size: mobile ? 10 : tablet ? 10 : 11,
          weight: '600',
        },
        padding: { top: 0, bottom: 6 },
      },
      ticks: {
        color: 'rgba(226, 232, 240, 0.55)',
        font: {
          size: fontSize,
        },
        callback: function (value) {
          const v = clampFinite(value, 0);
          // Auto precision: keep small numbers readable.
          if (Math.abs(v) < 1) return v.toFixed(2);
          if (Math.abs(v) < 10) return v.toFixed(1);
          return v.toFixed(0);
        },
      },
    };
  };

  // Render chart with multiple datasets
  const renderMultiChart = (datasets, title, { yAxisTitle }) => {
    const labels = datasets[0].values.map((_, index) => {
      const last = datasets[0].values.length - 1;
      if (index === 0) return mobile ? 'Old' : 'Terlama';
      if (index === last) return mobile ? 'New' : 'Terbaru';
      return '';
    });

    const allValues = datasets.flatMap((d) => d.values);
    const yScale = makeSingleYAxis(yAxisTitle || 'Nilai', allValues);

    const chartDataset = {
      labels,
      datasets: datasets.map(dataset => ({
        label: dataset.label,
        data: dataset.values,
        borderColor: dataset.color,
        backgroundColor: dataset.color,
        borderWidth: borderWidth,
        fill: false,
        spanGaps: true,
        valuePrecision: dataset.valuePrecision,
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
          <Line data={chartDataset} options={getChartOptions(yScale)} />
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
        { label: 'Suhu (°C)', values: temperatureValues, color: '#ff6b6b', valuePrecision: 1 },
        { label: 'Kelembapan (%)', values: humidityValues, color: '#00b4d8', valuePrecision: 0 }
      ], "Data Suhu & Kelembapan", { yAxisTitle: 'Suhu / Kelembapan' })}
      
      {renderMultiChart([
        { label: 'Sensor Gas MQ-135 (PPM)', values: mq135Values, color: '#9b59b6', valuePrecision: 2 },
        { label: 'Sensor Gas MQ-7 (PPM)', values: mq7Values, color: '#f39c12', valuePrecision: 2 }
      ], "Data Sensor Gas MQ-135 & MQ-7", { yAxisTitle: 'Nilai Sensor' })}
    </div>
  );
}
