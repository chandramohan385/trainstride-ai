import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from 'recharts';
import { 
  FileBarChart, 
  Download, 
  Calendar, 
  TrendingUp,
  Clock,
  Train,
  Signal,
  Building2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { csv } from 'd3-dsv';

interface ReportData {
  date: string;
  averageDelay: number;
  totalTrains: number;
  onTimeTrains: number;
  delayedTrains: number;
  signalChanges: number;
  platformUtilization: number;
}

interface RouteStats {
  route: string;
  trainCount: number;
  averageDelay: number;
  onTimePercentage: number;
}

const Reports = () => {
  const [reportType, setReportType] = useState('daily');
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [routeStats, setRouteStats] = useState<RouteStats[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for charts
  const mockDailyData: ReportData[] = [
    { date: '2024-09-18', averageDelay: 12, totalTrains: 45, onTimeTrains: 38, delayedTrains: 7, signalChanges: 23, platformUtilization: 78 },
    { date: '2024-09-19', averageDelay: 8, totalTrains: 48, onTimeTrains: 42, delayedTrains: 6, signalChanges: 19, platformUtilization: 82 },
    { date: '2024-09-20', averageDelay: 15, totalTrains: 42, onTimeTrains: 33, delayedTrains: 9, signalChanges: 31, platformUtilization: 75 },
    { date: '2024-09-21', averageDelay: 6, totalTrains: 50, onTimeTrains: 47, delayedTrains: 3, signalChanges: 15, platformUtilization: 88 },
    { date: '2024-09-22', averageDelay: 11, totalTrains: 46, onTimeTrains: 39, delayedTrains: 7, signalChanges: 26, platformUtilization: 79 },
    { date: '2024-09-23', averageDelay: 9, totalTrains: 49, onTimeTrains: 43, delayedTrains: 6, signalChanges: 21, platformUtilization: 85 },
    { date: '2024-09-24', averageDelay: 7, totalTrains: 47, onTimeTrains: 44, delayedTrains: 3, signalChanges: 18, platformUtilization: 91 }
  ];

  const mockRouteData: RouteStats[] = [
    { route: 'Delhi-Mumbai', trainCount: 145, averageDelay: 12, onTimePercentage: 84 },
    { route: 'Chennai-Bangalore', trainCount: 98, averageDelay: 8, onTimePercentage: 89 },
    { route: 'Kolkata-Delhi', trainCount: 87, averageDelay: 15, onTimePercentage: 78 },
    { route: 'Mumbai-Pune', trainCount: 156, averageDelay: 6, onTimePercentage: 92 },
    { route: 'Hyderabad-Chennai', trainCount: 76, averageDelay: 11, onTimePercentage: 85 },
  ];

  const signalUsageData = [
    { name: 'Green Signals', value: 65, color: '#10B981' },
    { name: 'Yellow Signals', value: 25, color: '#F59E0B' },
    { name: 'Red Signals', value: 10, color: '#EF4444' },
  ];

  useEffect(() => {
    generateReportData();
  }, [reportType]);

  const generateReportData = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setReportData(mockDailyData);
      setRouteStats(mockRouteData);
      setLoading(false);
    }, 1000);
  };

  const downloadCSV = (data: any[], filename: string) => {
    const csvContent = csv.format(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalTrains = reportData.reduce((sum, day) => sum + day.totalTrains, 0);
  const totalOnTime = reportData.reduce((sum, day) => sum + day.onTimeTrains, 0);
  const averageDelayAcrossWeek = reportData.reduce((sum, day) => sum + day.averageDelay, 0) / reportData.length;
  const averageUtilization = reportData.reduce((sum, day) => sum + day.platformUtilization, 0) / reportData.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive railway operations analysis</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily Reports</SelectItem>
              <SelectItem value="weekly">Weekly Reports</SelectItem>
              <SelectItem value="monthly">Monthly Reports</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => downloadCSV(reportData, `railway-report-${reportType}`)}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Train className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Trains</p>
                <p className="text-2xl font-bold">{totalTrains}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">On-Time Rate</p>
                <p className="text-2xl font-bold">{Math.round((totalOnTime / totalTrains) * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Delay</p>
                <p className="text-2xl font-bold">{Math.round(averageDelayAcrossWeek)}m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Platform Usage</p>
                <p className="text-2xl font-bold">{Math.round(averageUtilization)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Train Delays Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileBarChart className="w-5 h-5 mr-2" />
              Average Delays Over Time
            </CardTitle>
            <CardDescription>Daily average delay in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value) => [`${value} minutes`, 'Average Delay']}
                />
                <Line 
                  type="monotone" 
                  dataKey="averageDelay" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Signal Usage Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Signal className="w-5 h-5 mr-2" />
              Signal Usage Statistics
            </CardTitle>
            <CardDescription>Current signal state distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={signalUsageData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {signalUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Train Count by Day */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Train Operations</CardTitle>
            <CardDescription>On-time vs delayed trains per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Bar dataKey="onTimeTrains" stackId="a" fill="#10B981" name="On-Time" />
                <Bar dataKey="delayedTrains" stackId="a" fill="#F59E0B" name="Delayed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Utilization</CardTitle>
            <CardDescription>Daily platform usage percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value) => [`${value}%`, 'Utilization']}
                />
                <Line 
                  type="monotone" 
                  dataKey="platformUtilization" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Busiest Routes */}
      <Card>
        <CardHeader>
          <CardTitle>Route Performance Analysis</CardTitle>
          <CardDescription>Performance metrics by railway route</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routeStats.map((route, index) => (
              <div key={route.route} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{route.route}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="text-sm text-muted-foreground">
                      <Train className="w-4 h-4 inline mr-1" />
                      {route.trainCount} trains
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {route.averageDelay}m avg delay
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={route.onTimePercentage >= 90 ? 'default' : 
                            route.onTimePercentage >= 80 ? 'secondary' : 'destructive'}
                    className="text-lg px-3 py-1"
                  >
                    {route.onTimePercentage}%
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">On-Time Rate</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Report Actions</CardTitle>
          <CardDescription>Generate and download detailed reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => downloadCSV(reportData, 'daily-operations-report')}
            >
              <Calendar className="w-6 h-6 mb-2" />
              Daily Report
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => downloadCSV(routeStats, 'route-performance-report')}
            >
              <TrendingUp className="w-6 h-6 mb-2" />
              Performance Report
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => downloadCSV(signalUsageData, 'signal-usage-report')}
            >
              <Signal className="w-6 h-6 mb-2" />
              Signal Usage Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;