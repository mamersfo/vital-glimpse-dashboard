
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, LineChart as LineChartIcon, Calendar, Info } from 'lucide-react';
import { MetricWithValues } from '@/types/metrics';
import { MetricChart } from './MetricChart';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MetricCardProps {
  metric: MetricWithValues;
  startDate: Date;
  endDate: Date;
  viewMode: 'daily' | 'monthly';
}

export function MetricCard({ metric, startDate, endDate, viewMode }: MetricCardProps) {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  
  // Get the latest value
  const latestValue = metric.values.length > 0 
    ? metric.values[metric.values.length - 1].value 
    : 0;

  // Calculate change from previous value
  const previousValue = metric.values.length > 1 
    ? metric.values[metric.values.length - 2].value 
    : latestValue;
    
  const change = latestValue - previousValue;
  const changePercent = previousValue !== 0 
    ? ((change / previousValue) * 100).toFixed(1) 
    : '0';
    
  const isPositive = change > 0;
  const isNegative = change < 0;
  const changeText = `${isPositive ? '+' : ''}${change.toFixed(1)} (${isPositive ? '+' : ''}${changePercent}%)`;
  
  return (
    <Card className={`metric-card metric-card-${metric.color}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{metric.name}</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{metric.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{latestValue}</span>
          <span className="text-sm text-muted-foreground">{metric.unit}</span>
          {change !== 0 && (
            <Badge variant={isPositive ? 'default' : isNegative ? 'destructive' : 'secondary'} className="h-5 text-xs">
              {changeText}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="h-56 pb-0">
        <MetricChart 
          metric={metric}
          chartType={chartType}
          viewMode={viewMode}
          startDate={startDate}
          endDate={endDate}
        />
      </CardContent>
      <CardFooter className="flex justify-between px-4 py-2">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-7 px-2 ${chartType === 'line' ? 'bg-primary/10' : ''}`}
            onClick={() => setChartType('line')}
          >
            <LineChartIcon className="h-4 w-4 mr-1" />
            <span className="text-xs">Line</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-7 px-2 ${chartType === 'bar' ? 'bg-primary/10' : ''}`}
            onClick={() => setChartType('bar')}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            <span className="text-xs">Bar</span>
          </Button>
        </div>
        <Button variant="outline" size="sm" className="h-7 px-2" asChild>
          <a href={`/metrics/${metric.id}`}>
            <span className="text-xs">Details</span>
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
