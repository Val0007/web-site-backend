import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

// Miljövariabler för E2E-tester
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key';
process.env.ADMIN_URL = process.env.ADMIN_URL || 'http://localhost:3000';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test';
process.env.DB_NAME = process.env.DB_NAME || 'test';
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'dummy-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'dummy-google-client-secret';
process.env.BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

// Höj Jests timeout för E2E-tester då den annars failar (30 sekunder)
jest.setTimeout(30000);

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
