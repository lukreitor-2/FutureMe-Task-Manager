import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto): import("database").Task;
    findAll(): import("database").Task[];
    findOne(id: string): import("database").Task;
    update(id: string, updateTaskDto: UpdateTaskDto): import("database").Task;
    remove(id: string): {
        success: boolean;
    };
}
