import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertEmployeeSchema, insertProjectSchema, insertTaskSchema, insertKpiSchema, insertTransactionSchema, insertPayrollSchema, insertProposalSchema, insertEvaluationSchema, insertReportSchema, insertAssetSchema } from "@shared/schema";
import { z } from "zod";
import * as XLSX from "xlsx";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In production, use proper password hashing comparison
      // For now, accept any password for demo purposes
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token: "mock-jwt-token" });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      const employees = await storage.getEmployees();
      const tasks = await storage.getTasks();
      const transactions = await storage.getTransactions();
      
      const activeProjects = projects.filter(p => p.status === "active").length;
      const totalEmployees = employees.filter(e => e.status === "active").length;
      const pendingTasks = tasks.filter(t => t.status === "pending" || t.status === "in_progress").length;
      
      const monthlyRevenue = transactions
        .filter(t => t.type === "income" && t.date.getMonth() === new Date().getMonth())
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      res.json({
        activeProjects,
        totalEmployees,
        pendingTasks,
        monthlyRevenue,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Employee routes
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  app.get("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.getEmployee(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employee" });
    }
  });

  app.post("/api/employees", async (req, res) => {
    try {
      const employeeData = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(employeeData);
      res.status(201).json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid employee data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create employee" });
    }
  });

  app.put("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.updateEmployee(req.params.id, req.body);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: "Failed to update employee" });
    }
  });

  app.delete("/api/employees/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteEmployee(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete employee" });
    }
  });

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.updateProject(req.params.id, req.body);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const { projectId, assigneeId } = req.query;
      let tasks;
      
      if (projectId) {
        tasks = await storage.getTasksByProject(projectId as string);
      } else if (assigneeId) {
        tasks = await storage.getTasksByAssignee(assigneeId as string);
      } else {
        tasks = await storage.getTasks();
      }
      
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.updateTask(req.params.id, req.body);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  // KPI routes
  app.get("/api/kpis", async (req, res) => {
    try {
      const kpis = await storage.getKPIs();
      res.json(kpis);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch KPIs" });
    }
  });

  app.post("/api/kpis", async (req, res) => {
    try {
      const kpiData = insertKpiSchema.parse(req.body);
      const kpi = await storage.createKPI(kpiData);
      res.status(201).json(kpi);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid KPI data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create KPI" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Payroll routes
  app.get("/api/payroll", async (req, res) => {
    try {
      const { employeeId } = req.query;
      let payrollRecords;
      
      if (employeeId) {
        payrollRecords = await storage.getPayrollByEmployee(employeeId as string);
      } else {
        payrollRecords = await storage.getPayrollRecords();
      }
      
      res.json(payrollRecords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payroll records" });
    }
  });

  app.post("/api/payroll", async (req, res) => {
    try {
      const payrollData = insertPayrollSchema.parse(req.body);
      const payroll = await storage.createPayrollRecord(payrollData);
      res.status(201).json(payroll);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid payroll data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create payroll record" });
    }
  });

  app.put("/api/payroll/:id", async (req, res) => {
    try {
      const payroll = await storage.updatePayrollRecord(req.params.id, req.body);
      if (!payroll) {
        return res.status(404).json({ message: "Payroll record not found" });
      }
      res.json(payroll);
    } catch (error) {
      res.status(500).json({ message: "Failed to update payroll record" });
    }
  });

  // Proposal routes
  app.get("/api/proposals", async (req, res) => {
    try {
      const proposals = await storage.getProposals();
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });

  app.post("/api/proposals", async (req, res) => {
    try {
      const proposalData = insertProposalSchema.parse(req.body);
      const proposal = await storage.createProposal(proposalData);
      res.status(201).json(proposal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid proposal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create proposal" });
    }
  });

  app.put("/api/proposals/:id", async (req, res) => {
    try {
      const proposal = await storage.updateProposal(req.params.id, req.body);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      res.json(proposal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update proposal" });
    }
  });

  // Evaluation routes
  app.get("/api/evaluations", async (req, res) => {
    try {
      const { projectId } = req.query;
      let evaluations;
      
      if (projectId) {
        evaluations = await storage.getEvaluationsByProject(projectId as string);
      } else {
        evaluations = await storage.getEvaluations();
      }
      
      res.json(evaluations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch evaluations" });
    }
  });

  app.post("/api/evaluations", async (req, res) => {
    try {
      const evaluationData = insertEvaluationSchema.parse(req.body);
      const evaluation = await storage.createEvaluation(evaluationData);
      res.status(201).json(evaluation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid evaluation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create evaluation" });
    }
  });

  // Report routes
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const { type } = req.body;
      const report = await storage.createReport(type);
      res.status(201).json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate report" });
    }
  });

  app.get("/api/reports/:id", async (req, res) => {
    try {
      const report = await storage.getReport(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch report" });
    }
  });

  app.get("/api/reports/:id/view", async (req, res) => {
    try {
      const report = await storage.getReport(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      // For demo purposes, we'll send mock report data
      // In a real application, this would be the actual report data
      res.json({
        id: report.id,
        name: report.name,
        type: report.type,
        generatedAt: report.generatedAt || new Date(),
        content: "This is a sample report content for " + report.name
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to view report" });
    }
  });

  app.get("/api/reports/:id/download", async (req, res) => {
    try {
      const report = await storage.getReport(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      const format = (req.query.format as string) || 'pdf';
      
      if (format === 'excel') {
        // Create Excel workbook
        const workbook = XLSX.utils.book_new();
        
        // Sample data for the report
        const worksheetData = [
          ["Report Name", report.name],
          ["Report Type", report.type],
          ["Generated At", (report.generatedAt || new Date()).toISOString()],
          [],
          ["This is a sample report content for " + report.name]
        ];
        
        // Create worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        
        // Generate buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        
        // Set headers for Excel download
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="${report.name}.xlsx"`);
        
        res.send(buffer);
      } else {
        // PDF format (default)
        // Dynamically import pdfMake only when needed
        const pdfMakeModule = await import("pdfmake/build/pdfmake");
        const pdfFontsModule = await import("pdfmake/build/vfs_fonts");
        
        // Initialize pdfMake fonts
        // @ts-ignore
        pdfMakeModule.default.vfs = pdfFontsModule.default;
        
        // For demo purposes, we'll send mock PDF data
        // In a real application, this would be the actual report data
        const mockPdfData = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/ProcSet [/PDF /Text]
/Font <<
/F1 5 0 R
>>
>>
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Report: ${report.name}) Tj
ET
endstream
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000053 00000 n
0000000114 00000 n
0000000228 00000 n
0000000327 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
383
%%EOF`;
        
        // Set headers for file download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${report.name}.pdf"`);
        
        res.send(mockPdfData);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to download report" });
    }
  });
  
  // Asset routes
  app.get("/api/assets", async (req, res) => {
    try {
      const assets = await storage.getAssets();
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assets" });
    }
  });

  app.get("/api/assets/:id", async (req, res) => {
    try {
      const asset = await storage.getAsset(req.params.id);
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      res.json(asset);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch asset" });
    }
  });

  app.post("/api/assets", async (req, res) => {
    try {
      const assetData = insertAssetSchema.parse(req.body);
      const asset = await storage.createAsset(assetData);
      res.status(201).json(asset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid asset data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create asset" });
    }
  });

  app.put("/api/assets/:id", async (req, res) => {
    try {
      const asset = await storage.updateAsset(req.params.id, req.body);
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      res.json(asset);
    } catch (error) {
      res.status(500).json({ message: "Failed to update asset" });
    }
  });

  app.delete("/api/assets/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAsset(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Asset not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete asset" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
