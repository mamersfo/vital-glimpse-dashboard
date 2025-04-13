
import { useQuery } from '@tanstack/react-query';
import { fetchHealthMetrics, fetchAllMetricsWithValues, fetchMetricWithValues } from '@/services/metricService';
import { MetricWithValues } from '@/types/metrics';

// Hook to fetch all health metrics
export const useHealthMetrics = () => {
  return useQuery({
    queryKey: ['healthMetrics'],
    queryFn: fetchHealthMetrics,
  });
};

// Hook to fetch all metrics with their values
export const useAllMetricsWithValues = () => {
  return useQuery({
    queryKey: ['metricsWithValues'],
    queryFn: fetchAllMetricsWithValues,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch a specific metric with its values
export const useMetricWithValues = (metricId: number) => {
  return useQuery({
    queryKey: ['metric', metricId],
    queryFn: () => fetchMetricWithValues(metricId),
    enabled: !!metricId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
