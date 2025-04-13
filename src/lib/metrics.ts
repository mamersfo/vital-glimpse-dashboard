
import { format, parseISO, startOfMonth, endOfMonth, isValid, isAfter, isBefore, subMonths } from 'date-fns';
import { ChartDataPoint, ChartViewMode, MetricValue } from '@/types/metrics';

// Process metric values for charts based on view mode
export const processMetricValues = (
  metricValues: MetricValue[], 
  viewMode: ChartViewMode,
  startDate?: Date,
  endDate?: Date
): ChartDataPoint[] => {
  if (!metricValues?.length) return [];

  // Filter by date range if provided
  let filteredValues = metricValues;
  if (startDate && isValid(startDate) && endDate && isValid(endDate)) {
    filteredValues = metricValues.filter(value => {
      const date = parseISO(value.date);
      return isAfter(date, startDate) && isBefore(date, endDate);
    });
  }

  if (viewMode === 'daily') {
    return filteredValues.map(value => ({
      date: value.date,
      value: value.value,
      formattedDate: format(parseISO(value.date), 'MMM d, yyyy')
    }));
  } else {
    // Group by month for monthly view
    const monthlyData = filteredValues.reduce<Record<string, number[]>>((acc, value) => {
      const date = parseISO(value.date);
      const monthKey = format(date, 'yyyy-MM');
      
      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      
      acc[monthKey].push(value.value);
      return acc;
    }, {});

    // Calculate average for each month
    return Object.entries(monthlyData).map(([monthKey, values]) => {
      const sum = values.reduce((total, val) => total + val, 0);
      const avg = sum / values.length;
      const date = parseISO(`${monthKey}-01`);
      
      return {
        date: format(date, 'yyyy-MM-dd'),
        value: parseFloat(avg.toFixed(2)),
        formattedDate: format(date, 'MMM yyyy')
      };
    }).sort((a, b) => a.date.localeCompare(b.date));
  }
};

// Get default date range (last 3 months)
export const getDefaultDateRange = (): [Date, Date] => {
  const endDate = new Date();
  const startDate = subMonths(endDate, 3);
  return [startDate, endDate];
};

// Format date for display
export const formatDateForDisplay = (date: Date): string => {
  return format(date, 'MMM d, yyyy');
};

// Get color class based on metric name
export const getMetricColorClass = (metricName: string): string => {
  const name = metricName.toLowerCase();
  
  if (name.includes('heart') || name.includes('pulse') || name.includes('bpm')) {
    return 'heart';
  } else if (name.includes('weight') || name.includes('bmi') || name.includes('body mass')) {
    return 'weight';
  } else if (name.includes('step') || name.includes('walk') || name.includes('distance')) {
    return 'steps';
  } else if (name.includes('sleep') || name.includes('rest') || name.includes('bed')) {
    return 'sleep';
  } else if (name.includes('water') || name.includes('fluid') || name.includes('hydration')) {
    return 'water';
  } else if (name.includes('calorie') || name.includes('energy') || name.includes('kcal')) {
    return 'calories';
  } else {
    return 'default';
  }
};
