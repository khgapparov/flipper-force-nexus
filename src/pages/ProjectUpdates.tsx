import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, DollarSign, FileText, Camera, Loader2 } from "lucide-react";
import { projectsApi, galleryApi } from "@/lib/api";

interface ProgressUpdateForm {
  progressNote: string;
}

interface PhotoUploadForm {
  photos: FileList | null;
  description: string;
}

interface ExpenseForm {
  receipt: File | null;
  amount: string;
  vendor: string;
  description: string;
}

const ProjectUpdates = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form states
  const [progressForm, setProgressForm] = useState<ProgressUpdateForm>({
    progressNote: ""
  });
  const [photoForm, setPhotoForm] = useState<PhotoUploadForm>({
    photos: null,
    description: ""
  });
  const [expenseForm, setExpenseForm] = useState<ExpenseForm>({
    receipt: null,
    amount: "",
    vendor: "",
    description: ""
  });

  // Loading states
  const [progressLoading, setProgressLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  // Check project access on component mount
  useEffect(() => {
    const checkProjectAccess = async () => {
      if (!projectId) {
        toast({
          title: "Error",
          description: "Project ID is missing.",
          variant: "destructive"
        });
        navigate("/dashboard");
        return;
      }

      try {
        // Try to fetch the project to verify it exists and user has access
        const project = await projectsApi.getById(projectId);
        setHasAccess(true);
      } catch (error: any) {
        console.error("Project access check failed:", error);
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this project.",
          variant: "destructive"
        });
        navigate("/dashboard");
        return;
      } finally {
        setPageLoading(false);
      }
    };

    checkProjectAccess();
  }, [projectId, navigate, toast]);

  // Show loading state while checking access
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading project...</span>
        </div>
      </div>
    );
  }

  // If no access, return null (navigation will happen in useEffect)
  if (!hasAccess) {
    return null;
  }

  // Mock API calls
  const submitProgressUpdate = async (data: ProgressUpdateForm) => {
    console.log("Submitting progress update:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  };

  const submitPhotoUpload = async (data: PhotoUploadForm) => {
    console.log("Submitting photo upload:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true };
  };

  const submitExpense = async (data: ExpenseForm) => {
    console.log("Submitting expense:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    return { success: true };
  };

  // Form handlers
  const handleProgressSubmit = async () => {
    if (!progressForm.progressNote.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a progress note.",
        variant: "destructive"
      });
      return;
    }

    setProgressLoading(true);
    try {
      await submitProgressUpdate(progressForm);
      toast({
        title: "Progress Update Submitted",
        description: "Your progress note has been added to the project timeline."
      });
      setProgressForm({ progressNote: "" });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your progress update.",
        variant: "destructive"
      });
    } finally {
      setProgressLoading(false);
    }
  };

  const handlePhotoSubmit = async () => {
    if (!photoForm.photos || photoForm.photos.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one photo to upload.",
        variant: "destructive"
      });
      return;
    }

    if (!photoForm.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a description for the photos.",
        variant: "destructive"
      });
      return;
    }

    setPhotoLoading(true);
    try {
      await submitPhotoUpload(photoForm);
      toast({
        title: "Photos Uploaded",
        description: "Your photos have been added to the project gallery."
      });
      setPhotoForm({ photos: null, description: "" });
      // Reset file input
      const fileInput = document.querySelector('input[type="file"][multiple]') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your photos.",
        variant: "destructive"
      });
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleExpenseSubmit = async () => {
    if (!expenseForm.receipt) {
      toast({
        title: "Validation Error",
        description: "Please upload a receipt image.",
        variant: "destructive"
      });
      return;
    }

    if (!expenseForm.amount || isNaN(Number(expenseForm.amount)) || Number(expenseForm.amount) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }

    if (!expenseForm.vendor.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter the vendor name.",
        variant: "destructive"
      });
      return;
    }

    if (!expenseForm.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a description for the expense.",
        variant: "destructive"
      });
      return;
    }

    setExpenseLoading(true);
    try {
      await submitExpense(expenseForm);
      toast({
        title: "Expense Submitted",
        description: "Your expense has been added to the project ledger."
      });
      setExpenseForm({ receipt: null, amount: "", vendor: "", description: "" });
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]:not([multiple])') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your expense.",
        variant: "destructive"
      });
    } finally {
      setExpenseLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary shadow-md border-b">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="gap-2 text-primary-foreground hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="text-primary-foreground">
              <h1 className="text-3xl font-bold">Project Updates</h1>
              <p className="text-primary-foreground/80 text-lg">Project ID: {projectId}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">

        <div className="space-y-8 animate-fade-in">
          {/* Progress Update Section */}
          <Card className="bg-gradient-card shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg border-b border-border/50">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                Progress Update
              </CardTitle>
              <CardDescription className="text-base">
                Submit a text-based progress note to keep your team informed about project developments.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <Label htmlFor="progress-note" className="text-sm font-semibold text-foreground">
                  Progress Note
                </Label>
                <Textarea
                  id="progress-note"
                  placeholder="Enter a detailed update about the project's progress..."
                  value={progressForm.progressNote}
                  onChange={(e) => setProgressForm({ progressNote: e.target.value })}
                  className="min-h-[120px] border-border/50 focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              <Button 
                onClick={handleProgressSubmit}
                disabled={progressLoading}
                className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 shadow-md transition-all duration-200"
                size="lg"
              >
                {progressLoading ? "Submitting..." : "Submit Update"}
              </Button>
            </CardContent>
          </Card>

          <div className="border-t border-gradient-secondary/20 my-8"></div>

          {/* Photo Upload Section */}
          <Card className="bg-gradient-card shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-info/5 to-info/10 rounded-t-lg border-b border-border/50">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-info/10 rounded-lg">
                  <Camera className="h-5 w-5 text-info" />
                </div>
                Photo Upload
              </CardTitle>
              <CardDescription className="text-base">
                Upload photos from the job site to document progress and share visual updates with your team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <Label htmlFor="photos" className="text-sm font-semibold text-foreground">
                  Upload Photos
                </Label>
                <Input
                  id="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setPhotoForm({ ...photoForm, photos: e.target.files })}
                  className="cursor-pointer border-border/50 focus:border-info/50 focus:ring-info/20 file:bg-info/10 file:text-info file:border-0 file:rounded-md"
                />
                <p className="text-sm text-muted-foreground">
                  Select one or more image files (JPG, PNG, HEIC supported)
                </p>
              </div>
              <div className="space-y-3">
                <Label htmlFor="photo-description" className="text-sm font-semibold text-foreground">
                  Photo Description
                </Label>
                <Textarea
                  id="photo-description"
                  placeholder="Briefly describe what the photos show..."
                  value={photoForm.description}
                  onChange={(e) => setPhotoForm({ ...photoForm, description: e.target.value })}
                  className="min-h-[100px] border-border/50 focus:border-info/50 focus:ring-info/20"
                />
              </div>
              <Button 
                onClick={handlePhotoSubmit}
                disabled={photoLoading}
                className="w-full sm:w-auto gap-2 bg-info hover:bg-info/90 shadow-md transition-all duration-200"
                size="lg"
              >
                <Upload className="h-4 w-4" />
                {photoLoading ? "Uploading..." : "Upload Photos"}
              </Button>
            </CardContent>
          </Card>

          <div className="border-t border-gradient-secondary/20 my-8"></div>

          {/* Expense/Receipt Section */}
          <Card className="bg-gradient-card shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-success/5 to-success/10 rounded-t-lg border-b border-border/50">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-success/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                Expense/Receipt Capture
              </CardTitle>
              <CardDescription className="text-base">
                Log project expenses by uploading a receipt photo for accurate cost tracking and accounting.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <Label htmlFor="receipt" className="text-sm font-semibold text-foreground">
                  Upload Receipt
                </Label>
                <Input
                  id="receipt"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setExpenseForm({ ...expenseForm, receipt: e.target.files?.[0] || null })}
                  className="cursor-pointer border-border/50 focus:border-success/50 focus:ring-success/20 file:bg-success/10 file:text-success file:border-0 file:rounded-md"
                />
                <p className="text-sm text-muted-foreground">
                  Select a clear image of your receipt
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-sm font-semibold text-foreground">
                    Amount ($)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="border-border/50 focus:border-success/50 focus:ring-success/20"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="vendor" className="text-sm font-semibold text-foreground">
                    Vendor
                  </Label>
                  <Input
                    id="vendor"
                    placeholder="Enter vendor name"
                    value={expenseForm.vendor}
                    onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
                    className="border-border/50 focus:border-success/50 focus:ring-success/20"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="expense-description" className="text-sm font-semibold text-foreground">
                  Description
                </Label>
                <Textarea
                  id="expense-description"
                  placeholder="e.g., Materials, lumber, hardware..."
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="min-h-[80px] border-border/50 focus:border-success/50 focus:ring-success/20"
                />
              </div>
              <Button 
                onClick={handleExpenseSubmit}
                disabled={expenseLoading}
                className="w-full sm:w-auto bg-success hover:bg-success/90 shadow-md transition-all duration-200"
                size="lg"
              >
                {expenseLoading ? "Submitting..." : "Submit Expense"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectUpdates;
