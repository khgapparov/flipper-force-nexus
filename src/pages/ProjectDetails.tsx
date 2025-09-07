import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, MapPin, User, DollarSign, Camera, Clock, CheckCircle2, AlertCircle, FileText, Plus } from "lucide-react";
import { projectsApi, propertiesApi, projectUpdatesApi, type Project, type Property, type ProgressNote, type ProjectPhoto, type ProjectExpense } from "@/lib/api";
import ProjectActionDialog, { ActionType } from "@/components/project/ProjectActionDialog";

interface ProjectUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "milestone" | "issue" | "progress" | "photo";
  author: string;
}

interface PhotoHistory {
  id: string;
  url: string;
  title: string;
  date: string;
  description: string;
}

const mockUpdates: ProjectUpdate[] = [
  {
    id: "1",
    date: "2024-03-15",
    title: "Foundation Work Completed",
    description: "All foundation work has been completed ahead of schedule. Quality inspection passed with excellent ratings.",
    type: "milestone",
    author: "John Smith"
  },
  {
    id: "2", 
    date: "2024-03-10",
    title: "Weather Delay",
    description: "Construction delayed by 2 days due to heavy rainfall. All equipment secured and protected.",
    type: "issue",
    author: "Sarah Johnson"
  },
  {
    id: "3",
    date: "2024-03-08",
    title: "65% Progress Milestone",
    description: "Project has reached 65% completion. All major structural work on track for scheduled completion.",
    type: "progress",
    author: "Mike Davis"
  },
  {
    id: "4",
    date: "2024-03-05",
    title: "Site Progress Photos",
    description: "Weekly progress documentation showing framing and electrical rough-in work.",
    type: "photo",
    author: "Emily Chen"
  }
];

const mockPhotos: PhotoHistory[] = [
  {
    id: "1",
    url: "/placeholder.svg",
    title: "Foundation Completion",
    date: "2024-03-15",
    description: "Foundation work completed with quality inspection"
  },
  {
    id: "2",
    url: "/placeholder.svg", 
    title: "Framing Progress",
    date: "2024-03-10",
    description: "Second floor framing structure in progress"
  },
  {
    id: "3",
    url: "/placeholder.svg",
    title: "Electrical Rough-in",
    date: "2024-03-08", 
    description: "Electrical systems installation underway"
  },
  {
    id: "4",
    url: "/placeholder.svg",
    title: "Site Preparation",
    date: "2024-03-01",
    description: "Initial site preparation and excavation"
  }
];

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectStatus, setProjectStatus] = useState("active");
  const [project, setProject] = useState<Project | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<ActionType>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const projectData = await projectsApi.getById(id);
        setProject(projectData);
        
        // Try to fetch property data if available
        // Note: This would need propertyId association in the project data
        // For now, we'll use mock property data
        setProperty({
          id: "1",
          address: {
            street: projectData.address || "123 Main St",
            city: "Downtown",
            state: "CA",
            zipCode: "12345"
          },
          squareFootage: 2400,
          bedrooms: 4,
          bathrooms: 3,
          lotSize: 0.25,
          yearBuilt: 1985,
          propertyType: "Residential",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error("Failed to fetch project data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "milestone": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "issue": return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "progress": return <Clock className="h-4 w-4 text-blue-500" />;
      case "photo": return <Camera className="h-4 w-4 text-purple-500" />;
      default: return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const statusColors = {
    active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    completed: "bg-blue-500/10 text-blue-600 border-blue-500/20", 
    archived: "bg-gray-500/10 text-gray-600 border-gray-500/20"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Project not found</p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const budget = project.budget || 0;
  const currentSpend = project.currentSpend || 0;
  const progress = budget > 0 ? (currentSpend / budget) * 100 : 0;
  const budgetUtilized = budget > 0 ? (currentSpend / budget) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
              <p className="text-muted-foreground text-lg">{project.address}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={project.status || "active"} onValueChange={setProjectStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Badge className={`${statusColors[project.status as keyof typeof statusColors] || statusColors.active} font-medium px-4 py-2`}>
                {project.status?.toUpperCase() || 'UNKNOWN'}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <Button 
              onClick={() => {
                setCurrentAction("progress");
                setActionDialogOpen(true);
              }}
              className="gap-2 bg-gradient-primary hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Progress Note
            </Button>
            <Button 
              onClick={() => {
                setCurrentAction("photo");
                setActionDialogOpen(true);
              }}
              variant="outline"
              className="gap-2"
            >
              <Camera className="h-4 w-4" />
              Upload Photos
            </Button>
            <Button 
              onClick={() => {
                setCurrentAction("expense");
                setActionDialogOpen(true);
              }}
              variant="outline"
              className="gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Add Expense
            </Button>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-semibold">{new Date(project.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{project.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-semibold">${budget.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Current Spend</p>
                    <p className="font-semibold">${currentSpend.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
              <CardDescription>Current completion status and budget utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Budget Utilized</span>
                    <span className="text-sm text-muted-foreground">${currentSpend.toLocaleString()} / ${budget.toLocaleString()}</span>
                  </div>
                  <Progress value={budgetUtilized} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="updates" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="updates">Updates & Timeline</TabsTrigger>
            <TabsTrigger value="photos">Photo History</TabsTrigger>
            <TabsTrigger value="details">Project Details</TabsTrigger>
          </TabsList>

          <TabsContent value="updates" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Updates</CardTitle>
                <CardDescription>Timeline of project milestones, issues, and progress updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockUpdates.map((update, index) => (
                    <div key={update.id}>
                      <div className="flex items-start space-x-4">
                        <div className="mt-1">
                          {getUpdateIcon(update.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold">{update.title}</h4>
                            <span className="text-sm text-muted-foreground">{new Date(update.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-muted-foreground mb-2">{update.description}</p>
                          <p className="text-xs text-muted-foreground">By {update.author}</p>
                        </div>
                      </div>
                      {index < mockUpdates.length - 1 && <Separator className="my-6" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Photo History</CardTitle>
                <CardDescription>Visual documentation of project progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockPhotos.map((photo) => (
                    <div key={photo.id} className="space-y-3">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img 
                          src={photo.url} 
                          alt={photo.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">{photo.title}</h4>
                        <p className="text-sm text-muted-foreground">{photo.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(photo.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Project Type</label>
                      <p className="font-semibold">Property Renovation</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Budget</label>
                      <p className="font-semibold">${budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Current Spend</label>
                      <p className="font-semibold">${currentSpend.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <p className="font-semibold">{project.status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {property && (
                <Card>
                  <CardHeader>
                    <CardTitle>Property Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Address</span>
                        <span className="font-semibold text-right">
                          {property.address.street}<br />
                          {property.address.city}, {property.address.state} {property.address.zipCode}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Square Footage</span>
                        <span className="font-semibold">{property.squareFootage?.toLocaleString()} sq ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Bedrooms</span>
                        <span className="font-semibold">{property.bedrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Bathrooms</span>
                        <span className="font-semibold">{property.bathrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Year Built</span>
                        <span className="font-semibold">{property.yearBuilt}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Dialog */}
        <ProjectActionDialog
          projectId={id!}
          actionType={currentAction}
          open={actionDialogOpen}
          onOpenChange={setActionDialogOpen}
          onSuccess={() => {
            // Refresh data when an action is successfully completed
            // This would be implemented when we have real API integration
            console.log("Action completed successfully");
          }}
        />
      </div>
    </div>
  );
};

export default ProjectDetails;
