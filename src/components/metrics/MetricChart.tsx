
import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { MetricWithValues, ChartViewMode } from '@/types/metrics';
import { processMetricValues } from '@/lib/metrics';
import { format, parseISO } from 'date-fns';

interface MetricChartProps {
  metric: MetricWithValues;
  chartType: 'line' | 'bar';
  viewMode: ChartViewMode;
  startDate: Date;
  endDate: Date;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  viewMode: ChartViewMode;
}

const CustomTooltip = ({ active, payload, label, viewMode }: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-md">
        <p className="font-medium text-sm">
          {payload[0].payload.formattedDate}
        </p>
        <p className="text-sm">
          <span className="font-medium">{payload[0].value}</span> {payload[0].payload.unit}
        </p>
      </div>
    );
  }
  return null;
};

const CustomizedAxisTick = ({ x, y, payload, viewMode }: any) => {
  const date = parseISO(payload.value);
  const tickFormatter = viewMode === 'daily' 
    ? format(date, 'MMM d') 
    : format(date, 'MMM yy');
  
  return (
    <g transform={`translate(${x},${y})`}>
      <text 
        x={0} 
        y={0} 
        dy={16} 
        textAnchor="middle" 
        className="text-xs fill-gray-500"
      >
        {tickFormatter}
      </text>
    </g>
  );
};

export function MetricChart({ metric, chartType, viewMode, startDate, endDate }: MetricChartProps) {
  const chartData = useMemo(() => {
    const data = processMetricValues(metric.values, viewMode, startDate, endDate);
    // Enhance data with unit for tooltip
    return data.map(item => ({ ...item, unit: metric.unit }));
  }, [metric, viewMode, startDate, endDate]);

  // Define colors based on metric type
  const getColor = () => {
    if (metric.color === 'heart') return '#FF5252';
    if (metric.color === 'weight') return '#4CAF50';
    if (metric.color === 'steps') return '#FFC107';
    if (metric.color === 'sleep') return '#9C27B0';
    if (metric.color === 'water') return '#2196F3';
    if (metric.color === 'calories') return '#FF9800';
    return '#1E88E5'; // default
  };

  const color = getColor();

  if (chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">No data available for the selected period</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      {chartType === 'line' ? (
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={<CustomizedAxisTick viewMode={viewMode} />}
            tickLine={false}
            axisLine={{ stroke: '#e0e0e0' }}
            minTickGap={20}
          />
          <YAxis 
            tickLine={false}
            axisLine={{ stroke: '#e0e0e0' }}
            tickFormatter={(value) => `${value}`}
            width={30}
          />
          <RechartsTooltip content={<CustomTooltip viewMode={viewMode} />} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 2, fill: 'white' }}
            activeDot={{ r: 5, stroke: color, strokeWidth: 2 }}
          />
        </LineChart>
      ) : (
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={<CustomizedAxisTick viewMode={viewMode} />}
            tickLine={false}
            axisLine={{ stroke: '#e0e0e0' }}
            minTickGap={20}
          />
          <YAxis 
            tickLine={false}
            axisLine={{ stroke: '#e0e0e0' }}
            tickFormatter={(value) => `${value}`}
            width={30}
          />
          <RechartsTooltip content={<CustomTooltip viewMode={viewMode} />} />
          <Bar 
            dataKey="value" 
            fill={color} 
            fillOpacity={0.7} 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
}
