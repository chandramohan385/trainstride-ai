import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Pause, 
  Square, 
  AlertTriangle, 
  Settings, 
  Zap, 
  Route,
  Clock,
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

interface ControlPanelProps {
  trains: Train[];
  setTrains: (trains: Train[]) => void;
}

export function ControlPanel({ trains, setTrains }: ControlPanelProps) {
  const [selectedTrain, setSelectedTrain] = useState<string>("");
  const [actionType, setActionType] = useState<string>("");
  const [reasoning, setReasoning] = useState<string>("");
  const [newDelay, setNewDelay] = useState<string>("");
  const { toast } = useToast();

  const handleAction = () => {
    if (!selectedTrain || !actionType) {
      toast({
        title: "Missing Information",
        description: "Please select a train and action type.",
        variant: "destructive",
      });
      return;
    }

    const train = trains.find(t => t.id === selectedTrain);
    if (!train) return;

    let newStatus: Train['status'] = train.status;
    let delay = train.delay;

    switch (actionType) {
      case "proceed":
        newStatus = "running";
        delay = 0;
        break;
      case "hold":
        newStatus = "stopped";
        break;
      case "reroute":
        newStatus = "running";
        delay = parseInt(newDelay) || train.delay;
        break;
      case "maintenance":
        newStatus = "maintenance";
        break;
    }

    const updatedTrains = trains.map(t => 
      t.id === selectedTrain 
        ? { ...t, status: newStatus, delay }
        : t
    );

    setTrains(updatedTrains);

    toast({
      title: "Action Executed",
      description: `${train.number} - ${actionType.charAt(0).toUpperCase() + actionType.slice(1)} command issued.`,
    });

    // Reset form
    setSelectedTrain("");
    setActionType("");
    setReasoning("");
    setNewDelay("");
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "proceed":
        return <Play className="w-4 h-4" />;
      case "hold":
        return <Pause className="w-4 h-4" />;
      case "reroute":
        return <Route className="w-4 h-4" />;
      case "maintenance":
        return <Settings className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const criticalTrains = trains.filter(t => 
    t.status === "stopped" || t.delay > 30 || t.priority === "high"
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Decision Support Panel */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6 control-panel">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-primary" />
            Train Control Decision Center
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="train-select">Select Train</Label>
                <Select value={selectedTrain} onValueChange={setSelectedTrain}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a train to control" />
                  </SelectTrigger>
                  <SelectContent>
                    {trains.map(train => (
                      <SelectItem key={train.id} value={train.id}>
                        {train.number} - {train.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="action-select">Control Action</Label>
                <Select value={actionType} onValueChange={setActionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proceed">
                      <div className="flex items-center">
                        <Play className="w-4 h-4 mr-2" />
                        Proceed
                      </div>
                    </SelectItem>
                    <SelectItem value="hold">
                      <div className="flex items-center">
                        <Pause className="w-4 h-4 mr-2" />
                        Hold/Stop
                      </div>
                    </SelectItem>
                    <SelectItem value="reroute">
                      <div className="flex items-center">
                        <Route className="w-4 h-4 mr-2" />
                        Reroute
                      </div>
                    </SelectItem>
                    <SelectItem value="maintenance">
                      <div className="flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Maintenance
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {actionType === "reroute" && (
                <div>
                  <Label htmlFor="delay-input">Expected Delay (minutes)</Label>
                  <Input
                    id="delay-input"
                    type="number"
                    value={newDelay}
                    onChange={(e) => setNewDelay(e.target.value)}
                    placeholder="Enter delay in minutes"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="reasoning">Decision Reasoning</Label>
                <Textarea
                  id="reasoning"
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  placeholder="Explain the reasoning behind this decision..."
                  className="min-h-[120px]"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <Button 
              onClick={handleAction}
              className="flex items-center space-x-2"
              disabled={!selectedTrain || !actionType}
            >
              {getActionIcon(actionType)}
              <span>Execute Command</span>
            </Button>
            <Button variant="outline" className="control-button">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Simulate Impact
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Quick Actions</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="control-button flex-col h-auto py-4">
              <CheckCircle className="w-6 h-6 mb-2 text-status-running" />
              <span className="text-xs">Clear All</span>
            </Button>
            <Button variant="outline" className="control-button flex-col h-auto py-4">
              <AlertTriangle className="w-6 h-6 mb-2 text-status-delayed" />
              <span className="text-xs">Emergency Stop</span>
            </Button>
            <Button variant="outline" className="control-button flex-col h-auto py-4">
              <Route className="w-6 h-6 mb-2 text-primary" />
              <span className="text-xs">Auto Route</span>
            </Button>
            <Button variant="outline" className="control-button flex-col h-auto py-4">
              <Settings className="w-6 h-6 mb-2 text-muted-foreground" />
              <span className="text-xs">System Config</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Critical Alerts & AI Recommendations */}
      <div className="space-y-6">
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-status-delayed" />
            Critical Alerts
          </h4>
          <div className="space-y-3">
            {criticalTrains.map(train => (
              <div key={train.id} className="p-3 bg-control-bg rounded-lg border border-control-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{train.number}</span>
                  <Badge className={`
                    ${train.status === 'stopped' ? 'status-stopped' : 
                      train.delay > 30 ? 'status-delayed' : 'status-running'}
                  `}>
                    {train.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {train.currentLocation}
                  {train.delay > 0 && ` • Delayed ${train.delay}min`}
                </p>
              </div>
            ))}
            {criticalTrains.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-status-running" />
                <p className="text-sm">All systems operating normally</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-primary" />
            AI Recommendations
          </h4>
          <div className="space-y-3">
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 animate-pulse-glow"></div>
                <div>
                  <p className="text-sm font-medium">Optimize Junction B</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Consider holding Train 56789 to allow express priority
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-status-delayed/5 border border-status-delayed/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 rounded-full bg-status-delayed mt-2 animate-pulse-glow"></div>
                <div>
                  <p className="text-sm font-medium">Weather Alert</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Heavy rain expected in 2 hours - prepare contingency routes
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-status-running/5 border border-status-running/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 rounded-full bg-status-running mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Performance Boost</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current efficiency: 94% - above target performance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}