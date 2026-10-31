import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { app } from '../src/app.js';
import { prisma } from '../src/prisma.js';

describe('End-to-End API Integration', () => {
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'StrongPassword123!';
  let authToken = '';
  let userId = '';
  let createdReportId = '';

  beforeAll(async () => {
    // Database connection verification
  });

  afterAll(async () => {
    if (userId) {
      await prisma.user.deleteMany({ where: { id: userId } });
    }
    await prisma.$disconnect();
  });

  it('GET /api/health returns { ok: true }', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('Returns 401 for protected route without auth token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('unauthorized');
  });

  it('POST /api/auth/signup creates account and returns token', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: testEmail, password: testPassword });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testEmail.toLowerCase());
    userId = res.body.user.id;
  });

  it('POST /api/auth/signup rejects duplicate email with 409 email_taken', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: testEmail, password: testPassword });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('email_taken');
  });

  it('POST /api/auth/login validates credentials and returns token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    authToken = res.body.token;
  });

  it('POST /api/auth/login rejects wrong credentials with 400 invalid_credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'WrongPassword999!' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('invalid_credentials');
  });

  it('GET /api/auth/me returns authenticated user details', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
    expect(res.body.email).toBe(testEmail.toLowerCase());
  });

  it('GET /api/personas returns persona list', async () => {
    const res = await request(app).get('/api/personas');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].id).toBe('cleo');
    expect(res.body[0].available).toBe(true);
  });

  it('POST /api/uploads/preview parses chat without storing anything', async () => {
    const samplePath = path.join(__dirname, 'sample-chat.txt');
    const res = await request(app)
      .post('/api/uploads/preview')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', samplePath);

    expect(res.status).toBe(200);
    expect(res.body.participants).toContain('sam');
    expect(res.body.participants).toContain('natasha');
    expect(res.body.messageCount).toBe(64);
    expect(res.body.isGroup).toBe(false);
  });

  it('POST /api/reports creates report, validates consent and myName, returns 202', async () => {
    const samplePath = path.join(__dirname, 'sample-chat.txt');

    // Missing consent fails
    const failRes = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${authToken}`)
      .field('chatType', 'romance')
      .field('myName', 'sam')
      .field('consent', 'false')
      .attach('file', samplePath);

    expect(failRes.status).toBe(400);
    expect(failRes.body.error).toBe('no_consent');

    // Valid submission
    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${authToken}`)
      .field('chatType', 'romance')
      .field('persona', 'cleo')
      .field('myName', 'sam')
      .field('consent', 'true')
      .attach('file', samplePath);

    expect(res.status).toBe(202);
    expect(res.body.id).toBeDefined();
    createdReportId = res.body.id;
  });

  it('GET /api/reports lists reports for user', async () => {
    const res = await request(app)
      .get('/api/reports')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].id).toBe(createdReportId);
  });

  it('Polls GET /api/reports/:id until finished and validates report structure', async () => {
    let report: any = null;
    for (let i = 0; i < 20; i++) {
      const res = await request(app)
        .get(`/api/reports/${createdReportId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      report = res.body;
      if (report.status === 'done' || report.status === 'failed') {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    expect(report.status).toBe('done');
    expect(report.stage).toBe('done');
    expect(report.title).toBeDefined();
    expect(report.stats).toBeDefined();
    expect(report.stats.totalMessages).toBe(64);
    expect(report.monthly).toBeDefined();
    expect(report.narrative).toBeDefined();
    expect(report.narrative.sections.length).toBeGreaterThan(0);
  });

  it('DELETE /api/reports/:id deletes report', async () => {
    const res = await request(app)
      .delete(`/api/reports/${createdReportId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(204);

    const checkRes = await request(app)
      .get(`/api/reports/${createdReportId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(checkRes.status).toBe(404);
  });

  it('DELETE /api/account cascades and removes user and all their reports', async () => {
    const res = await request(app)
      .delete('/api/account')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(204);

    const checkMe = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);
    expect(checkMe.status).toBe(401);
  });
});

