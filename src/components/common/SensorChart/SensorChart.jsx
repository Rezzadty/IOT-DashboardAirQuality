import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './SensorChart.css';

const SensorChart = ({ data, title = 'Grafik Data Sensor' }) => {
  // Format data untuk chart
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Ambil 20 data terakhir untuk grafik yang tidak terlalu padat
    const limitedData = data.slice(0, 20).reverse();

    return limitedData.map((item, index) => {
      // Format timestamp ke waktu yang lebih readable
      const date = new Date(item.timestamp);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const time = `${hours}:${minutes}`;

      return {
        time,
        humidity: Number(item.humidity).toFixed(1),
        temperature: Number(item.temperature).toFixed(1),
        mq135: Number(item.mq135_ratio).toFixed(1),
        mq7: Number(item.mq7_ratio).toFixed(1),
        voltage: Number(item.voltage_rms).toFixed(1)
      };
    });
  }, [data]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-time">{`Waktu: ${payload[0].payload.time}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${getUnit(entry.dataKey)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Get unit for each sensor
  const getUnit = (dataKey) => {
    switch (dataKey) {
      case 'humidity':
        return ' %';
      case 'temperature':
        return ' °C';
      case 'mq135':
      case 'mq7':
        return ' PPM';
      case 'voltage':
        return ' V';
      default:
        return '';
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="sensor-chart-container">
        <div className="chart-header">
          <h2 className="chart-title">{title}</h2>
          <p className="chart-subtitle">Data 30 Menit Terakhir</p>
        </div>
        <div className="chart-no-data">
          <p>Tidak ada data untuk ditampilkan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sensor-chart-container">
      <div className="chart-header">
        <h2 className="chart-title">{title}</h2>
        <p className="chart-subtitle">Data 30 Menit Terakhir ({chartData.length} Data Point)</p>
      </div>
      
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={450}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis
              dataKey="time"
              stroke="#aaa"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#aaa"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="humidity"
              name="Kelembapan"
              stroke="#00b4d8"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="temperature"
              name="Suhu"
              stroke="#ff6b6b"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="mq135"
              name="Gas MQ135"
              stroke="#9b59b6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="mq7"
              name="Gas MQ7"
              stroke="#f39c12"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="voltage"
              name="Tegangan RMS"
              stroke="#2ecc71"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SensorChart;
