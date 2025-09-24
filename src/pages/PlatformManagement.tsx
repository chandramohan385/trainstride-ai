import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Building2, 
  Clock, 
  Train, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PlatformData {
  id: string;
  platform_number: string;
  station_code: string;
  station_name: string;
  status: 'free' | 'occupied' | 'overdue';
  assigned_train_id: string | null;
  scheduled_arrival: string | null;
  scheduled_departure: string | null;
  track_number: string | null;
  capacity: number;
}

interface TrainData {
  id: string;
  train_number: string;
  train_name: string;
  status: string;
}

const PlatformManagement = () => {
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [trains, setTrains] = useState<TrainData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    // Set up real-time subscriptions
    const platformsChannel = supabase
      .channel('platform-management')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'platforms' }, 
        () => fetchPlatforms())
      .subscribe();

    const trainsChannel = supabase
      .channel('platform-trains')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trains' }, 
        () => fetchTrains())
      .subscribe();

    return () => {
      supabase.removeChannel(platformsChannel);
      supabase.removeChannel(trainsChannel);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchPlatforms(), fetchTrains()]);
    setLoading(false);
  };

  const fetchPlatforms = async () => {
    const { data } = await supabase
      .from('platforms')
      .select('*')
      .order('station_code')
      .order('platform_number');
    if (data) setPlatforms(data);
  };

  const fetchTrains = async () => {
    const { data } = await supabase
      .from('trains')
      .select('id, train_number, train_name, status');
    if (data) setTrains(data);
  };

  const getAssignedTrain = (trainId: string | null) => {
    if (!trainId) return null;
    return trains.find(train => train.id === trainId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'free': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'occupied': return <Train className="w-4 h-4 text-blue-600" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'free': return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  const isOverdue = (platform: PlatformData) => {
    if (!platform.scheduled_departure) return false;
    return new Date(platform.scheduled_departure) < new Date();
  };

  const platformStats = {
    total: platforms.length,
    free: platforms.filter(p => p.status === 'free').length,
    occupied: platforms.filter(p => p.status === 'occupied').length,
    overdue: platforms.filter(p => p.status === 'overdue').length,
  };

  const stationGroups = platforms.reduce((acc, platform) => {
    if (!acc[platform.station_code]) {
      acc[platform.station_code] = {
        name: platform.station_name,
        platforms: []
      };
    }
    acc[platform.station_code].platforms.push(platform);
    return acc;
  }, {} as Record<string, { name: string; platforms: PlatformData[] }>);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Platform Management</h1>
          <p className="text-muted-foreground">Monitor station platforms and track assignments</p>
        </div>
        <Button onClick={fetchData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{platformStats.total}</p>
            <p className="text-sm text-muted-foreground">Total Platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{platformStats.free}</p>
            <p className="text-sm text-muted-foreground">Free Platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Train className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-600">{platformStats.occupied}</p>
            <p className="text-sm text-muted-foreground">Occupied Platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">{platformStats.overdue}</p>
            <p className="text-sm text-muted-foreground">Overdue Platforms</p>
          </CardContent>
        </Card>
      </div>

      {/* Station-wise Platform Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(stationGroups).map(([stationCode, stationData]) => (
          <Card key={stationCode}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                {stationData.name} ({stationCode})
              </CardTitle>
              <CardDescription>
                {stationData.platforms.length} platforms - {' '}
                {stationData.platforms.filter(p => p.status === 'free').length} free, {' '}
                {stationData.platforms.filter(p => p.status === 'occupied').length} occupied, {' '}
                {stationData.platforms.filter(p => p.status === 'overdue').length} overdue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {stationData.platforms.map((platform) => {
                  const assignedTrain = getAssignedTrain(platform.assigned_train_id);
                  
                  return (
                    <div 
                      key={platform.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        platform.status === 'free' ? 'border-l-green-500 bg-green-50/50' :
                        platform.status === 'occupied' ? 'border-l-blue-500 bg-blue-50/50' :
                        'border-l-red-500 bg-red-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(platform.status)}
                          <span className="font-semibold">
                            Platform {platform.platform_number}
                          </span>
                          {platform.track_number && (
                            <Badge variant="outline" className="text-xs">
                              Track {platform.track_number}
                            </Badge>
                          )}
                        </div>
                        <Badge className={`${getStatusColor(platform.status)} capitalize`}>
                          {platform.status}
                        </Badge>
                      </div>

                      {assignedTrain && (
                        <div className="mb-2">
                          <p className="text-sm font-medium">
                            {assignedTrain.train_number} - {assignedTrain.train_name}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Arrival
                          </span>
                          <p className="font-mono text-xs">
                            {formatDateTime(platform.scheduled_arrival)}
                          </p>
                        </div>
                        <div>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Departure
                          </span>
                          <p className="font-mono text-xs">
                            {formatDateTime(platform.scheduled_departure)}
                          </p>
                        </div>
                      </div>

                      {isOverdue(platform) && platform.status === 'occupied' && (
                        <div className="mt-2 flex items-center text-red-600 text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Platform is overdue for departure
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Platform Table */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Details</CardTitle>
          <CardDescription>Complete platform information and scheduling</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Station</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Track</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Train</TableHead>
                <TableHead>Scheduled Arrival</TableHead>
                <TableHead>Scheduled Departure</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {platforms.map((platform) => {
                const assignedTrain = getAssignedTrain(platform.assigned_train_id);
                
                return (
                  <TableRow key={platform.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{platform.station_name}</div>
                        <div className="text-sm text-muted-foreground">{platform.station_code}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{platform.platform_number}</TableCell>
                    <TableCell>{platform.track_number || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(platform.status)}
                        <Badge className={`${getStatusColor(platform.status)} capitalize`}>
                          {platform.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {assignedTrain ? (
                        <div>
                          <div className="font-medium">{assignedTrain.train_number}</div>
                          <div className="text-sm text-muted-foreground">{assignedTrain.train_name}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatDateTime(platform.scheduled_arrival)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatDateTime(platform.scheduled_departure)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformManagement;