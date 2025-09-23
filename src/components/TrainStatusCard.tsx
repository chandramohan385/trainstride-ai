import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Train, Clock, MapPin, AlertTriangle, Zap } from "lucide-react";

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

interface TrainStatusCardProps {
  train: Train;
}

export function TrainStatusCard({ train }: TrainStatusCardProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "running":
        return "status-running";
      case "delayed":
        return "status-delayed";
      case "stopped":
        return "status-stopped";
      case "maintenance":
        return "status-maintenance";
      default:
        return "";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <Zap className="w-4 h-4 text-status-stopped" />;
      case "medium":
        return <AlertTriangle className="w-4 h-4 text-status-delayed" />;
      case "low":
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "express":
        return "bg-primary/10 text-primary border-primary/30";
      case "local":
        return "bg-chart-secondary/10 text-chart-secondary border-chart-secondary/30";
      case "freight":
        return "bg-muted text-muted-foreground border-muted-foreground/30";
      case "special":
        return "bg-status-maintenance/10 text-status-maintenance border-status-maintenance/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-200 animate-fade-in">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Train className="w-5 h-5 text-primary animate-train-move" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{train.number}</h3>
              <p className="text-sm text-muted-foreground">{train.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getPriorityIcon(train.priority)}
            <Badge className={getTypeColor(train.type)}>
              {train.type.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <Badge className={`${getStatusClass(train.status)} font-medium`}>
            {train.status.charAt(0).toUpperCase() + train.status.slice(1)}
          </Badge>
          {train.delay > 0 && (
            <div className="flex items-center space-x-1 text-status-delayed">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">+{train.delay}min</span>
            </div>
          )}
        </div>

        {/* Location Info */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Current:</span>
            <span className="font-medium">{train.currentLocation}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-4 h-4 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"></div>
            </div>
            <span className="text-muted-foreground">Destination:</span>
            <span className="font-medium">{train.destination}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 control-button"
          >
            Track
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 control-button"
          >
            Control
          </Button>
        </div>
      </div>
    </Card>
  );
}