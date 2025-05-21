import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const RadarChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    chartInstance.current = new Chart(ctx, {
      type: 'radar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: {
              display: true,
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              beginAtZero: true,
              max: 100,
              stepSize: 20,
              showLabelBackdrop: false,
              font: {
                size: 9
              }
            },
            pointLabels: {
              font: {
                size: 10
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.raw}/100`;
              }
            }
          }
        }
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default RadarChart;
