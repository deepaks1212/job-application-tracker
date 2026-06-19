import { pool } from '../config/db';

export interface ApplicationInput {
  company_name: string;
  job_title: string;
  job_type: 'INTERNSHIP' | 'FULL_TIME' | 'PART_TIME';
  status: 'APPLIED' | 'INTERVIEWING' | 'OFFER' | 'REJECTED';
  applied_date: string | Date;
  notes?: string | null;
}

export interface Application extends ApplicationInput {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export class ApplicationService {
  static async getAll(queryParams: {
    status?: string;
    search?: string;
    page?: string;
    limit?: string;
    sort?: string;
  }) {
    const page = Math.max(1, parseInt(queryParams.page || '1', 10));
    const limit = Math.max(1, parseInt(queryParams.limit || '10', 10));
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM applications WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (queryParams.status) {
      query += ` AND status = $${paramCount}`;
      params.push(queryParams.status);
      paramCount++;
    }

    if (queryParams.search) {
      query += ` AND (company_name ILIKE $${paramCount} OR job_title ILIKE $${paramCount})`;
      params.push(`%${queryParams.search}%`);
      paramCount++;
    }

    let orderBy = 'applied_date DESC';
    if (queryParams.sort === 'oldest') {
      orderBy = 'applied_date ASC';
    } else if (queryParams.sort === 'alphabetical') {
      orderBy = 'company_name ASC';
    } else if (queryParams.sort === 'title') {
      orderBy = 'job_title ASC';
    }

    query += ` ORDER BY ${orderBy} LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const countQuery = query.split('ORDER BY')[0];
    const countResult = await pool.query(`SELECT COUNT(*) FROM (${countQuery}) as count_query`, params.slice(0, -2));
    const total = parseInt(countResult.rows[0].count, 10);

    const result = await pool.query(query, params);
    const items = result.rows;

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string) {
    const result = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(data: ApplicationInput) {
    const appliedDate = new Date(data.applied_date);
    const result = await pool.query(
      `INSERT INTO applications (company_name, job_title, job_type, status, applied_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.company_name, data.job_title, data.job_type, data.status, appliedDate, data.notes || null]
    );
    return result.rows[0];
  }

  static async update(id: string, data: Partial<ApplicationInput>) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.company_name !== undefined) {
      updates.push(`company_name = $${paramCount}`);
      values.push(data.company_name);
      paramCount++;
    }
    if (data.job_title !== undefined) {
      updates.push(`job_title = $${paramCount}`);
      values.push(data.job_title);
      paramCount++;
    }
    if (data.job_type !== undefined) {
      updates.push(`job_type = $${paramCount}`);
      values.push(data.job_type);
      paramCount++;
    }
    if (data.status !== undefined) {
      updates.push(`status = $${paramCount}`);
      values.push(data.status);
      paramCount++;
    }
    if (data.applied_date !== undefined) {
      updates.push(`applied_date = $${paramCount}`);
      values.push(new Date(data.applied_date));
      paramCount++;
    }
    if (data.notes !== undefined) {
      updates.push(`notes = $${paramCount}`);
      values.push(data.notes);
      paramCount++;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `UPDATE applications SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id: string) {
    const result = await pool.query('DELETE FROM applications WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  static async getStats() {
    const result = await pool.query(
      `SELECT status, COUNT(*) as count FROM applications GROUP BY status`
    );

    const stats = {
      TOTAL: 0,
      APPLIED: 0,
      INTERVIEWING: 0,
      OFFER: 0,
      REJECTED: 0,
    };

    result.rows.forEach((row) => {
      const status = row.status as keyof typeof stats;
      if (status in stats) {
        stats[status] = parseInt(row.count, 10);
      }
    });

    const totalResult = await pool.query('SELECT COUNT(*) FROM applications');
    stats.TOTAL = parseInt(totalResult.rows[0].count, 10);

    return stats;
  }
}
