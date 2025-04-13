
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/metrics/MetricCard';
import { DateRangeSelector } from '@/components/dashboard/DateRangeSelector';
import { ViewModeToggle } from '@/components/dashboard/ViewModeToggle';
import { useAllMetricsWithValues } from '@/hooks/useHealthMetrics';
import { getDefaultDateRange } from '@/lib/metrics';
import { ChartViewMode } from '@/types/metrics';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  // State for date range and view mode
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [viewMode, setViewMode] = useState<ChartViewMode>('daily');

  // Fetch metrics data
  const { data: metrics, isLoading, error } = useAllMetricsWithValues();

  // Handle date changes
  const handleStartDateChange = (date: Date) => {
    setDateRange([date, dateRange[1]]);
  };

  const handleEndDateChange = (date: Date) => {
    setDateRange([dateRange[0], date]);
  };

  // Handle view mode change
  const handleViewModeChange = (mode: ChartViewMode) => {
    setViewMode(mode);
  };

  // Show error toast if data fetch fails
  if (error) {
    toast.error('Failed to load health metrics data');
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Activity className="h-6 w-6" />
              Health Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track and visualize your health metrics over time
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <DateRangeSelector
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
            />
            <ViewModeToggle 
              viewMode={viewMode} 
              onViewModeChange={handleViewModeChange} 
            />
          </div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="metric-card p-6">
                <Skeleton className="h-7 w-1/2 mb-2" />
                <Skeleton className="h-6 w-1/4 mb-4" />
                <Skeleton className="h-56 w-full" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-7 w-20" />
                  <Skeleton className="h-7 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics?.map((metric) => (
              <MetricCard
                key={metric.id}
                metric={metric}
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                viewMode={viewMode}
              />
            ))}
            {metrics?.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No health metrics found</h3>
                <p className="text-muted-foreground max-w-md mt-2">
                  There are no health metrics data in your Supabase database. Add some data to start tracking your health.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Index;
