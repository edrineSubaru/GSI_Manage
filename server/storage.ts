import { type User, type InsertUser, type Employee, type InsertEmployee, type Project, type InsertProject, type Task, type InsertTask, type KPI, type InsertKPI, type Transaction, type InsertTransaction, type PayrollRecord, type InsertPayrollRecord, type Proposal, type InsertProposal, type Evaluation, type InsertEvaluation, type Report, type InsertReport, type Asset, type InsertAsset } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;

  // Employees
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee | undefined>;
  deleteEmployee(id: string): Promise<boolean>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Tasks
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  getTasksByProject(projectId: string): Promise<Task[]>;
  getTasksByAssignee(assigneeId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;

  // KPIs
  getKPIs(): Promise<KPI[]>;
  getKPI(id: string): Promise<KPI | undefined>;
  createKPI(kpi: InsertKPI): Promise<KPI>;
  updateKPI(id: string, kpi: Partial<KPI>): Promise<KPI | undefined>;
  deleteKPI(id: string): Promise<boolean>;

  // Transactions
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: string): Promise<boolean>;

  // Payroll
  getPayrollRecords(): Promise<PayrollRecord[]>;
  getPayrollRecord(id: string): Promise<PayrollRecord | undefined>;
  getPayrollByEmployee(employeeId: string): Promise<PayrollRecord[]>;
  createPayrollRecord(payroll: InsertPayrollRecord): Promise<PayrollRecord>;
  updatePayrollRecord(id: string, payroll: Partial<PayrollRecord>): Promise<PayrollRecord | undefined>;

  // Proposals
  getProposals(): Promise<Proposal[]>;
  getProposal(id: string): Promise<Proposal | undefined>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: string, proposal: Partial<Proposal>): Promise<Proposal | undefined>;
  deleteProposal(id: string): Promise<boolean>;

  // Evaluations
  getEvaluations(): Promise<Evaluation[]>;
  getEvaluation(id: string): Promise<Evaluation | undefined>;
  getEvaluationsByProject(projectId: string): Promise<Evaluation[]>;
  createEvaluation(evaluation: InsertEvaluation): Promise<Evaluation>;
  updateEvaluation(id: string, evaluation: Partial<Evaluation>): Promise<Evaluation | undefined>;

  // Reports
  getReports(): Promise<Report[]>;
  getReport(id: string): Promise<Report | undefined>;
  createReport(type: string): Promise<Report>;

  // Assets
  getAssets(): Promise<Asset[]>;
  getAsset(id: string): Promise<Asset | undefined>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAsset(id: string, asset: Partial<Asset>): Promise<Asset | undefined>;
  deleteAsset(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private employees: Map<string, Employee> = new Map();
  private projects: Map<string, Project> = new Map();
  private tasks: Map<string, Task> = new Map();
  private kpis: Map<string, KPI> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private payrollRecords: Map<string, PayrollRecord> = new Map();
  private proposals: Map<string, Proposal> = new Map();
  private evaluations: Map<string, Evaluation> = new Map();
  private reports: Map<string, Report> = new Map();
  private assets: Map<string, Asset> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed with GSI-specific data
    const adminUser: User = {
      id: "admin-1",
      email: "admin@governancesystemsint.com",
      password: "$2b$10$hashed_password", // In real app, hash passwords
      firstName: "John",
      lastName: "Doe",
      role: "administrator",
      permissions: ["read", "write", "admin"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Sample employees
    const employees: Employee[] = [
      {
        id: "emp-1",
        employeeId: "GSI001",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@governancesystemsint.com",
        phone: "+256757578580",
        position: "Project Manager",
        department: "Operations",
        hireDate: new Date("2023-01-15"),
        salary: "75000.00",
        status: "active",
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "emp-2",
        employeeId: "GSI002",
        firstName: "Mark",
        lastName: "Johnson",
        email: "mark.johnson@governancesystemsint.com",
        phone: "+256757578581",
        position: "Senior Consultant",
        department: "Consulting",
        hireDate: new Date("2022-03-01"),
        salary: "85000.00",
        status: "active",
        managerId: "emp-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "emp-3",
        employeeId: "GSI003",
        firstName: "Sandra",
        lastName: "Williams",
        email: "sandra.williams@governancesystemsint.com",
        phone: "+256758123456",
        position: "Project Manager",
        department: "Project Management",
        hireDate: new Date("2021-06-15"),
        salary: "95000.00",
        status: "active",
        managerId: "emp-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "emp-4",
        employeeId: "GSI004",
        firstName: "David",
        lastName: "Mugisha",
        email: "david.mugisha@governancesystemsint.com",
        phone: "+256759789012",
        position: "Software Engineer",
        department: "IT",
        hireDate: new Date("2023-01-10"),
        salary: "70000.00",
        status: "active",
        managerId: "emp-2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "emp-5",
        employeeId: "GSI005",
        firstName: "Aisha",
        lastName: "Kamanzi",
        email: "aisha.kamanzi@governancesystemsint.com",
        phone: "+256756456789",
        position: "Business Analyst",
        department: "Consulting",
        hireDate: new Date("2020-11-20"),
        salary: "78000.00",
        status: "inactive",
        managerId: "emp-2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "emp-6",
        employeeId: "GSI006",
        firstName: "Robert",
        lastName: "Ngugi",
        email: "robert.ngugi@governancesystemsint.com",
        phone: "+256755234567",
        position: "HR Manager",
        department: "Human Resources",
        hireDate: new Date("2019-08-05"),
        salary: "88000.00",
        status: "active",
        managerId: "emp-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "emp-7",
        employeeId: "GSI002",
        firstName: "Edrine",
        lastName: "Mwesigwa",
        email: "edrine.mwesigwa@governancesystemsint.com",
        phone: "+256757578581",
        position: "Senior Consultant",
        department: "Consulting",
        hireDate: new Date("2022-03-01"),
        salary: "85000.00",
        status: "active",
        managerId: "emp-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "emp-8",
        employeeId: "GSI002",
        firstName: "Mark",
        lastName: "Johnson",
        email: "mark.johnson@governancesystemsint.com",
        phone: "+256757578581",
        position: "Senior Consultant",
        department: "Consulting",
        hireDate: new Date("2022-03-01"),
        salary: "85000.00",
        status: "active",
        managerId: "emp-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    employees.forEach(emp => this.employees.set(emp.id, emp));

    // Sample projects based on GSI's actual projects
    const projects: Project[] = [
      {
        id: "proj-1",
        name: "USAID Uganda Feed the Future, Inclusive Agricultural Markets Activity",
        description: "Supporting agricultural market development in Uganda",
        client: "USAID",
        status: "active",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-12-31"),
        budget: "500000.00",
        progress: 85,
        managerId: "emp-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "proj-2",
        name: "Water Reservoir Development - Karamoja",
        description: "Facilitating Free Prior and Informed Consent for water reservoirs",
        client: "Ministry of Water and Environment",
        status: "active",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-08-15"),
        budget: "300000.00",
        progress: 62,
        managerId: "emp-2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    projects.forEach(proj => this.projects.set(proj.id, proj));

    // Sample tasks
    const tasks: Task[] = [
      {
        id: "task-1",
        title: "Project proposal review",
        description: "Review AfDB water project proposal",
        status: "in_progress",
        priority: "high",
        assigneeId: "emp-1",
        projectId: "proj-2",
        dueDate: new Date("2024-03-15"),
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "task-2",
        title: "Staff training coordination",
        description: "Quarterly skills development training",
        status: "completed",
        priority: "medium",
        assigneeId: "emp-2",
        projectId: null,
        dueDate: new Date("2024-03-12"),
        completedAt: new Date("2024-03-10"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    tasks.forEach(task => this.tasks.set(task.id, task));

    // Sample assets
    const assets: Asset[] = [
      {
        id: "asset-1",
        name: "Dell Laptop",
        description: "Dell XPS 13 laptop for development work",
        category: "Electronics",
        serialNumber: "DLXPS13-001",
        purchaseDate: new Date("2023-01-15"),
        purchaseValue: "1200.00",
        currentValue: "800.00",
        status: "active",
        assignedTo: "emp-4",
        location: "Kampala Office",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "asset-2",
        name: "Toyota Vehicle",
        description: "Toyota Corolla for field visits",
        category: "Vehicle",
        serialNumber: "TYT-CLR-2023",
        purchaseDate: new Date("2023-03-10"),
        purchaseValue: "25000.00",
        currentValue: "20000.00",
        status: "active",
        assignedTo: null,
        location: "Entebbe Office",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    assets.forEach(asset => this.assets.set(asset.id, asset));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      role: insertUser.role ?? "user",
      permissions: insertUser.permissions ? [...insertUser.permissions] : [],
      isActive: insertUser.isActive ?? true,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, userUpdate: Partial<User>): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...userUpdate, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  // Employee methods
  async getEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = randomUUID();
    const employee: Employee = {
      ...insertEmployee,
      status: insertEmployee.status ?? "active",
      phone: insertEmployee.phone ?? null,
      managerId: insertEmployee.managerId ?? null,
      salary: insertEmployee.salary ?? null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.employees.set(id, employee);
    return employee;
  }

  async updateEmployee(id: string, employeeUpdate: Partial<Employee>): Promise<Employee | undefined> {
    const existing = this.employees.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...employeeUpdate, updatedAt: new Date() };
    this.employees.set(id, updated);
    return updated;
  }

  async deleteEmployee(id: string): Promise<boolean> {
    return this.employees.delete(id);
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      status: insertProject.status ?? "active",
      description: insertProject.description ?? null,
      endDate: insertProject.endDate ?? null,
      budget: insertProject.budget ?? null,
      progress: insertProject.progress ?? null,
      managerId: insertProject.managerId ?? null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, projectUpdate: Partial<Project>): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...projectUpdate, updatedAt: new Date() };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByProject(projectId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.projectId === projectId);
  }

  async getTasksByAssignee(assigneeId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.assigneeId === assigneeId);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      ...insertTask,
      description: insertTask.description ?? null,
      status: insertTask.status ?? "pending",
      priority: insertTask.priority ?? "medium",
      assigneeId: insertTask.assigneeId ?? null,
      projectId: insertTask.projectId ?? null,
      dueDate: insertTask.dueDate ?? null,
      id,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, taskUpdate: Partial<Task>): Promise<Task | undefined> {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...taskUpdate, updatedAt: new Date() };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // KPI methods
  async getKPIs(): Promise<KPI[]> {
    return Array.from(this.kpis.values());
  }

  async getKPI(id: string): Promise<KPI | undefined> {
    return this.kpis.get(id);
  }

  async createKPI(insertKPI: InsertKPI): Promise<KPI> {
    const id = randomUUID();
    const kpi: KPI = {
      ...insertKPI,
      description: insertKPI.description ?? null,
      targetValue: insertKPI.targetValue ?? null,
      currentValue: insertKPI.currentValue ?? null,
      unit: insertKPI.unit ?? null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.kpis.set(id, kpi);
    return kpi;
  }

  async updateKPI(id: string, kpiUpdate: Partial<KPI>): Promise<KPI | undefined> {
    const existing = this.kpis.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...kpiUpdate, updatedAt: new Date() };
    this.kpis.set(id, updated);
    return updated;
  }

  async deleteKPI(id: string): Promise<boolean> {
    return this.kpis.delete(id);
  }

  // Transaction methods
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      ...insertTransaction,
      projectId: insertTransaction.projectId ?? null,
      createdBy: insertTransaction.createdBy ?? null,
      id,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: string, transactionUpdate: Partial<Transaction>): Promise<Transaction | undefined> {
    const existing = this.transactions.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...transactionUpdate };
    this.transactions.set(id, updated);
    return updated;
  }

  async deleteTransaction(id: string): Promise<boolean> {
    return this.transactions.delete(id);
  }

  // Payroll methods
  async getPayrollRecords(): Promise<PayrollRecord[]> {
    return Array.from(this.payrollRecords.values());
  }

  async getPayrollRecord(id: string): Promise<PayrollRecord | undefined> {
    return this.payrollRecords.get(id);
  }

  async getPayrollByEmployee(employeeId: string): Promise<PayrollRecord[]> {
    return Array.from(this.payrollRecords.values()).filter(record => record.employeeId === employeeId);
  }

  async createPayrollRecord(insertPayroll: InsertPayrollRecord): Promise<PayrollRecord> {
    const id = randomUUID();
    const payroll: PayrollRecord = {
      ...insertPayroll,
      status: insertPayroll.status ?? "pending",
      allowances: insertPayroll.allowances ?? null,
      deductions: insertPayroll.deductions ?? null,
      approvedBy: insertPayroll.approvedBy ?? null,
      id,
      approvedAt: null,
      createdAt: new Date(),
    };
    this.payrollRecords.set(id, payroll);
    return payroll;
  }

  async updatePayrollRecord(id: string, payrollUpdate: Partial<PayrollRecord>): Promise<PayrollRecord | undefined> {
    const existing = this.payrollRecords.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...payrollUpdate };
    if (payrollUpdate.approvedBy && !existing.approvedAt) {
      updated.approvedAt = new Date();
    }
    this.payrollRecords.set(id, updated);
    return updated;
  }

  // Proposal methods
  async getProposals(): Promise<Proposal[]> {
    return Array.from(this.proposals.values());
  }

  async getProposal(id: string): Promise<Proposal | undefined> {
    return this.proposals.get(id);
  }

  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const id = randomUUID();
    const proposal: Proposal = {
      ...insertProposal,
      description: insertProposal.description ?? null,
      status: insertProposal.status ?? "draft",
      value: insertProposal.value ?? null,
      submissionDate: insertProposal.submissionDate ?? null,
      deadlineDate: insertProposal.deadlineDate ?? null,
      leadId: insertProposal.leadId ?? null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.proposals.set(id, proposal);
    return proposal;
  }

  async updateProposal(id: string, proposalUpdate: Partial<Proposal>): Promise<Proposal | undefined> {
    const existing = this.proposals.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...proposalUpdate, updatedAt: new Date() };
    this.proposals.set(id, updated);
    return updated;
  }

  async deleteProposal(id: string): Promise<boolean> {
    return this.proposals.delete(id);
  }

  // Evaluation methods
  async getEvaluations(): Promise<Evaluation[]> {
    return Array.from(this.evaluations.values());
  }

  async getEvaluation(id: string): Promise<Evaluation | undefined> {
    return this.evaluations.get(id);
  }

  async getEvaluationsByProject(projectId: string): Promise<Evaluation[]> {
    return Array.from(this.evaluations.values()).filter(evaluation => evaluation.projectId === projectId);
  }

  async createEvaluation(insertEvaluation: InsertEvaluation): Promise<Evaluation> {
    const id = randomUUID();
    const evaluation: Evaluation = {
      ...insertEvaluation,
      findings: insertEvaluation.findings ?? null,
      recommendations: insertEvaluation.recommendations ?? null,
      score: insertEvaluation.score ?? null,
      evaluatorId: insertEvaluation.evaluatorId ?? null,
      id,
      createdAt: new Date(),
    };
    this.evaluations.set(id, evaluation);
    return evaluation;
  }

  async updateEvaluation(id: string, evaluationUpdate: Partial<Evaluation>): Promise<Evaluation | undefined> {
    const existing = this.evaluations.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...evaluationUpdate };
    this.evaluations.set(id, updated);
    return updated;
  }

  // Report methods
  async getReports(): Promise<Report[]> {
    return Array.from(this.reports.values());
  }

  async getReport(id: string): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async createReport(type: string): Promise<Report> {
    const id = randomUUID();
    
    // Generate report name based on type
    const reportNames: Record<string, string> = {
      "employee-performance": "Employee Performance Report",
      "financial-summary": "Financial Summary Report",
      "project-progress": "Project Progress Report",
      "task-completion": "Task Completion Report",
      "kpi-analysis": "KPI Analysis Report",
    };
    
    const name = reportNames[type] || "Custom Report";
    
    const report: Report = {
      id,
      name,
      type,
      description: `Generated report for ${name}`,
      generatedAt: new Date(),
      status: "completed",
      filePath: null,
      createdBy: null,
      createdAt: new Date(),
    };
    
    this.reports.set(id, report);
    return report;
  }

  // Asset methods
  async getAssets(): Promise<Asset[]> {
    return Array.from(this.assets.values());
  }

  async getAsset(id: string): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = randomUUID();
    const asset: Asset = {
      ...insertAsset,
      description: insertAsset.description ?? null,
      status: insertAsset.status ?? "active",
      serialNumber: insertAsset.serialNumber ?? null,
      purchaseDate: insertAsset.purchaseDate ?? null,
      purchaseValue: insertAsset.purchaseValue ?? null,
      currentValue: insertAsset.currentValue ?? null,
      assignedTo: insertAsset.assignedTo ?? null,
      location: insertAsset.location ?? null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.assets.set(id, asset);
    return asset;
  }

  async updateAsset(id: string, assetUpdate: Partial<Asset>): Promise<Asset | undefined> {
    const existing = this.assets.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...assetUpdate, updatedAt: new Date() };
    this.assets.set(id, updated);
    return updated;
  }

  async deleteAsset(id: string): Promise<boolean> {
    return this.assets.delete(id);
  }
}

export const storage = new MemStorage();
