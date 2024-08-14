import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });
  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '12345678',
      },
    });

    const acessToken = jwt.sign({ sub: user.id });

    await prisma.question.createMany({
      data: [
        {
          title: 'question 01',
          slug: ' slug -01',
          content: 'QUestion content',
          authorId: user.id,
        },
        {
          title: 'question 02',
          slug: ' slug -02',
          content: 'QUestion content',
          authorId: user.id,
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${acessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'question 01' }),
        expect.objectContaining({ title: 'question 02' }),
      ],
    });
  });
});
