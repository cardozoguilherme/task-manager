import { TaskStatus } from '@prisma/client';
import { IsOptional } from 'class-validator';
import { IsEnum } from 'class-validator';
import { IsString } from 'class-validator';

export class TaskFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
