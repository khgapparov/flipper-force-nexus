import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { projectsApi } from "@/lib/api";

interface ProgressNoteFormProps {
  projectId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ProgressNoteForm = ({ projectId, onSuccess, onCancel }: ProgressNoteFormProps) => {
  const [progressNote, setProgressNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!progressNote.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a progress note.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Update API to handle progress notes
      // For now, we'll use a mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Progress Update Submitted",
        description: "Your progress note has been added to the project timeline."
      });
      
      setProgressNote("");
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your progress update.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-card shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg border-b border-border/50">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          Add Progress Note
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
            value={progressNote}
            onChange={(e) => setProgressNote(e.target.value)}
            className="min-h-[120px] border-border/50 focus:border-primary/50 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-primary hover:opacity-90 shadow-md transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Update"
            )}
          </Button>
          {onCancel && (
            <Button 
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressNoteForm;
