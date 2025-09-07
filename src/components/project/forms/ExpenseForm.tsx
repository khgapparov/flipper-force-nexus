import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExpenseFormProps {
  projectId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ExpenseForm = ({ projectId, onSuccess, onCancel }: ExpenseFormProps) => {
  const [receipt, setReceipt] = useState<File | null>(null);
  const [amount, setAmount] = useState("");
  const [vendor, setVendor] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!receipt) {
      toast({
        title: "Validation Error",
        description: "Please upload a receipt image.",
        variant: "destructive"
      });
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }

    if (!vendor.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter the vendor name.",
        variant: "destructive"
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a description for the expense.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Update API to handle expenses
      // For now, we'll use a mock API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      toast({
        title: "Expense Submitted",
        description: "Your expense has been added to the project ledger."
      });
      
      setReceipt(null);
      setAmount("");
      setVendor("");
      setDescription("");
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]:not([multiple])') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your expense.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-card shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-success/5 to-success/10 rounded-t-lg border-b border-border/50">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-success/10 rounded-lg">
            <DollarSign className="h-5 w-5 text-success" />
          </div>
          Add Expense
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
            onChange={(e) => setReceipt(e.target.files?.[0] || null)}
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[80px] border-border/50 focus:border-success/50 focus:ring-success/20"
          />
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-success hover:bg-success/90 shadow-md transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Expense"
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

export default ExpenseForm;
