import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProgressNoteForm from "./forms/ProgressNoteForm";
import PhotoUploadForm from "./forms/PhotoUploadForm";
import ExpenseForm from "./forms/ExpenseForm";

export type ActionType = "progress" | "photo" | "expense" | null;

interface ProjectActionDialogProps {
  projectId: string;
  actionType: ActionType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ProjectActionDialog = ({ 
  projectId, 
  actionType, 
  open, 
  onOpenChange, 
  onSuccess 
}: ProjectActionDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    setIsSubmitting(false);
    onSuccess?.();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  const getDialogTitle = () => {
    switch (actionType) {
      case "progress":
        return "Add Progress Note";
      case "photo":
        return "Upload Photos";
      case "expense":
        return "Add Expense";
      default:
        return "Project Action";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        
        {actionType === "progress" && (
          <ProgressNoteForm
            projectId={projectId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
        
        {actionType === "photo" && (
          <PhotoUploadForm
            projectId={projectId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
        
        {actionType === "expense" && (
          <ExpenseForm
            projectId={projectId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectActionDialog;
