import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrainStatusCard } from "./TrainStatusCard";
import { TrackVisualization } from "./TrackVisualization";
import { ControlPanel } from "./ControlPanel";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { AlertTriangle, Activity, Clock, Users, Train, Settings, Bell } from "lucide-react";

interface Train {
  id: string;
  number: string;
  name: string;
  status: "running" | "delayed" | "stopped" | "maintenance";
  currentLocation: string;
  destination: string;
  delay: number;
  priority: "high" | "medium" | "low";
  type: "express" | "local" | "freight" | "special";
}

export function Dashboard() {
  const [trains, setTrains] = useState<Train[]>([
    {
      id: "1",
      number: "12345",
      name: "Rajdhani Express",
      status: "running",
      currentLocation: "Section A-B",
      destination: "New Delhi",
      delay: 0,
      priority: "high",
      type: "express"
    },
    {
      id: "2", 
      number: "56789",
      name: "Local Passenger",
      status: "delayed",
      currentLocation: "Section B-C",
      destination: "Mumbai Central",
      delay: 15,
      priority: "medium",
      type: "local"
    },
    {
      id: "3",
      number: "98765",
      name: "Freight Express",
      status: "stopped",
      currentLocation: "Yard D",
      destination: "Chennai",
      delay: 45,
      priority: "low",
      type: "freight"
    },
    {
      id: "4",
      number: "11223",
      name: "Maintenance Special",
      status: "maintenance",
      currentLocation: "Section C-D",
      destination: "Workshop",
      delay: 0,
      priority: "high",
      type: "special"
    }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const statusCounts = {
    running: trains.filter(t => t.status === "running").length,
    delayed: trains.filter(t => t.status === "delayed").length,
    stopped: trains.filter(t => t.status === "stopped").length,
    maintenance: trains.filter(t => t.status === "maintenance").length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Blue Navigation Bar */}
      <nav className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Train className="h-8 w-8" />
              <h1 className="text-xl font-bold">Railway Traffic Control System</h1>
              <Badge variant="secondary" className="ml-4">
                <Activity className="w-4 h-4 mr-1" />
                System Online
              </Badge>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-mono">
                  {currentTime.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">Controller: Admin</span>
              </div>
              <Bell className="h-5 w-5 cursor-pointer hover:text-accent transition-colors" />
              <Settings className="h-5 w-5 cursor-pointer hover:text-accent transition-colors" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 space-y-6">

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Running</p>
              <p className="text-2xl font-bold text-status-running">
                {statusCounts.running}
              </p>
            </div>
            <div className="p-2 bg-status-running/10 rounded-lg">
              <Activity className="w-6 h-6 text-status-running" />
            </div>
          </div>
        </Card>

        <Card className="p-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Delayed</p>
              <p className="text-2xl font-bold text-status-delayed">
                {statusCounts.delayed}
              </p>
            </div>
            <div className="p-2 bg-status-delayed/10 rounded-lg">
              <Clock className="w-6 h-6 text-status-delayed" />
            </div>
          </div>
        </Card>

        <Card className="p-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Stopped</p>
              <p className="text-2xl font-bold text-status-stopped">
                {statusCounts.stopped}
              </p>
            </div>
            <div className="p-2 bg-status-stopped/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-status-stopped" />
            </div>
          </div>
        </Card>

        <Card className="p-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Maintenance</p>
              <p className="text-2xl font-bold text-status-maintenance">
                {statusCounts.maintenance}
              </p>
            </div>
            <div className="p-2 bg-status-maintenance/10 rounded-lg">
              <Users className="w-6 h-6 text-status-maintenance" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="track-view" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="track-view">Track View</TabsTrigger>
          <TabsTrigger value="train-status">Train Status</TabsTrigger>
          <TabsTrigger value="control-panel">Control Panel</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="track-view" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TrackVisualization trains={trains} />
            </div>
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-status-delayed animate-pulse-glow"></div>
                    <span>Train 56789 delayed by 15 minutes</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-status-stopped animate-pulse-glow"></div>
                    <span>Train 98765 stopped at Yard D</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-status-maintenance"></div>
                    <span>Maintenance work in Section C-D</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="train-status" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trains.map((train) => (
              <TrainStatusCard key={train.id} train={train} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="control-panel" className="space-y-4">
          <ControlPanel trains={trains} setTrains={setTrains} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <PerformanceMetrics trains={trains} />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}