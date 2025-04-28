"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = createTask;
exports.getAllTasks = getAllTasks;
exports.getTaskById = getTaskById;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
const better_sqlite3_1 = require("better-sqlite3");
const path_1 = require("path");
const fs_1 = require("fs");
const dataDir = path_1.default.join(process.cwd(), 'data');
if (!fs_1.default.existsSync(dataDir)) {
    fs_1.default.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path_1.default.join(dataDir, 'tasks.db');
const db = new better_sqlite3_1.default(dbPath);
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
function getAllTasks() {
    const stmt = db.prepare('SELECT * FROM tasks ORDER BY updatedAt DESC');
    return stmt.all();
}
function getTaskById(id) {
    const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
    return stmt.get(id);
}
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
//# sourceMappingURL=index.js.map