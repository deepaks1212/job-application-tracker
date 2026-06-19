import { describe, expect, it } from 'vitest';
import { createApplicationSchema, updateApplicationSchema } from '../validators/applicationValidator';

describe('Job Application Validators Test Suite', () => {
  describe('Create Job Application Schema', () => {
    it('should validate a correct job application object', () => {
      const validData = {
        company_name: 'Stripe',
        job_title: 'Full Stack Engineer',
        job_type: 'FULL_TIME',
        status: 'APPLIED',
        applied_date: '2026-06-18',
        notes: 'Waiting for recruiter call',
      };

      const result = createApplicationSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.company_name).toBe('Stripe');
        expect(result.data.job_type).toBe('FULL_TIME');
      }
    });

    it('should fail validation if company name is shorter than 2 characters', () => {
      const invalidData = {
        company_name: 'A',
        job_title: 'Intern',
        job_type: 'INTERNSHIP',
        status: 'APPLIED',
        applied_date: '2026-06-18',
      };

      const result = createApplicationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.company_name?.[0]).toContain('at least 2 characters');
      }
    });

    it('should fail validation if job title is empty', () => {
      const invalidData = {
        company_name: 'Stripe',
        job_title: '',
        job_type: 'FULL_TIME',
        status: 'INTERVIEWING',
        applied_date: '2026-06-18',
      };

      const result = createApplicationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.job_title?.[0]).toContain('is required');
      }
    });

    it('should fail with invalid job types or statuses', () => {
      const invalidData = {
        company_name: 'Apple',
        job_title: 'iOS Lead',
        job_type: 'CONTRACTOR' as any, // Invalid enum value
        status: 'APPLIED',
        applied_date: '2026-06-18',
      };

      const result = createApplicationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail with an invalid applied date string format', () => {
      const invalidData = {
        company_name: 'Apple',
        job_title: 'iOS Lead',
        job_type: 'FULL_TIME',
        status: 'APPLIED',
        applied_date: 'not-a-date',
      };

      const result = createApplicationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Update Job Application Schema', () => {
    it('should validate a partial object representing updates', () => {
      const validUpdate = {
        status: 'INTERVIEWING',
        notes: 'First round scheduled for Monday.',
      };

      const result = updateApplicationSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('INTERVIEWING');
        expect(result.data.notes).toBe('First round scheduled for Monday.');
      }
    });

    it('should fail update if specified company_name is too short', () => {
      const invalidUpdate = {
        company_name: 'X',
      };

      const result = updateApplicationSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });
});
