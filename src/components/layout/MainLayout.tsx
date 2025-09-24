import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from './Sidebar';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export function MainLayout() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold">Railway Traffic Control System</h1>
                <p className="text-sm text-muted-foreground">
                  Intelligent Decision Support Platform
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono">
                  {currentTime.toLocaleTimeString()}
                </span>
              </div>
              <Badge variant="outline" className="status-running">
                <Activity className="w-4 h-4 mr-1" />
                System Online
              </Badge>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}