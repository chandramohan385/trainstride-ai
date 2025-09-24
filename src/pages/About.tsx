import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Train, 
  Target, 
  Users, 
  Trophy,
  ExternalLink,
  Github,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: "Railway Development Team",
      role: "Full Stack Developers",
      description: "Experienced in railway systems and modern web technologies"
    },
    {
      name: "AI/ML Specialists",
      role: "Machine Learning Engineers", 
      description: "Experts in predictive analytics and intelligent decision systems"
    },
    {
      name: "Railway Domain Experts",
      role: "Subject Matter Experts",
      description: "Deep understanding of Indian Railways operations and regulations"
    },
    {
      name: "UI/UX Designers",
      role: "Design Team",
      description: "Creating intuitive interfaces for complex railway operations"
    }
  ];

  const features = [
    {
      title: "Real-time Train Tracking",
      description: "Live monitoring of train positions, speeds, and schedules with GPS integration"
    },
    {
      title: "Intelligent Signal Control",
      description: "AI-powered signal management with automatic conflict detection and resolution"
    },
    {
      title: "Platform Management",
      description: "Efficient platform allocation and scheduling optimization"
    },
    {
      title: "Predictive Analytics",
      description: "Machine learning models for delay prediction and route optimization"
    },
    {
      title: "Interactive Dashboard",
      description: "Comprehensive control room interface with real-time metrics and alerts"
    },
    {
      title: "Mobile Responsive",
      description: "Access critical information from any device, anywhere"
    }
  ];

  const technologies = [
    "React.js", "TypeScript", "Tailwind CSS", "Supabase", "Real-time WebSockets",
    "Chart.js", "Machine Learning APIs", "GPS Integration", "PWA Ready"
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center mb-6">
          <div className="p-4 bg-primary/10 rounded-full">
            <Train className="w-12 h-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gradient-primary">TrainStride AI</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Revolutionizing Railway Traffic Control through Artificial Intelligence and Real-time Decision Support
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Smart India Hackathon 2024
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            India
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Project Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            TrainStride AI is an innovative Railway Traffic Control System developed for the Smart India Hackathon 2024. 
            Our solution addresses the critical challenges faced by railway section controllers in managing complex train 
            operations, signal coordination, and platform scheduling.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <Trophy className="w-4 h-4 mr-2 text-yellow-600" />
                Problem Statement
              </h3>
              <p className="text-sm text-muted-foreground">
                Indian Railways, being one of the world's largest railway networks, faces challenges in real-time 
                traffic management, delay prediction, and efficient resource allocation. Traditional systems lack 
                the intelligence and real-time capabilities needed for modern railway operations.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2 text-blue-600" />
                Our Solution
              </h3>
              <p className="text-sm text-muted-foreground">
                TrainStride AI provides an intelligent, real-time control system that empowers railway controllers 
                with AI-driven insights, predictive analytics, and automated decision support to optimize train 
                operations and improve passenger experience.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
          <CardDescription>Advanced capabilities for modern railway management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <h3 className="font-semibold text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>Modern technologies powering the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Development Team
          </CardTitle>
          <CardDescription>Passionate developers working on railway innovation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-primary">{member.role}</p>
                <p className="text-xs text-muted-foreground mt-2">{member.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact & Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expected Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Reduced Train Delays</p>
                <p className="text-xs text-muted-foreground">AI-powered prediction and prevention of delays</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Improved Safety</p>
                <p className="text-xs text-muted-foreground">Advanced signal control and conflict detection</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Enhanced Efficiency</p>
                <p className="text-xs text-muted-foreground">Optimized resource allocation and scheduling</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Better Passenger Experience</p>
                <p className="text-xs text-muted-foreground">Real-time updates and improved punctuality</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Future Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Mobile Application</p>
                <p className="text-xs text-muted-foreground">Native mobile apps for field controllers</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">IoT Integration</p>
                <p className="text-xs text-muted-foreground">Sensor networks for enhanced monitoring</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Blockchain Integration</p>
                <p className="text-xs text-muted-foreground">Secure and transparent ticketing system</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Advanced Analytics</p>
                <p className="text-xs text-muted-foreground">Deep learning for pattern recognition</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact & Links */}
      <Card>
        <CardHeader>
          <CardTitle>Connect With Us</CardTitle>
          <CardDescription>Get in touch for collaboration and feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" size="sm">
              <Github className="w-4 h-4 mr-2" />
              View Source Code
              <ExternalLink className="w-3 h-3 ml-2" />
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Contact Team
              <ExternalLink className="w-3 h-3 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground border-t pt-6">
        <p>© 2024 TrainStride AI - Smart India Hackathon Project</p>
        <p className="mt-1">Building the future of intelligent railway management</p>
      </div>
    </div>
  );
};

export default About;