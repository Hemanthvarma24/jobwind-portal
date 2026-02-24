import { Job, PaginatedResponse } from "./types";

const BASE_URL = "https://jsonfakery.com";

// Simple in-memory cache
const cache: Map<string, { data: unknown; timestamp: number }> = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function getAllJobs(): Promise<Job[]> {
  const cacheKey = "all_jobs";
  const cached = getCached<Job[]>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${BASE_URL}/jobs`);
  if (!res.ok) throw new Error("Failed to fetch jobs");
  const data = await res.json();
  setCache(cacheKey, data);
  return data;
}

export async function getPaginatedJobs(page = 1): Promise<PaginatedResponse> {
  const cacheKey = `paginated_jobs_${page}`;
  const cached = getCached<PaginatedResponse>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${BASE_URL}/jobs/paginated?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch paginated jobs");
  const data = await res.json();
  setCache(cacheKey, data);
  return data;
}

export async function getRandomJob(): Promise<Job> {
  const res = await fetch(`${BASE_URL}/jobs/random`, {
    next: { revalidate: 10 },
  });
  if (!res.ok) throw new Error("Failed to fetch random job");
  return res.json();
}

export async function getRandomJobs(count: number): Promise<Job[]> {
  const res = await fetch(`${BASE_URL}/jobs/random/${count}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error("Failed to fetch random jobs");
  return res.json();
}

export function formatSalary(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseQualifications(qualifications: string): string[] {
  try {
    return JSON.parse(qualifications);
  } catch {
    return [];
  }
}

// Helper to get unique categories from jobs
export function getUniqueCategories(jobs: Job[]): string[] {
  const categories = new Set(jobs.map(job => job.job_category));
  return ["All Categories", ...Array.from(categories).sort()];
}

// Helper to get unique employment types from jobs
export function getUniqueEmploymentTypes(jobs: Job[]): string[] {
  const types = new Set(jobs.map(job => job.employment_type));
  return Array.from(types).sort();
}

export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "salary_high", label: "Salary: High to Low" },
  { value: "salary_low", label: "Salary: Low to High" },
  { value: "most_openings", label: "Most Openings" },
];
