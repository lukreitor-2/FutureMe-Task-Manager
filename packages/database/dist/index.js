"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = createTask;
exports.getAllTasks = getAllTasks;
exports.getTaskById = getTaskById;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure the data directory exists
const dataDir = path_1.default.join(process.cwd(), 'data');
if (!fs_1.default.existsSync(dataDir)) {
    fs_1.default.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path_1.default.join(dataDir, 'tasks.db');
// Connect to the database
const db = new better_sqlite3_1.default(dbPath);
// Create the tasks table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);
// Create a new task
// Create a new task
// Create a new task
function createTask(task) {
    const stmt = db.prepare(`
    INSERT INTO tasks (title, description, status)
    VALUES (?, ?, ?)
  `);
    const now = new Date().toISOString();
    const result = stmt.run(task.title, task.description || null, task.status);
    return {
        id: result.lastInsertRowid,
        ...task,
        createdAt: now,
        updatedAt: now
    };
}
// Get all tasks
function getAllTasks() {
    const stmt = db.prepare('SELECT * FROM tasks ORDER BY updatedAt DESC');
    return stmt.all();
}
// Get a task by ID
function getTaskById(id) {
    const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
    return stmt.get(id);
}
// Update a task
function updateTask(id, task) {
    const existing = getTaskById(id);
    if (!existing)
        return undefined;
    const fields = Object.keys(task).map(key => `${key} = ?`).join(', ');
    const values = Object.values(task);
    if (fields) {
        const stmt = db.prepare(`
      UPDATE tasks
      SET ${fields}, updatedAt = ?
      WHERE id = ?
    `);
        stmt.run(...values, new Date().toISOString(), id);
    }
    return getTaskById(id);
}
// Delete a task
function deleteTask(id) {
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
}
exports.default = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
};
