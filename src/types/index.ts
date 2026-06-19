export interface Application {
  id: string;
  company_name: string;
  job_title: string;
  job_type: 'INTERNSHIP' | 'FULL_TIME' | 'PART_TIME';
  status: 'APPLIED' | 'INTERVIEWING' | 'OFFER' | 'REJECTED';
  applied_date: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationStats {
  TOTAL: number;
  APPLIED: number;
  INTERVIEWING: number;
  OFFER: number;
  REJECTED: number;
}

export interface ApplicationListResponse {
  items: Application[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
