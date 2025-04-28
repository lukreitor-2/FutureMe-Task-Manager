import { IsString, IsEnum, IsOptional } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['pending', 'in-progress', 'completed'], {
    message: 'Status must be one of: pending, in-progress, completed',
  })
  status?: 'pending' | 'in-progress' | 'completed';
}
