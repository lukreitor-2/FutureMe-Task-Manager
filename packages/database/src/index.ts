import BetterSqlite3 from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'tasks.db');

// Connect to the database
const db = new BetterSqlite3(dbPath);

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

// Task interface
// Task interface
export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}
// Create a new task
// Create a new task
// Create a new task
export function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, status)
    VALUES (?, ?, ?)
  `);
  
  const now = new Date().toISOString();
  const result = stmt.run(task.title, task.description || null, task.status);
  
  return {
    id: result.lastInsertRowid as number,
    ...task,
    createdAt: now,
    updatedAt: now
  };
}

// Get all tasks
export function getAllTasks(): Task[] {
  const stmt = db.prepare('SELECT * FROM tasks ORDER BY updatedAt DESC');
  return stmt.all() as Task[];
}

// Get a task by ID
export function getTaskById(id: number): Task | undefined {
  const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
  return stmt.get(id) as Task | undefined;
}

// Update a task
export function updateTask(id: number, task: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Task | undefined {
  const existing = getTaskById(id);
  if (!existing) return undefined;
  
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
export function deleteTask(id: number): boolean {
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

export default {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
};
