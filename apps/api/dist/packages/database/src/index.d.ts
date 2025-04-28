export interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: string;
    updatedAt: string;
}
export declare function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task;
export declare function getAllTasks(): Task[];
export declare function getTaskById(id: number): Task | undefined;
export declare function updateTask(id: number, task: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Task | undefined;
export declare function deleteTask(id: number): boolean;
declare const _default: {
    createTask: typeof createTask;
    getAllTasks: typeof getAllTasks;
    getTaskById: typeof getTaskById;
    updateTask: typeof updateTask;
    deleteTask: typeof deleteTask;
};
export default _default;
