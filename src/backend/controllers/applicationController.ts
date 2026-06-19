import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from '../services/applicationService';
import { createApplicationSchema, updateApplicationSchema } from '../validators/applicationValidator';

export class ApplicationController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, search, page, limit, sort } = req.query;
      const result = await ApplicationService.getAll({
        status: status as string,
        search: search as string,
        page: page as string,
        limit: limit as string,
        sort: sort as string,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const application = await ApplicationService.getById(id);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
      res.status(200).json(application);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createApplicationSchema.parse(req.body);
      const newApplication = await ApplicationService.create({
        company_name: validatedData.company_name,
        job_title: validatedData.job_title,
        job_type: validatedData.job_type as any,
        status: validatedData.status as any,
        applied_date: validatedData.applied_date,
        notes: validatedData.notes,
      });
      res.status(201).json(newApplication);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const existing = await ApplicationService.getById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Application not found' });
      }

      const validatedData = updateApplicationSchema.parse(req.body);
      const updated = await ApplicationService.update(id, validatedData as any);
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const existing = await ApplicationService.getById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Application not found' });
      }

      await ApplicationService.delete(id);
      res.status(200).json({ message: 'Application deleted successfully', id });
    } catch (error) {
      next(error);
    }
  }

  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await ApplicationService.getStats();
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }
}
