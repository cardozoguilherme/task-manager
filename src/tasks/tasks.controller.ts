import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksService } from './tasks.service';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getTasks(
    @Query() taskFilterDto: TaskFilterDto,
    @GetUser() user: { id: string },
  ) {
    if (Object.keys(taskFilterDto).length) {
      return this.tasksService.getTasksWithFilters(taskFilterDto, user.id);
    }
    return this.tasksService.getAllTasks(user.id);
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string, @GetUser() user: { id: string }) {
    return this.tasksService.getTaskById(id, user.id);
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: { id: string },
  ) {
    return this.tasksService.createTask(createTaskDto, user.id);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string, @GetUser() user: { id: string }) {
    return this.tasksService.deleteTask(id, user.id);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: { id: string },
  ) {
    return this.tasksService.updateTaskStatus(id, updateTaskStatusDto, user.id);
  }
}
