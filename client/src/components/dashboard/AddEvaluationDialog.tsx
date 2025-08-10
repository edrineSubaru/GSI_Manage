import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Evaluation } from "@shared/schema";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const evaluationFormSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  evaluationType: z.enum(["baseline", "midterm", "final"]),
  evaluationDate: z.string().min(1, "Evaluation date is required"),
  findings: z.string().optional(),
  recommendations: z.string().optional(),
  score: z.string().optional(),
  evaluatorId: z.string().optional(),
});

type EvaluationFormValues = z.infer<typeof evaluationFormSchema>;

interface AddEvaluationDialogProps {
  children: React.ReactNode;
  projects?: { id: string; name: string }[];
  employees?: { id: string; firstName: string; lastName: string }[];
  onEvaluationAdded?: () => void;
}

export function AddEvaluationDialog({ children, projects = [], employees = [], onEvaluationAdded }: AddEvaluationDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationFormSchema),
    defaultValues: {
      projectId: "",
      evaluationType: "baseline",
      evaluationDate: new Date().toISOString().split("T")[0],
      findings: "",
      recommendations: "",
      score: "",
      evaluatorId: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: EvaluationFormValues) => {
      // Format the data for submission
      const formattedData = {
        ...data,
        score: data.score ? parseInt(data.score) : null,
        evaluationDate: new Date(data.evaluationDate).toISOString(),
        evaluatorId: data.evaluatorId || null,
      };
      
      const response = await fetch("/api/evaluations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create evaluation");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/evaluations"] });
      setOpen(false);
      form.reset();
      if (onEvaluationAdded) onEvaluationAdded();
    },
    onError: (error) => {
      console.error("Error creating evaluation:", error);
    },
  });

  const onSubmit = (data: EvaluationFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Evaluation</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="evaluationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Evaluation Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="baseline">Baseline</SelectItem>
                        <SelectItem value="midterm">Midterm</SelectItem>
                        <SelectItem value="final">Final</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Score</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter score (0-100)" 
                        type="number" 
                        min="0" 
                        max="100" 
                        {...field} 
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="evaluationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evaluation Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="evaluatorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evaluator</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an evaluator" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.firstName} {employee.lastName}
                        </SelectItem>
                      ))}
                      <SelectItem value="">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="findings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Findings</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter key findings" 
                      className="resize-none min-h-[60px] max-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="recommendations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recommendations</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter recommendations" 
                      className="resize-none min-h-[60px] max-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="h-9"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending} className="h-9">
                {mutation.isPending ? "Creating..." : "Create Evaluation"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}