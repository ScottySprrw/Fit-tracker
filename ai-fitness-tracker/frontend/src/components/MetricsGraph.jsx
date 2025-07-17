import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const MetricsGraph = ({ 
  title, 
  data, 
  metric,
  highlightValue,
  highlightLabel,
  timeRange = '30d',
  height = 200,
  showPoints = true,
  showArea = true,
  color = '#3b82f6'
}) => {
  const chartRef = useRef(null);

  // Prepare chart data
  const chartData = {
    labels: data.map(point => {
      const date = new Date(point.date);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }),
    datasets: [
      {
        label: metric,
        data: data.map(point => point.value),
        borderColor: color,
        backgroundColor: showArea ? `${color}20` : 'transparent',
        fill: showArea,
        tension: 0.4,
        pointRadius: showPoints ? 4 : 0,
        pointHoverRadius: 6,
        pointBackgroundColor: color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
      }
    ]
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: color,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => {
            const dataPoint = data[context[0].dataIndex];
            return new Date(dataPoint.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            });
          },
          label: (context) => {
            const dataPoint = data[context.dataIndex];
            return `${metric}: ${dataPoint.value}${dataPoint.unit || ''}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12
          }
        }
      },
      y: {
        display: true,
        grid: {
          color: '#f3f4f6',
          borderDash: [2, 2]
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    onHover: (event, activeElements) => {
      event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
    }
  };

  const handleDataPointClick = (event, activeElements) => {
    if (activeElements.length > 0) {
      const dataIndex = activeElements[0].index;
      const dataPoint = data[dataIndex];
      
      // Custom action for data point click
      console.log('Data point clicked:', dataPoint);
      
      // You can implement custom modal or detail view here
      // For now, we'll just show an alert
      alert(`${metric}: ${dataPoint.value}${dataPoint.unit || ''} on ${new Date(dataPoint.date).toLocaleDateString()}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-card p-6 shadow-soft border border-neutral-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          {highlightValue && (
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold text-accent-600 mr-2">
                {highlightValue}
              </span>
              {highlightLabel && (
                <span className="text-sm text-neutral-500">
                  {highlightLabel}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs font-medium bg-surface-secondary text-neutral-600 rounded-pill">
            {timeRange}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: `${height}px` }}>
        {data.length > 0 ? (
          <Line
            ref={chartRef}
            data={chartData}
            options={options}
            onClick={handleDataPointClick}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm">No data available</p>
            </div>
          </div>
        )}
      </div>

      {/* Data Summary */}
      {data.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-neutral-200">
          <div className="text-center">
            <div className="text-lg font-semibold text-neutral-900">
              {Math.max(...data.map(d => d.value))}
            </div>
            <div className="text-xs text-neutral-500">Peak</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-neutral-900">
              {Math.min(...data.map(d => d.value))}
            </div>
            <div className="text-xs text-neutral-500">Low</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-neutral-900">
              {Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length)}
            </div>
            <div className="text-xs text-neutral-500">Average</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MetricsGraph;