
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ChartViewMode } from '@/types/metrics';
import { CalendarDays, Calendar } from 'lucide-react';

interface ViewModeToggleProps {
  viewMode: ChartViewMode;
  onViewModeChange: (mode: ChartViewMode) => void;
}

export function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium">View Mode</label>
      <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && onViewModeChange(value as ChartViewMode)}>
        <ToggleGroupItem value="daily" aria-label="Toggle daily view">
          <CalendarDays className="h-4 w-4 mr-2" />
          Daily
        </ToggleGroupItem>
        <ToggleGroupItem value="monthly" aria-label="Toggle monthly view">
          <Calendar className="h-4 w-4 mr-2" />
          Monthly
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
