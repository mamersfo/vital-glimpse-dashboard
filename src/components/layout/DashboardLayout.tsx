
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from './Sidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <div className="flex-1 p-4 md:p-6 lg:p-8 relative">
          <div className="absolute top-4 left-4 z-10">
            <SidebarTrigger />
          </div>
          <div className="pt-12">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
