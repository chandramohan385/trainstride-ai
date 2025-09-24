import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Clock, 
  Navigation, 
  Filter,
  Search,
  RefreshCw,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TrainData {
  id: string;
  train_number: string;
  train_name: string;
  status: 'running' | 'delayed' | 'stopped' | 'maintenance';
  train_type: 'passenger' | 'express' | 'freight' | 'special';
  current_location: string;
  destination: string;
  origin: string;
  delay_minutes: number;
  latitude: number;
  longitude: number;
  speed_kmh: number;
  scheduled_arrival: string;
  scheduled_departure: string;
}

const TrainMovements = () => {
  const [trains, setTrains] = useState<TrainData[]>([]);
  const [filteredTrains, setFilteredTrains] = useState<TrainData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrain, setSelectedTrain] = useState<TrainData | null>(null);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    search: ''
  });

  useEffect(() => {
    fetchTrains();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('train-movements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trains' }, 
        () => fetchTrains())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [trains, filters]);

  const fetchTrains = async () => {
    setLoading(true);
    const { data } = await supabase.from('trains').select('*').order('train_number');
    if (data) {
      setTrains(data);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = trains;

    if (filters.type !== 'all') {
      filtered = filtered.filter(train => train.train_type === filters.type);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(train => train.status === filters.status);
    }

    if (filters.search) {
      filtered = filtered.filter(train => 
        train.train_number.toLowerCase().includes(filters.search.toLowerCase()) ||
        train.train_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        train.current_location.toLowerCase().includes(filters.search.toLowerCase()) ||
        train.destination.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredTrains(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'delayed': return 'bg-yellow-500';
      case 'stopped': return 'bg-red-500';
      case 'maintenance': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'running': return 'default';
      case 'delayed': return 'secondary';
      case 'stopped': return 'destructive';
      case 'maintenance': return 'outline';
      default: return 'secondary';
    }
  };

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
          <h1 className="text-2xl font-bold">Train Movements</h1>
          <p className="text-muted-foreground">Real-time train tracking and location monitoring</p>
        </div>
        <Button onClick={fetchTrains} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Train number, name, location..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Train Type</label>
              <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="passenger">Passenger</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="freight">Freight</SelectItem>
                  <SelectItem value="special">Special</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="stopped">Stopped</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => setFilters({ type: 'all', status: 'all', search: '' })}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Train Location Map
          </CardTitle>
          <CardDescription>Interactive map showing real-time train positions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-96 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-lg border-2 border-dashed border-border overflow-hidden">
            {/* Simulated India Map Background */}
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                <path d="M50,50 Q100,30 150,50 T250,80 Q300,100 350,120 L340,180 Q300,200 250,190 T150,170 Q100,160 50,140 Z" 
                      fill="currentColor" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            
            {/* Train Markers */}
            {filteredTrains.map((train, index) => (
              <div
                key={train.id}
                className={`absolute w-4 h-4 rounded-full ${getStatusColor(train.status)} cursor-pointer transform -translate-x-1/2 -translate-y-1/2 animate-pulse-glow`}
                style={{
                  left: `${20 + (index * 60) % 300}px`,
                  top: `${60 + (index * 40) % 200}px`
                }}
                onClick={() => setSelectedTrain(train)}
                title={`${train.train_name} - ${train.status}`}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background border rounded px-2 py-1 text-xs font-medium opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                  {train.train_number}
                </div>
              </div>
            ))}
            
            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border rounded-lg p-3">
              <h4 className="text-sm font-medium mb-2">Status Legend</h4>
              <div className="space-y-1">
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Running ({trains.filter(t => t.status === 'running').length})
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  Delayed ({trains.filter(t => t.status === 'delayed').length})
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  Stopped ({trains.filter(t => t.status === 'stopped').length})
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  Maintenance ({trains.filter(t => t.status === 'maintenance').length})
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Train List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Train List ({filteredTrains.length})</CardTitle>
            <CardDescription>Click on a train to view details</CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {filteredTrains.map((train) => (
                <div
                  key={train.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedTrain?.id === train.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedTrain(train)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusBadgeVariant(train.status)} className="text-xs">
                        {train.status}
                      </Badge>
                      <span className="font-medium">{train.train_number}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Zap className="w-3 h-3 mr-1" />
                      {train.speed_kmh} km/h
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-sm mb-1">{train.train_name}</h3>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {train.current_location}
                    </div>
                    <div className="flex items-center">
                      <Navigation className="w-3 h-3 mr-1" />
                      {train.origin} → {train.destination}
                    </div>
                    {train.delay_minutes > 0 && (
                      <div className="flex items-center text-yellow-600">
                        <Clock className="w-3 h-3 mr-1" />
                        Delayed by {train.delay_minutes} minutes
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Train Details */}
        <Card>
          <CardHeader>
            <CardTitle>Train Details</CardTitle>
            <CardDescription>
              {selectedTrain ? `Information for ${selectedTrain.train_name}` : 'Select a train to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedTrain ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Train Number</label>
                    <p className="text-lg font-semibold">{selectedTrain.train_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <p className="text-lg font-semibold capitalize">{selectedTrain.train_type}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Train Name</label>
                  <p className="text-lg font-semibold">{selectedTrain.train_name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Origin</label>
                    <p className="font-medium">{selectedTrain.origin}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Destination</label>
                    <p className="font-medium">{selectedTrain.destination}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Location</label>
                  <p className="font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    {selectedTrain.current_location}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Speed</label>
                    <p className="font-medium flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                      {selectedTrain.speed_kmh} km/h
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge variant={getStatusBadgeVariant(selectedTrain.status)} className="mt-1">
                      {selectedTrain.status}
                    </Badge>
                  </div>
                </div>

                {selectedTrain.delay_minutes > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Delay</label>
                    <p className="font-medium text-yellow-600 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {selectedTrain.delay_minutes} minutes
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <label className="text-sm font-medium text-muted-foreground">Coordinates</label>
                  <p className="text-sm font-mono">
                    {selectedTrain.latitude?.toFixed(6)}, {selectedTrain.longitude?.toFixed(6)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a train from the list or map to view detailed information</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainMovements;