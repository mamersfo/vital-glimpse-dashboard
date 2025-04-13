
export interface HealthMetric {
  id: number;
  name: string;
  description: string;
  unit: string;
  created_at: string;
  user_id: string;
}

export interface MetricValue {
  id: number;
  metric_id: number;
  date: string;
  value: number;
  created_at: string;
  user_id: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  formattedDate?: string;
}

export type ChartViewMode = 'daily' | 'monthly';

export type MetricColor = 
  | 'heart'
  | 'weight'
  | 'steps'
  | 'sleep'
  | 'water'
  | 'calories'
  | 'default';

export interface MetricWithValues extends HealthMetric {
  values: MetricValue[];
  color: MetricColor;
}
