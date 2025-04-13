
import React from 'react';
import { 
  Activity, 
  Home, 
  Heart, 
  LineChart, 
  Settings,
  Scale,
  Footprints,
  Moon,
  Droplets,
  Flame,
} from 'lucide-react';
import { 
  Sidebar as ShadcnSidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

export function Sidebar() {
  const isMobile = useIsMobile();

  const menuItems = [
    { name: 'Dashboard', icon: Home, url: '/' },
    { name: 'Heart Rate', icon: Heart, url: '/metrics/heart-rate' },
    { name: 'Weight', icon: Scale, url: '/metrics/weight' },
    { name: 'Steps', icon: Footprints, url: '/metrics/steps' },
    { name: 'Sleep', icon: Moon, url: '/metrics/sleep' },
    { name: 'Water', icon: Droplets, url: '/metrics/water' },
    { name: 'Calories', icon: Flame, url: '/metrics/calories' },
    { name: 'All Metrics', icon: Activity, url: '/metrics' },
    { name: 'Settings', icon: Settings, url: '/settings' },
  ];

  const currentPath = window.location.pathname;

  return (
    <ShadcnSidebar defaultCollapsed={isMobile}>
      <SidebarHeader className="flex items-center gap-2 px-4">
        <Activity className="h-6 w-6" />
        <span className="font-semibold">HealthTracker</span>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild className={currentPath === item.url ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}>
                <a href={item.url} className="flex items-center gap-2">
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="px-4 pb-4">
        <div className="text-xs text-sidebar-foreground/70">
          HealthTracker Dashboard v1.0
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
