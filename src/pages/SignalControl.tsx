import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Radio, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  RefreshCw,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SignalData {
  id: string;
  signal_code: string;
  signal_name: string;
  state: 'green' | 'yellow' | 'red';
  location: string;
  section: string;
  is_automatic: boolean;
  last_changed_at: string;
}

const SignalControl = () => {
  const [signals, setSignals] = useState<SignalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSignal, setSelectedSignal] = useState<SignalData | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [newState, setNewState] = useState<'green' | 'yellow' | 'red'>('red');
  const { toast } = useToast();

  useEffect(() => {
    fetchSignals();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('signal-control')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'signals' }, 
        () => fetchSignals())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSignals = async () => {
    setLoading(true);
    const { data } = await supabase.from('signals').select('*').order('signal_code');
    if (data) {
      setSignals(data);
    }
    setLoading(false);
  };

  const handleSignalChange = async () => {
    if (!selectedSignal) return;

    const { error } = await supabase
      .from('signals')
      .update({ 
        state: newState,
        last_changed_at: new Date().toISOString()
      })
      .eq('id', selectedSignal.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update signal state",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signal Updated",
        description: `${selectedSignal.signal_name} changed to ${newState.toUpperCase()}`,
      });
    }

    setShowConfirmDialog(false);
    setSelectedSignal(null);
  };

  const getSignalIcon = (state: string) => {
    switch (state) {
      case 'green': return <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse-glow"></div>;
      case 'yellow': return <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse-glow"></div>;
      case 'red': return <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse-glow"></div>;
      default: return <div className="w-4 h-4 bg-gray-500 rounded-full"></div>;
    }
  };

  const getSignalColor = (state: string) => {
    switch (state) {
      case 'green': return 'text-green-600 bg-green-50 border-green-200';
      case 'yellow': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'red': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const signalStats = {
    total: signals.length,
    green: signals.filter(s => s.state === 'green').length,
    yellow: signals.filter(s => s.state === 'yellow').length,
    red: signals.filter(s => s.state === 'red').length,
    automatic: signals.filter(s => s.is_automatic).length,
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
          <h1 className="text-2xl font-bold">Signal Control</h1>
          <p className="text-muted-foreground">Manage railway signals and track sections</p>
        </div>
        <Button onClick={fetchSignals} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Signals
        </Button>
      </div>

      {/* Signal Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Radio className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{signalStats.total}</p>
            <p className="text-sm text-muted-foreground">Total Signals</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{signalStats.green}</p>
            <p className="text-sm text-muted-foreground">Green Signals</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{signalStats.yellow}</p>
            <p className="text-sm text-muted-foreground">Yellow Signals</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">{signalStats.red}</p>
            <p className="text-sm text-muted-foreground">Red Signals</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{signalStats.automatic}</p>
            <p className="text-sm text-muted-foreground">Automatic</p>
          </CardContent>
        </Card>
      </div>

      {/* Signal Map View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Signal Network Map
          </CardTitle>
          <CardDescription>Visual representation of signal positions and states</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-80 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg border overflow-hidden">
            {/* Railway Track Representation */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 300">
              {/* Main Track Lines */}
              <line x1="50" y1="150" x2="750" y2="150" stroke="currentColor" strokeWidth="4" className="text-muted-foreground" />
              <line x1="50" y1="160" x2="750" y2="160" stroke="currentColor" strokeWidth="4" className="text-muted-foreground" />
              
              {/* Branch Lines */}
              <line x1="200" y1="150" x2="200" y2="80" stroke="currentColor" strokeWidth="3" className="text-muted-foreground" />
              <line x1="400" y1="150" x2="400" y2="220" stroke="currentColor" strokeWidth="3" className="text-muted-foreground" />
              <line x1="600" y1="150" x2="600" y2="80" stroke="currentColor" strokeWidth="3" className="text-muted-foreground" />
              
              {/* Section Labels */}
              <text x="125" y="140" className="text-xs fill-current text-muted-foreground">Section A</text>
              <text x="325" y="140" className="text-xs fill-current text-muted-foreground">Section B</text>
              <text x="525" y="140" className="text-xs fill-current text-muted-foreground">Section C</text>
            </svg>

            {/* Signal Markers */}
            {signals.map((signal, index) => {
              const x = 100 + (index * 120) % 600;
              const y = signal.section === 'Section A' && index % 3 === 1 ? 80 : 
                       signal.section === 'Section B' && index % 3 === 2 ? 220 : 150;
              
              return (
                <div
                  key={signal.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ left: `${x}px`, top: `${y}px` }}
                  onClick={() => {
                    setSelectedSignal(signal);
                    setNewState(signal.state === 'green' ? 'red' : signal.state === 'red' ? 'yellow' : 'green');
                    setShowConfirmDialog(true);
                  }}
                >
                  <div className={`w-8 h-12 bg-gray-800 rounded-t-full flex flex-col items-center justify-center space-y-1 border-2 border-gray-600`}>
                    <div className={`w-2 h-2 rounded-full ${signal.state === 'red' ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                    <div className={`w-2 h-2 rounded-full ${signal.state === 'yellow' ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
                    <div className={`w-2 h-2 rounded-full ${signal.state === 'green' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-background border rounded px-1 text-xs whitespace-nowrap">
                    {signal.signal_code}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Signal List */}
      <Card>
        <CardHeader>
          <CardTitle>Signal Status List</CardTitle>
          <CardDescription>Click on any signal to change its state</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {signals.map((signal) => (
              <Card 
                key={signal.id} 
                className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${
                  signal.state === 'green' ? 'border-l-green-500' :
                  signal.state === 'yellow' ? 'border-l-yellow-500' : 'border-l-red-500'
                }`}
                onClick={() => {
                  setSelectedSignal(signal);
                  setNewState(signal.state === 'green' ? 'red' : signal.state === 'red' ? 'yellow' : 'green');
                  setShowConfirmDialog(true);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getSignalIcon(signal.state)}
                      <span className="font-bold text-lg">{signal.signal_code}</span>
                    </div>
                    <Badge 
                      className={`${getSignalColor(signal.state)} capitalize`}
                      variant="outline"
                    >
                      {signal.state}
                    </Badge>
                  </div>

                  <h3 className="font-semibold mb-2">{signal.signal_name}</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-2" />
                      {signal.location}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Radio className="w-3 h-3 mr-2" />
                      {signal.section}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {signal.is_automatic ? 'Automatic' : 'Manual'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(signal.last_changed_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Signal Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change signal <strong>{selectedSignal?.signal_code}</strong> 
              ({selectedSignal?.signal_name}) from <strong>{selectedSignal?.state?.toUpperCase()}</strong> to{' '}
              <strong>{newState.toUpperCase()}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignalChange}>
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SignalControl;