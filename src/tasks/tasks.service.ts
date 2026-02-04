import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/get-tasks-filter.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTasks(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
    });
  }

  async getTasksWithFilters(taskFilterDto: TaskFilterDto, userId: string) {
    const { status, search } = taskFilterDto;

    const where: Prisma.TaskWhereInput = { userId };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return await this.prisma.task.findMany({ where });
  }

  async getTaskById(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, userId: string) {
    const { title, description } = createTaskDto;

    return await this.prisma.task.create({
      data: {
        title,
        description,
        userId,
      },
    });
  }

  async deleteTask(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }

    return this.prisma.task.delete({ where: { id } });
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    userId: string,
  ) {
    const { status } = updateTaskStatusDto;

    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }

    return this.prisma.task.update({
      where: { id },
      data: { status },
    });
  }
}
