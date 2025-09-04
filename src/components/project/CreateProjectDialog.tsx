import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { projectsApi, propertiesApi, type CreateProjectRequest, type Property } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AddPropertyDialog } from "@/components/property/AddPropertyDialog";

const projectFormSchema = z.object({
  propertyId: z.string().min(1, "Property selection is required"),
  projectName: z.string().min(1, "Project name is required"),
  budget: z.number().min(0, "Budget must be positive").optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface CreateProjectDialogProps {
  onProjectCreated?: () => void;
  children?: React.ReactNode;
}

export function CreateProjectDialog({ onProjectCreated, children }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      propertyId: "",
      projectName: "",
      budget: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      loadProperties();
    }
  }, [open]);

  const loadProperties = async () => {
    try {
      setIsLoadingProperties(true);
      const propertiesData = await propertiesApi.getAll();
      setProperties(propertiesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProperties(false);
    }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      setIsLoading(true);
      await projectsApi.create({
        propertyId: data.propertyId,
        projectName: data.projectName,
        budget: data.budget,
      });
      
      toast({
        title: "Project created",
        description: "Your project has been successfully created.",
      });

      form.reset();
      setOpen(false);
      onProjectCreated?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePropertyAdded = () => {
    loadProperties();
  };

  const formatPropertyAddress = (property: Property) => {
    const { street, city, state, zipCode } = property.address;
    return `${street}, ${city}, ${state} ${zipCode}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create a new project for an existing property. You'll need to select a property first.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="propertyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Property</FormLabel>
                    <div className="flex space-x-2">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a property" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingProperties ? (
                            <SelectItem value="loading" disabled>
                              Loading properties...
                            </SelectItem>
                          ) : properties.length === 0 ? (
                            <SelectItem value="empty" disabled>
                              No properties available
                            </SelectItem>
                          ) : (
                            properties.map((property) => (
                              <SelectItem key={property.id} value={property.id}>
                                {formatPropertyAddress(property)}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <AddPropertyDialog onPropertyAdded={handlePropertyAdded}>
                        <Button type="button" variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </AddPropertyDialog>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Downtown Renovation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50000"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || properties.length === 0}
              >
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
