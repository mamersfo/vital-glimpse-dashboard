
import { createClient } from '@supabase/supabase-js';
import { HealthMetric, MetricValue, MetricWithValues } from '@/types/metrics';
import { getMetricColorClass } from '@/lib/metrics';

// Initialize Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch all health metrics
export const fetchHealthMetrics = async (): Promise<HealthMetric[]> => {
  const { data, error } = await supabase
    .from('health_metrics')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching health metrics:', error);
    throw new Error(error.message);
  }

  return data || [];
};

// Fetch metric values for a specific metric
export const fetchMetricValues = async (metricId: number): Promise<MetricValue[]> => {
  const { data, error } = await supabase
    .from('metric_values')
    .select('*')
    .eq('metric_id', metricId)
    .order('date');

  if (error) {
    console.error(`Error fetching values for metric ${metricId}:`, error);
    throw new Error(error.message);
  }

  return data || [];
};

// Fetch a specific metric with its values
export const fetchMetricWithValues = async (metricId: number): Promise<MetricWithValues> => {
  // Fetch the metric details
  const { data: metric, error: metricError } = await supabase
    .from('health_metrics')
    .select('*')
    .eq('id', metricId)
    .single();

  if (metricError) {
    console.error(`Error fetching metric ${metricId}:`, metricError);
    throw new Error(metricError.message);
  }

  // Fetch the metric values
  const values = await fetchMetricValues(metricId);

  return {
    ...metric,
    values,
    color: getMetricColorClass(metric.name)
  };
};

// Fetch all metrics with their values
export const fetchAllMetricsWithValues = async (): Promise<MetricWithValues[]> => {
  // Fetch all metrics
  const metrics = await fetchHealthMetrics();
  
  // Fetch values for each metric
  const metricsWithValues = await Promise.all(
    metrics.map(async (metric) => {
      const values = await fetchMetricValues(metric.id);
      return {
        ...metric,
        values,
        color: getMetricColorClass(metric.name)
      };
    })
  );

  return metricsWithValues;
};
