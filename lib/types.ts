export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary_from: number;
  salary_to: number;
  employment_type: string;
  application_deadline: string;
  qualifications: string;
  contact: string;
  job_category: string;
  is_remote_work: number;
  number_of_opening: number;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse {
  data: Job[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  from: number;
  to: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

export type EmploymentType =
  | "Full-time Developer"
  | "Part-time Developer"
  | "Remote Developer"
  | "Freelance Developer"
  | "Contract Developer"
  | "Temporary Developer"
  | "Intern Developer"
  | "Consultant"
  | "Co-founder/Technical Partner"
  | "In-house Developer for Non-Tech Company"
  | "all";

export type JobCategory =
  | "Front-end Developer"
  | "Back-end Developer"
  | "Full-stack Developer"
  | "Mobile App Developer"
  | "UI/UX Designer"
  | "DevOps Engineer"
  | "Data Scientist"
  | "Database Administrator"
  | "QA Engineer"
  | "Security Engineer"
  | "all";

export type SortOption =
  | "newest"
  | "oldest"
  | "salary_high"
  | "salary_low"
  | "most_openings";

export interface FilterState {
  search: string;
  location: string;
  employment_type: string[];
  job_category: string;
  is_remote: boolean | null;
  salary_min: number | null;
  salary_max: number | null;
  min_openings: number | null;
  created_within: number | null;
  sort_by: SortOption;
}
