import { z } from 'zod';

export const jobTypeSchema = z.enum(['INTERNSHIP', 'FULL_TIME', 'PART_TIME']);
export const statusSchema = z.enum(['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED']);

export const createApplicationSchema = z.object({
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  job_title: z.string().min(1, "Job title is required"),
  job_type: jobTypeSchema,
  status: statusSchema,
  applied_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid applied date format"
  }),
  notes: z.string().optional().nullable(),
});

export const updateApplicationSchema = createApplicationSchema.partial();
