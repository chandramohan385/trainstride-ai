import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Train, 
  Radio, 
  Building2, 
  FileBarChart, 
  Info,
  LogOut,
  Search,
  User
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Train Movements", url: "/train-movements", icon: Train },
  { title: "Signal Control", url: "/signal-control", icon: Radio },
  { title: "Platform Management", url: "/platform-management", icon: Building2 },
  { title: "Reports", url: "/reports", icon: FileBarChart },
  { title: "About", url: "/about", icon: Info },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path || (path === '/dashboard' && currentPath === '/');
  
  const getNavClassName = (path: string) => 
    isActive(path) 
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Train className="w-6 h-6 text-primary" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-gradient-primary">TrainStride AI</h2>
              <p className="text-xs text-muted-foreground">Railway Control</p>
            </div>
          )}
        </div>
        
        {!collapsed && (
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search trains, signals..." 
                className="pl-10 h-9"
              />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClassName(item.url)}
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.email?.split('@')[0] || 'Controller'}
              </p>
              <p className="text-xs text-muted-foreground">Railway Controller</p>
            </div>
          )}
        </div>
        
        {!collapsed && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={signOut}
            className="w-full justify-start mt-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}