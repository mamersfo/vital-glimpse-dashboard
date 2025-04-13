
import { createClient } from '@supabase/supabase-js';
import { HealthMetric, MetricValue, MetricWithValues } from '@/types/metrics';
import { getMetricColorClass } from '@/lib/metrics';

// Initialize Supabase client with environment variables or fallback to demo values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-demo-supabase-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-demo-anon-key';

// Create a mock function to generate sample data when Supabase is not properly configured
const generateMockData = () => {
  const mockMetrics = [
    { id: 1, name: 'Heart Rate', description: 'Average heart rate in beats per minute', unit: 'bpm', created_at: '2023-01-01', user_id: '1' },
    { id: 2, name: 'Weight', description: 'Body weight measurement', unit: 'kg', created_at: '2023-01-01', user_id: '1' },
    { id: 3, name: 'Steps', description: 'Daily step count', unit: 'steps', created_at: '2023-01-01', user_id: '1' },
    { id: 4, name: 'Sleep', description: 'Hours of sleep per night', unit: 'hours', created_at: '2023-01-01', user_id: '1' },
    { id: 5, name: 'Water', description: 'Daily water intake', unit: 'ml', created_at: '2023-01-01', user_id: '1' },
    { id: 6, name: 'Calories', description: 'Daily caloric intake', unit: 'kcal', created_at: '2023-01-01', user_id: '1' },
  ];

  const generateValues = (metricId: number, baseValue: number) => {
    const values = [];
    const today = new Date();
    
    for (let i = 0; i < 90; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      values.push({
        id: metricId * 1000 + i,
        metric_id: metricId,
        date: date.toISOString().split('T')[0],
        value: baseValue + Math.random() * 10 - 5,
        created_at: date.toISOString(),
        user_id: '1'
      });
    }
    
    return values;
  };

  return {
    metrics: mockMetrics,
    valuesMap: {
      1: generateValues(1, 75),
      2: generateValues(2, 70),
      3: generateValues(3, 8000),
      4: generateValues(4, 7.5),
      5: generateValues(5, 2000),
      6: generateValues(6, 2200),
    }
  };
};

// Store mock data
const mockData = generateMockData();

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Flag to determine if we're using mock data (when Supabase URL/key are placeholders)
const useMockData = supabaseUrl.includes('your-demo-supabase-url');

// Fetch all health metrics
export const fetchHealthMetrics = async (): Promise<HealthMetric[]> => {
  if (useMockData) {
    console.log('Using mock data for metrics (no Supabase credentials provided)');
    return mockData.metrics;
  }

  try {
    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching health metrics:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch from Supabase, using mock data:', error);
    return mockData.metrics;
  }
};

// Fetch metric values for a specific metric
export const fetchMetricValues = async (metricId: number): Promise<MetricValue[]> => {
  if (useMockData) {
    return mockData.valuesMap[metricId] || [];
  }

  try {
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
  } catch (error) {
    console.error('Failed to fetch from Supabase, using mock data:', error);
    return mockData.valuesMap[metricId] || [];
  }
};

// Fetch a specific metric with its values
export const fetchMetricWithValues = async (metricId: number): Promise<MetricWithValues> => {
  // Fetch the metric details
  const metric = await (async () => {
    if (useMockData) {
      return mockData.metrics.find(m => m.id === metricId);
    }

    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('id', metricId)
        .single();

      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching metric ${metricId}:`, error);
      return mockData.metrics.find(m => m.id === metricId);
    }
  })();

  if (!metric) {
    throw new Error(`Metric with ID ${metricId} not found`);
  }

  // Fetch the metric values
  const values = await fetchMetricValues(metricId);
  const color = getMetricColorClass(metric.name) as MetricColor;

  return {
    ...metric,
    values,
    color
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
      const color = getMetricColorClass(metric.name) as MetricColor;
      
      return {
        ...metric,
        values,
        color
      };
    })
  );

  return metricsWithValues;
};
