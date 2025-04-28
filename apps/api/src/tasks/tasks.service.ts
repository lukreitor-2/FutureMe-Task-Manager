import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import * as database from 'database';

@Injectable()
export class TasksService {
  getAllTasks() {
    return database.getAllTasks();
  }

  getTaskById(id: number) {
    const task = database.getTaskById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  createTask(createTaskDto: CreateTaskDto) {
    return database.createTask({
        ...createTaskDto,
        status: createTaskDto.status || 'pending', // Define um valor padrão se `status` estiver ausente
      });
  }

  updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    const task = database.updateTask(id, updateTaskDto);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  deleteTask(id: number) {
    const deleted = database.deleteTask(id);
    if (!deleted) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return { success: true };
  }
}
