import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/get-tasks-filter.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTasks() {
    return await this.prisma.task.findMany();
  }

  async getTasksWithFilters(taskFilterDto: TaskFilterDto) {
    const { status, search } = taskFilterDto;

    const where: Prisma.TaskWhereInput = {};

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

  async getTaskById(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto;

    return await this.prisma.task.create({
      data: {
        title: title,
        description: description,
      },
    });
  }

  async deleteTask(id: string) {
    try {
      return await this.prisma.task.delete({ where: { id: id } });
    } catch {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }
  }

  async updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto) {
    const { status } = updateTaskStatusDto;

    try {
      return await this.prisma.task.update({
        where: { id: id },
        data: { status: status },
      });
    } catch {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }
  }
}
