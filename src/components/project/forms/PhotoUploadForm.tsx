import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { galleryApi } from "@/lib/api";

interface PhotoUploadFormProps {
  projectId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PhotoUploadForm = ({ projectId, onSuccess, onCancel }: PhotoUploadFormProps) => {
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!photos || photos.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one photo to upload.",
        variant: "destructive"
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a description for the photos.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Update API to handle photo uploads for projects
      // For now, we'll use a mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Photos Uploaded",
        description: "Your photos have been added to the project gallery."
      });
      
      setPhotos(null);
      setDescription("");
      // Reset file input
      const fileInput = document.querySelector('input[type="file"][multiple]') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your photos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-card shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-info/5 to-info/10 rounded-t-lg border-b border-border/50">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-info/10 rounded-lg">
            <Camera className="h-5 w-5 text-info" />
          </div>
          Upload Photos
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
            onChange={(e) => setPhotos(e.target.files)}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px] border-border/50 focus:border-info/50 focus:ring-info/20"
          />
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="gap-2 bg-info hover:bg-info/90 shadow-md transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Photos
              </>
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

export default PhotoUploadForm;
