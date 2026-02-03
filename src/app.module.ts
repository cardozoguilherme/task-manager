import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TasksModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
