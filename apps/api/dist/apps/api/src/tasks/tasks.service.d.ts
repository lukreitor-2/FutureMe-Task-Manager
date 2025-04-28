import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import * as database from 'database';
export declare class TasksService {
    getAllTasks(): database.Task[];
    getTaskById(id: number): database.Task;
    createTask(createTaskDto: CreateTaskDto): database.Task;
    updateTask(id: number, updateTaskDto: UpdateTaskDto): database.Task;
    deleteTask(id: number): {
        success: boolean;
    };
}
