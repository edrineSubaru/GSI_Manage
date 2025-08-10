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
import { PayrollRecord } from "@shared/schema";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const payrollFormSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  period: z.string().min(1, "Period is required"),
  baseSalary: z.string().min(1, "Base salary is required"),
  allowances: z.string().optional(),
  deductions: z.string().optional(),
  status: z.enum(["pending", "approved", "paid"]).default("pending"),
});

type PayrollFormValues = z.infer<typeof payrollFormSchema>;

interface AddPayrollDialogProps {
  children: React.ReactNode;
  employees?: { id: string; firstName: string; lastName: string }[];
  onPayrollAdded?: () => void;
}

export function AddPayrollDialog({ children, employees = [], onPayrollAdded }: AddPayrollDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const form = useForm<PayrollFormValues>({
    resolver: zodResolver(payrollFormSchema),
    defaultValues: {
      employeeId: "",
      period: new Date().toISOString().slice(0, 7), // YYYY-MM format
      baseSalary: "",
      allowances: "",
      deductions: "",
      status: "pending",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: PayrollFormValues) => {
      // Calculate net pay
      const baseSalary = parseFloat(data.baseSalary) || 0;
      const allowances = parseFloat(data.allowances || "0") || 0;
      const deductions = parseFloat(data.deductions || "0") || 0;
      const netPay = baseSalary + allowances - deductions;
      
      // Format the data for submission
      const formattedData = {
        ...data,
        baseSalary: baseSalary.toString(),
        allowances: allowances.toString(),
        deductions: deductions.toString(),
        netPay: netPay.toString(),
      };
      
      const response = await fetch("/api/payroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create payroll record");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payroll"] });
      setOpen(false);
      form.reset();
      if (onPayrollAdded) onPayrollAdded();
    },
    onError: (error) => {
      console.error("Error creating payroll record:", error);
    },
  });

  const onSubmit = (data: PayrollFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Process Payroll</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.firstName} {employee.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Period *</FormLabel>
                  <FormControl>
                    <Input 
                      type="month" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="baseSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Salary *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter base salary" 
                      type="number" 
                      step="0.01" 
                      {...field} 
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="allowances"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowances</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter allowances" 
                      type="number" 
                      step="0.01" 
                      {...field} 
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="deductions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deductions</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter deductions" 
                      type="number" 
                      step="0.01" 
                      {...field} 
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
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
                {mutation.isPending ? "Processing..." : "Process Payroll"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}