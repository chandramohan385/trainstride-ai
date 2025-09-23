import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Train, Circle, Square } from "lucide-react";

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

interface TrackVisualizationProps {
  trains: Train[];
}

interface TrackSection {
  id: string;
  name: string;
  type: "main" | "junction" | "yard";
  position: { x: number; y: number };
  connections: string[];
}

export function TrackVisualization({ trains }: TrackVisualizationProps) {
  const trackSections: TrackSection[] = [
    { id: "A", name: "Station A", type: "main", position: { x: 10, y: 50 }, connections: ["B"] },
    { id: "B", name: "Junction B", type: "junction", position: { x: 30, y: 50 }, connections: ["A", "C", "D"] },
    { id: "C", name: "Station C", type: "main", position: { x: 50, y: 30 }, connections: ["B", "E"] },
    { id: "D", name: "Yard D", type: "yard", position: { x: 50, y: 70 }, connections: ["B"] },
    { id: "E", name: "Station E", type: "main", position: { x: 70, y: 30 }, connections: ["C", "F"] },
    { id: "F", name: "Terminal F", type: "main", position: { x: 90, y: 50 }, connections: ["E"] },
  ];

  const getTrainAtSection = (sectionId: string) => {
    return trains.find(train => 
      train.currentLocation.includes(sectionId) || 
      train.currentLocation.includes(trackSections.find(s => s.id === sectionId)?.name || "")
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "text-status-running";
      case "delayed":
        return "text-status-delayed";
      case "stopped":
        return "text-status-stopped";
      case "maintenance":
        return "text-status-maintenance";
      default:
        return "text-muted-foreground";
    }
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "junction":
        return Square;
      case "yard":
        return Circle;
      default:
        return Circle;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Track Network Visualization</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-status-running"></div>
            <span>Running</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-status-delayed"></div>
            <span>Delayed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-status-stopped"></div>
            <span>Stopped</span>
          </div>
        </div>
      </div>

      <div className="relative bg-control-bg rounded-lg p-8 min-h-[400px] overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="text-control-border">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Track Connections */}
        <svg className="absolute inset-0 w-full h-full">
          {trackSections.map(section => 
            section.connections.map(connectionId => {
              const connectedSection = trackSections.find(s => s.id === connectionId);
              if (!connectedSection) return null;
              
              return (
                <line
                  key={`${section.id}-${connectionId}`}
                  x1={`${section.position.x}%`}
                  y1={`${section.position.y}%`}
                  x2={`${connectedSection.position.x}%`}
                  y2={`${connectedSection.position.y}%`}
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  className="opacity-60"
                />
              );
            })
          )}
        </svg>

        {/* Track Sections */}
        {trackSections.map(section => {
          const train = getTrainAtSection(section.id);
          const SectionIcon = getSectionIcon(section.type);
          
          return (
            <div
              key={section.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${section.position.x}%`,
                top: `${section.position.y}%`,
              }}
            >
              <div className="relative">
                {/* Section Node */}
                <div className={`
                  w-12 h-12 rounded-full border-2 flex items-center justify-center
                  ${train ? 'bg-primary/20 border-primary animate-pulse-glow' : 'bg-control-bg border-control-border'}
                  transition-all duration-200
                `}>
                  <SectionIcon className={`w-6 h-6 ${train ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>

                {/* Section Label */}
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <Badge variant="outline" className="text-xs">
                    {section.name}
                  </Badge>
                </div>

                {/* Train at Section */}
                {train && (
                  <div className="absolute -top-2 -right-2">
                    <div className={`
                      w-6 h-6 rounded-full border-2 border-background flex items-center justify-center
                      ${getStatusColor(train.status)} animate-train-move
                    `}>
                      <Train className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Signal Indicators */}
        <div className="absolute bottom-4 left-4 space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Signal Status</div>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-signal-green animate-pulse-glow"></div>
              <span className="text-xs">Green (Go)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-signal-yellow"></div>
              <span className="text-xs">Yellow (Caution)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-signal-red"></div>
              <span className="text-xs">Red (Stop)</span>
            </div>
          </div>
        </div>

        {/* Network Stats */}
        <div className="absolute bottom-4 right-4 text-right">
          <div className="text-sm font-medium text-muted-foreground mb-1">Network Load</div>
          <div className="flex items-center space-x-2">
            <div className="w-20 h-2 bg-control-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-status-running to-status-delayed transition-all duration-500"
                style={{ width: `${(trains.filter(t => t.status === 'running').length / trains.length) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs font-mono">
              {Math.round((trains.filter(t => t.status === 'running').length / trains.length) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}