import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Train, 
  Clock, 
  AlertTriangle, 
  Activity, 
  Users,
  TrendingUp,
  TrendingDown,
  Signal
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface TrainData {
  id: string;
  train_number: string;
  train_name: string;
  status: 'running' | 'delayed' | 'stopped' | 'maintenance';
  train_type: 'passenger' | 'express' | 'freight' | 'special';
  current_location: string;
  destination: string;
  delay_minutes: number;
}

interface SignalData {
  id: string;
  signal_code: string;
  signal_name: string;
  state: 'green' | 'yellow' | 'red';
}

interface PlatformData {
  id: string;
  platform_number: string;
  station_name: string;
  status: 'free' | 'occupied' | 'overdue';
}

const Dashboard = () => {
  const [trains, setTrains] = useState<TrainData[]>([]);
  const [signals, setSignals] = useState<SignalData[]>([]);
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock delay data for charts
  const delayData = [
    { time: '00:00', delays: 2 },
    { time: '04:00', delays: 1 },
    { time: '08:00', delays: 5 },
    { time: '12:00', delays: 3 },
    { time: '16:00', delays: 7 },
    { time: '20:00', delays: 4 },
  ];

  const routeData = [
    { route: 'Delhi-Mumbai', trains: 45 },
    { route: 'Chennai-Bangalore', trains: 32 },
    { route: 'Kolkata-Delhi', trains: 28 },
    { route: 'Mumbai-Pune', trains: 52 },
  ];

  useEffect(() => {
    fetchData();
    
    // Set up real-time subscriptions
    const trainsChannel = supabase
      .channel('trains-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trains' }, 
        () => fetchTrains())
      .subscribe();

    const signalsChannel = supabase
      .channel('signals-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'signals' }, 
        () => fetchSignals())
      .subscribe();

    const platformsChannel = supabase
      .channel('platforms-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'platforms' }, 
        () => fetchPlatforms())
      .subscribe();

    return () => {
      supabase.removeChannel(trainsChannel);
      supabase.removeChannel(signalsChannel);
      supabase.removeChannel(platformsChannel);
    };
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchTrains(), fetchSignals(), fetchPlatforms()]);
    setLoading(false);
  };

  const fetchTrains = async () => {
    const { data } = await supabase.from('trains').select('*');
    if (data) setTrains(data);
  };

  const fetchSignals = async () => {
    const { data } = await supabase.from('signals').select('*');
    if (data) setSignals(data);
  };

  const fetchPlatforms = async () => {
    const { data } = await supabase.from('platforms').select('*');
    if (data) setPlatforms(data);
  };

  const trainStats = {
    total: trains.length,
    running: trains.filter(t => t.status === 'running').length,
    delayed: trains.filter(t => t.status === 'delayed').length,
    stopped: trains.filter(t => t.status === 'stopped').length,
    maintenance: trains.filter(t => t.status === 'maintenance').length,
  };

  const signalStats = {
    total: signals.length,
    green: signals.filter(s => s.state === 'green').length,
    yellow: signals.filter(s => s.state === 'yellow').length,
    red: signals.filter(s => s.state === 'red').length,
  };

  const platformStats = {
    total: platforms.length,
    free: platforms.filter(p => p.status === 'free').length,
    occupied: platforms.filter(p => p.status === 'occupied').length,
    overdue: platforms.filter(p => p.status === 'overdue').length,
  };

  const pieData = [
    { name: 'On-Time', value: trainStats.running, color: 'hsl(var(--status-running))' },
    { name: 'Delayed', value: trainStats.delayed, color: 'hsl(var(--status-delayed))' },
    { name: 'Stopped', value: trainStats.stopped, color: 'hsl(var(--status-stopped))' },
    { name: 'Maintenance', value: trainStats.maintenance, color: 'hsl(var(--status-maintenance))' },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Trains Running</p>
                <p className="text-3xl font-bold text-status-running">{trainStats.running}</p>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2 from yesterday
                </p>
              </div>
              <div className="p-3 bg-status-running/10 rounded-full">
                <Train className="w-6 h-6 text-status-running" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trains On-Time</p>
                <p className="text-3xl font-bold text-status-running">{trainStats.running}</p>
                <Progress value={(trainStats.running / trainStats.total) * 100} className="mt-2" />
              </div>
              <div className="p-3 bg-status-running/10 rounded-full">
                <Activity className="w-6 h-6 text-status-running" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trains Delayed</p>
                <p className="text-3xl font-bold text-status-delayed">{trainStats.delayed}</p>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -1 from yesterday
                </p>
              </div>
              <div className="p-3 bg-status-delayed/10 rounded-full">
                <Clock className="w-6 h-6 text-status-delayed" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Signals</p>
                <p className="text-3xl font-bold text-primary">{signalStats.green}</p>
                <p className="text-xs text-muted-foreground">/ {signalStats.total} total</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Signal className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Train Delays Over Time</CardTitle>
            <CardDescription>Number of delayed trains throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={delayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="delays" 
                  stroke="hsl(var(--status-delayed))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>On-Time vs Delayed Trains</CardTitle>
            <CardDescription>Current status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Busiest Routes and Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Busiest Routes</CardTitle>
            <CardDescription>Train count by route today</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={routeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="route" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="trains" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Latest system notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {trains.filter(t => t.status === 'delayed' || t.status === 'stopped').slice(0, 5).map((train) => (
              <div key={train.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className={`w-2 h-2 rounded-full ${
                  train.status === 'delayed' ? 'bg-status-delayed animate-pulse-glow' : 
                  train.status === 'stopped' ? 'bg-status-stopped animate-pulse-glow' : 
                  'bg-status-maintenance'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    Train {train.train_number} ({train.train_name})
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {train.status === 'delayed' ? `Delayed by ${train.delay_minutes} minutes` : 
                     train.status === 'stopped' ? `Stopped at ${train.current_location}` : 
                     'Under maintenance'}
                  </p>
                </div>
                <Badge variant={
                  train.status === 'delayed' ? 'secondary' : 
                  train.status === 'stopped' ? 'destructive' : 'outline'
                }>
                  {train.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Platform Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Platform Status Overview
          </CardTitle>
          <CardDescription>Current platform utilization across stations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-2xl font-bold text-green-600">{platformStats.free}</p>
              <p className="text-sm text-muted-foreground">Free Platforms</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <p className="text-2xl font-bold text-orange-600">{platformStats.occupied}</p>
              <p className="text-sm text-muted-foreground">Occupied Platforms</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-2xl font-bold text-red-600">{platformStats.overdue}</p>
              <p className="text-sm text-muted-foreground">Overdue Platforms</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;