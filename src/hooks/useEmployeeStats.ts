import { useMemo } from "react";
import type { Employee } from "../types";

export interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
  avgSalary: number;
  avgRating: number;
  totalProjects: number;
  departments: number;
}

export function useEmployeeStats(data: Employee[]): EmployeeStats {
  return useMemo(() => {
    const active = data.filter((e) => e.isActive).length;
    return {
      total: data.length,
      active,
      inactive: data.length - active,
      avgSalary: Math.round(data.reduce((s, e) => s + e.salary, 0) / data.length),
      avgRating: +(data.reduce((s, e) => s + e.performanceRating, 0) / data.length).toFixed(2),
      totalProjects: data.reduce((s, e) => s + e.projectsCompleted, 0),
      departments: new Set(data.map((e) => e.department)).size,
    };
  }, [data]);
}
