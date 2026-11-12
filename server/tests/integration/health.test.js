const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/database/pool');

describe('GET /api/v1/health (Integration)', () => {
  it('should return 200 and healthy status when database is reachable', async () => {
    jest.spyOn(pool, 'query').mockResolvedValueOnce({ rows: [{ '?column?': 1 }] });

    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
    expect(res.body.data.database.status).toBe('connected');
  });

  it('should return 503 when database query throws error', async () => {
    jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Connection lost'));

    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('SERVICE_UNAVAILABLE');
  });
});

