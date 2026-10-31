import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import path from 'path';
import { app } from '../src/app.js';
import { prisma } from '../src/prisma.js';
import { cleanupInterruptedJobs } from '../src/jobs.js';

describe('Hardening and Security Verification', () => {
  const userA = { email: `user_a_${Date.now()}@example.com`, password: 'PasswordA123!' };
  const userB = { email: `user_b_${Date.now()}@example.com`, password: 'PasswordB123!' };
  let tokenA = '';
  let tokenB = '';
  let idA = '';
  let idB = '';
  let reportAId = '';

  afterAll(async () => {
    if (idA) await prisma.user.deleteMany({ where: { id: idA } });
    if (idB) await prisma.user.deleteMany({ where: { id: idB } });
    await prisma.$disconnect();
  });

  it('Creates two distinct users', async () => {
    const resA = await request(app).post('/api/auth/signup').send(userA);
    expect(resA.status).toBe(201);
    tokenA = resA.body.token;
    idA = resA.body.user.id;

    const resB = await request(app).post('/api/auth/signup').send(userB);
    expect(resB.status).toBe(201);
    tokenB = resB.body.token;
    idB = resB.body.user.id;
  });

  it('Creates a report for User A', async () => {
    const samplePath = path.join(__dirname, 'sample-chat.txt');
    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${tokenA}`)
      .field('chatType', 'romance')
      .field('myName', 'Harsh')
      .field('consent', 'true')
      .attach('file', samplePath);

    expect(res.status).toBe(202);
    reportAId = res.body.id;
  });

  it('Strict ownership: User B cannot access User A report (returns 404)', async () => {
    const res = await request(app)
      .get(`/api/reports/${reportAId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('not_found');
  });

  it('Strict ownership: User B cannot delete User A report (returns 404)', async () => {
    const res = await request(app)
      .delete(`/api/reports/${reportAId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('not_found');

    // Confirm User A report is still safe
    const checkRes = await request(app)
      .get(`/api/reports/${reportAId}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(checkRes.status).toBe(200);
  });

  it('Rejects invalid file format (e.g. image/png or .pdf) with unsupported_file', async () => {
    const res = await request(app)
      .post('/api/uploads/preview')
      .set('Authorization', `Bearer ${tokenA}`)
      .attach('file', Buffer.from('fake binary pdf content'), 'test.pdf');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('unsupported_file');
  });

  it('Rejects chats with fewer than 50 messages with too_short', async () => {
    const shortChat = '12/03/23, 10:00 am - Alice: Hello\n12/03/23, 10:01 am - Bob: Hey';
    const res = await request(app)
      .post('/api/uploads/preview')
      .set('Authorization', `Bearer ${tokenA}`)
      .attach('file', Buffer.from(shortChat), 'short.txt');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('too_short');
  });

  it('Rejects reports with invalid myName', async () => {
    const samplePath = path.join(__dirname, 'sample-chat.txt');
    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${tokenA}`)
      .field('chatType', 'romance')
      .field('myName', 'NonExistentPerson')
      .field('consent', 'true')
      .attach('file', samplePath);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('invalid_my_name');
  });

  it('cleanupInterruptedJobs marks stuck queued or processing reports as failed/interrupted', async () => {
    // Create a mock stuck report
    const stuck = await prisma.report.create({
      data: {
        userId: idA,
        chatType: 'romance',
        status: 'processing',
        stage: 'reading_months',
      },
    });

    await cleanupInterruptedJobs();

    const updated = await prisma.report.findUnique({
      where: { id: stuck.id },
    });

    expect(updated?.status).toBe('failed');
    expect(updated?.errorCode).toBe('interrupted');

    // Clean up
    await prisma.report.delete({ where: { id: stuck.id } });
  });
});
