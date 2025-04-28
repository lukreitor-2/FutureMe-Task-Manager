"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const database = require("database");
let TasksService = class TasksService {
    getAllTasks() {
        return database.getAllTasks();
    }
    getTaskById(id) {
        const task = database.getTaskById(id);
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }
    createTask(createTaskDto) {
        return database.createTask({
            ...createTaskDto,
            status: createTaskDto.status || 'pending',
        });
    }
    updateTask(id, updateTaskDto) {
        const task = database.updateTask(id, updateTaskDto);
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }
    deleteTask(id) {
        const deleted = database.deleteTask(id);
        if (!deleted) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        return { success: true };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)()
], TasksService);
//# sourceMappingURL=tasks.service.js.map