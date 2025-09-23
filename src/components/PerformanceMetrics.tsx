import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Activity, 
  Users, 
  Zap,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

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

interface PerformanceMetricsProps {
  trains: Train[];
}

export function PerformanceMetrics({ trains }: PerformanceMetricsProps) {
  // Sample data for charts
  const hourlyData = [
    { hour: "00:00", throughput: 12, delays: 2, efficiency: 85 },
    { hour: "04:00", throughput: 8, delays: 1, efficiency: 90 },
    { hour: "08:00", throughput: 25, delays: 5, efficiency: 80 },
    { hour: "12:00", throughput: 22, delays: 3, efficiency: 87 },
    { hour: "16:00", throughput: 28, delays: 4, efficiency: 86 },
    { hour: "20:00", throughput: 18, delays: 2, efficiency: 89 },
  ];

  const trainTypeData = [
    { name: "Express", value: trains.filter(t => t.type === "express").length, color: "hsl(var(--primary))" },
    { name: "Local", value: trains.filter(t => t.type === "local").length, color: "hsl(var(--chart-secondary))" },
    { name: "Freight", value: trains.filter(t => t.type === "freight").length, color: "hsl(var(--chart-tertiary))" },
    { name: "Special", value: trains.filter(t => t.type === "special").length, color: "hsl(var(--status-maintenance))" },
  ];

  const statusDistribution = [
    { name: "Running", value: trains.filter(t => t.status === "running").length, color: "hsl(var(--status-running))" },
    { name: "Delayed", value: trains.filter(t => t.status === "delayed").length, color: "hsl(var(--status-delayed))" },
    { name: "Stopped", value: trains.filter(t => t.status === "stopped").length, color: "hsl(var(--status-stopped))" },
    { name: "Maintenance", value: trains.filter(t => t.status === "maintenance").length, color: "hsl(var(--status-maintenance))" },
  ];

  // Calculate KPIs
  const totalTrains = trains.length;
  const runningTrains = trains.filter(t => t.status === "running").length;
  const delayedTrains = trains.filter(t => t.status === "delayed").length;
  const averageDelay = trains.reduce((sum, train) => sum + train.delay, 0) / totalTrains;
  const onTimePerformance = ((runningTrains / totalTrains) * 100).toFixed(1);
  const networkUtilization = 87; // Sample value
  const throughputEfficiency = 94; // Sample value

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">On-Time Performance</p>
              <p className="text-2xl font-bold text-status-running">{onTimePerformance}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                +2.3% from last hour
              </p>
            </div>
            <div className="p-2 bg-status-running/10 rounded-lg">
              <Target className="w-6 h-6 text-status-running" />
            </div>
          </div>
        </Card>

        <Card className="p-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Delay</p>
              <p className="text-2xl font-bold text-status-delayed">{averageDelay.toFixed(1)}min</p>
              <p className="text-xs text-muted-foreground mt-1">
                <Clock className="w-3 h-3 inline mr-1" />
                Target: &lt;5min
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
              <p className="text-sm text-muted-foreground">Network Utilization</p>
              <p className="text-2xl font-bold text-primary">{networkUtilization}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                <Activity className="w-3 h-3 inline mr-1" />
                Optimal range
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Throughput Efficiency</p>
              <p className="text-2xl font-bold text-chart-secondary">{throughputEfficiency}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                <Zap className="w-3 h-3 inline mr-1" />
                Above target
              </p>
            </div>
            <div className="p-2 bg-chart-secondary/10 rounded-lg">
              <Zap className="w-6 h-6 text-chart-secondary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Hourly Performance Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="hour" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }}
              />
              <Bar dataKey="throughput" fill="hsl(var(--primary))" name="Throughput" />
              <Bar dataKey="delays" fill="hsl(var(--status-delayed))" name="Delays" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Efficiency Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Efficiency Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="hour" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                domain={[70, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                stroke="hsl(var(--chart-secondary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--chart-secondary))", strokeWidth: 2, r: 4 }}
                name="Efficiency %"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Train Type Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Train Type Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={trainTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {trainTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-4">
            {trainTypeData.map((item) => (
              <Badge key={item.name} variant="outline" className="text-xs">
                <div 
                  className="w-2 h-2 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                {item.name}: {item.value}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Status Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Current Status Overview</h3>
          <div className="space-y-4">
            {statusDistribution.map((status) => (
              <div key={status.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{status.name}</span>
                  <span className="text-sm text-muted-foreground">{status.value} trains</span>
                </div>
                <Progress 
                  value={(status.value / totalTrains) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-control-bg rounded-lg">
            <h4 className="text-sm font-medium mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-status-delayed" />
              System Health
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-status-running" />
                <span>Signals: Normal</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-status-running" />
                <span>Communication: Active</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-status-running" />
                <span>Power: Stable</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-status-delayed" />
                <span>Weather: Monitoring</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}