import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Home, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Plus, 
  Activity,
  Calendar,
  MapPin,
  Clock,
  Eye,
  FileText,
  Settings,
  Bell,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { projectsApi, type Project as ApiProject } from "@/lib/api";
import { CreateProjectDialog } from "@/components/project/CreateProjectDialog";
import { AddPropertyDialog } from "@/components/property/AddPropertyDialog";

interface Project {
  id: string;
  title: string;
  address: string;
  status: "Lead" | "Active" | "Sold" | "On Hold";
  progress: number;
  investment: number;
  currentValue: number;
  roi: number;
  lastUpdate: string;
  team: string[];
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Downtown Renovation",
    address: "123 Main St, Downtown",
    status: "Active",
    progress: 68,
    investment: 250000,
    currentValue: 320000,
    roi: 28,
    lastUpdate: "2 hours ago",
    team: ["John", "Maria", "Alex"]
  },
  {
    id: "2", 
    title: "Suburban Flip",
    address: "456 Oak Ave, Suburbs",
    status: "Lead",
    progress: 15,
    investment: 180000,
    currentValue: 195000,
    roi: 8.3,
    lastUpdate: "1 day ago",
    team: ["Sarah", "Mike"]
  },
  {
    id: "3",
    title: "Luxury Condo",
    address: "789 Park Blvd, Uptown",
    status: "Sold",
    progress: 100,
    investment: 400000,
    currentValue: 580000,
    roi: 45,
    lastUpdate: "3 days ago",
    team: ["Emma", "David", "Lisa", "Tom"]
  }
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [backendProjects, setBackendProjects] = useState<ApiProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching projects from backend...");
        const projects = await projectsApi.getAll();
        console.log("Backend projects (mapped):", projects);
        
        console.log("Total projects from backend:", projects.length);
        console.log("Project details:", projects.map(p => ({
          id: p.id,
          name: p.name,
          status: p.status,
          budget: p.budget,
          currentSpend: p.currentSpend,
          address: p.address,
          estimatedCompletion: p.estimatedCompletion
        })));

        setBackendProjects(projects);
        // Note: propertiesApi is not currently available in the API
        console.log("Properties API is not currently implemented");
      } catch (error) {
        console.error("Failed to fetch projects from backend:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBackendData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-gradient-success text-success-foreground";
      case "Lead": return "bg-gradient-warm text-warning-foreground";  
      case "Sold": return "bg-primary text-primary-foreground";
      case "On Hold": return "bg-muted text-muted-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  // Use backend data for calculations
  const totalInvestment = backendProjects.reduce((sum, project) => sum + (project.budget || 0), 0);
  const totalValue = backendProjects.reduce((sum, project) => sum + (project.currentSpend || 0), 0);
  const totalROI = totalInvestment > 0 ? ((totalValue - totalInvestment) / totalInvestment * 100) : 0;
  const activeProjectsCount = backendProjects.filter(p => p.status === "Active").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Home className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  FlipperForce
                </h1>
              </div>
              <Badge variant="secondary" className="font-medium">
                Dashboard
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening with your real estate portfolio today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card className="shadow-soft hover:shadow-elegant transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Investment
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${totalInvestment.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {backendProjects.length} properties
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elegant transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${totalValue.toLocaleString()}
              </div>
              <p className="text-xs text-success">
                +${(totalValue - totalInvestment).toLocaleString()} profit
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elegant transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average ROI
              </CardTitle>
              <Activity className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {totalROI.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Portfolio performance
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elegant transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Projects  
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {activeProjectsCount}
              </div>
              <p className="text-xs text-muted-foreground">
                In progress
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Recent Projects</h3>
              <CreateProjectDialog onProjectCreated={() => window.location.reload()} />
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading projects...</p>
                </div>
              ) : backendProjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No projects found</p>
                </div>
              ) : (
                backendProjects.map((project) => (
                <Card key={project.id} className="shadow-soft hover:shadow-elegant transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {project.address || "Address not specified"}
                        </CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(project.status)} font-medium`}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Budget</p>
                          <p className="font-semibold">${(project.budget || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current Spend</p>
                          <p className="font-semibold">${(project.currentSpend || 0).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            Created {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        {project.estimatedCompletion && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Estimated completion: {new Date(project.estimatedCompletion).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <AddPropertyDialog>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Property
                  </Button>
                </AddPropertyDialog>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Inspection
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Record Expense
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Downtown Renovation updated</p>
                      <p className="text-xs text-muted-foreground">Progress: 68% complete</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-warning mt-2"></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">New lead assigned</p>
                      <p className="text-xs text-muted-foreground">Suburban Flip project</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Project completed</p>
                      <p className="text-xs text-muted-foreground">Luxury Condo sold</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
