import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import express, { type Request, type Response } from 'express';

let cachedApp: express.Express | undefined;

async function bootstrap(): Promise<express.Express> {
  if (cachedApp) {
    return cachedApp;
  }

  try {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    app.enableCors({
      origin: process.env.FRONTEND_URL || '*',
      credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    cachedApp = expressApp;
    return cachedApp;
  } catch (error: unknown) {
    console.error('Error during bootstrap:', error);
    throw error;
  }
}

export default async function handler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const app = await bootstrap();
    app(req, res);
  } catch (error: unknown) {
    console.error('Error in handler:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: 'Internal Server Error',
      message,
    });
  }
}
