import type { Employee } from "../types";
import { employees as sampleData } from "./employees";

const FIRST_NAMES = [
  "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda",
  "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Charles", "Karen", "Daniel", "Lisa", "Matthew", "Nancy",
  "Anthony", "Betty", "Mark", "Margaret", "Steven", "Sandra", "Andrew", "Ashley",
  "Paul", "Dorothy", "Joshua", "Kimberly", "Kenneth", "Emily", "Kevin", "Donna",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
];

const DEPARTMENTS = ["Engineering", "Marketing", "Sales", "HR", "Finance"];

const POSITIONS: Record<string, string[]> = {
  Engineering: ["Junior Developer", "Senior Developer", "DevOps Engineer", "QA Engineer", "Engineering Manager", "Staff Engineer", "Principal Engineer"],
  Marketing: ["Content Specialist", "Marketing Manager", "Digital Marketing Specialist", "SEO Analyst", "Brand Strategist"],
  Sales: ["Sales Representative", "Account Executive", "Sales Manager", "Business Development Rep", "Solutions Consultant"],
  HR: ["HR Specialist", "Recruiter", "HR Manager", "Talent Acquisition Lead", "People Operations Analyst"],
  Finance: ["Financial Analyst", "Senior Accountant", "Finance Manager", "Budget Analyst", "Payroll Specialist"],
};

const SKILLS_POOL: Record<string, string[]> = {
  Engineering: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "Go", "AWS", "Docker", "Kubernetes", "GraphQL", "PostgreSQL", "MongoDB", "Redis", "CI/CD"],
  Marketing: ["SEO", "Google Ads", "Facebook Ads", "Content Writing", "Analytics", "Email Marketing", "Social Media", "Brand Management", "Adobe Creative", "HubSpot"],
  Sales: ["CRM", "Salesforce", "Negotiation", "B2B Sales", "Account Management", "Lead Generation", "Presentation", "Cold Calling", "Pipeline Management"],
  HR: ["Recruitment", "Employee Relations", "HRIS", "Talent Acquisition", "LinkedIn Recruiter", "Interviewing", "Policy Development", "Onboarding", "Compensation"],
  Finance: ["Financial Modeling", "Excel", "SAP", "QuickBooks", "Tax Preparation", "Budget Management", "Forecasting", "Audit", "Compliance"],
};

const LOCATIONS = ["New York", "Los Angeles", "Chicago", "Austin", "Seattle", "Miami", "Denver", "Phoenix", "Boston", "San Francisco"];

const MANAGERS = ["Sarah Johnson", "Michael Brown", "Robert Martinez", "Jennifer Lee", "Karen White", "Thomas Clark", "David Wilson"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function randomDate(start: string, end: string): string {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return new Date(s + Math.random() * (e - s)).toISOString().split("T")[0];
}

function randomSalary(dept: string): number {
  const base: Record<string, [number, number]> = {
    Engineering: [65000, 180000],
    Marketing: [50000, 130000],
    Sales: [55000, 140000],
    HR: [50000, 100000],
    Finance: [55000, 120000],
  };
  const [min, max] = base[dept] || [50000, 100000];
  return Math.round((min + Math.random() * (max - min)) / 1000) * 1000;
}

export function generateEmployees(count: number): Employee[] {
  if (count <= 20) return sampleData.slice(0, count);

  const generated: Employee[] = [...sampleData];

  for (let i = sampleData.length + 1; i <= count; i++) {
    const dept = pick(DEPARTMENTS);
    generated.push({
      id: i,
      firstName: pick(FIRST_NAMES),
      lastName: pick(LAST_NAMES),
      email: `employee${i}@company.com`,
      department: dept,
      position: pick(POSITIONS[dept]),
      salary: randomSalary(dept),
      hireDate: randomDate("2015-01-01", "2024-12-31"),
      age: 22 + Math.floor(Math.random() * 25),
      location: pick(LOCATIONS),
      performanceRating: +(3.0 + Math.random() * 2).toFixed(1),
      projectsCompleted: Math.floor(Math.random() * 30) + 1,
      isActive: Math.random() > 0.1,
      skills: pickN(SKILLS_POOL[dept], 2 + Math.floor(Math.random() * 3)),
      manager: Math.random() > 0.15 ? pick(MANAGERS) : null,
    });
  }

  return generated;
}
