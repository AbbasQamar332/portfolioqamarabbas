import fs from "fs";
import path from "path";

// Simple JSON-file-based database to avoid sql.js webpack/WASM issues
const DB_PATH = path.join(process.cwd(), "portfolio-data.json");

interface TableData {
  [tableName: string]: Record<string, unknown>[];
}

let data: TableData = {};

export async function initializeDatabase(): Promise<void> {
  const isVercel = !!process.env.VERCEL;

  if (!isVercel && fs.existsSync(DB_PATH)) {
    try {
      const raw = fs.readFileSync(DB_PATH, "utf-8");
      data = JSON.parse(raw);
    } catch {
      data = {};
    }
  }

  // Ensure all required tables exist
  const tables = [
    "admin_users",
    "profiles",
    "skills",
    "projects",
    "project_images",
    "certificates",
    "education",
    "experiences",
    "gallery",
    "testimonials",
    "contacts",
    "settings",
  ];

  for (const table of tables) {
    if (!data[table]) data[table] = [];
  }

  await saveDb();
}

export async function getDb(): Promise<TableData> {
  return data;
}

export async function saveDb(): Promise<void> {
  const isVercel = !!process.env.VERCEL;
  if (!isVercel) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  }
}

export function queryAll(
  _db: TableData,
  sql: string,
  params: unknown[] = []
): Record<string, unknown>[] {
  // Parse simple SELECT queries
  const tableMatch = sql.match(/FROM\s+(\w+)/i);
  if (!tableMatch) return [];

  const tableName = tableMatch[1];
  let rows = data[tableName] || [];

  // Handle WHERE clause
  const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER\s+|$)/i);
  if (whereMatch) {
    const whereStr = whereMatch[1];
    rows = rows.filter((row) => {
      const conditionMatch = whereStr.match(/(\w+)\s*=\s*\?/);
      if (conditionMatch) {
        const col = conditionMatch[1];
        const val = params[0];
        return row[col] === val;
      }
      return true;
    });
  }

  // Handle ORDER BY
  const orderMatch = sql.match(/ORDER\s+BY\s+(\w+)\s*(ASC|DESC)?/i);
  if (orderMatch) {
    const col = orderMatch[1];
    const dir = (orderMatch[2] || "ASC").toUpperCase();
    rows = [...rows].sort((a, b) => {
      const aVal = String(a[col] || "");
      const bVal = String(b[col] || "");
      return dir === "ASC"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }

  // Handle LIMIT
  const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
  if (limitMatch) {
    const limit = parseInt(limitMatch[1]);
    rows = rows.slice(0, limit);
  }

  return rows;
}

export function queryOne(
  db: TableData,
  sql: string,
  params: unknown[] = []
): Record<string, unknown> | null {
  const rows = queryAll(db, sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export function run(
  _db: TableData,
  sql: string,
  params: unknown[] = []
): { changes: number } {
  // Parse INSERT, UPDATE, DELETE
  const insertMatch = sql.match(/INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)/i);
  const updateMatch = sql.match(/UPDATE\s+(\w+)\s+SET\s+(.+?)(?:\s+WHERE|$)/i);
  const deleteMatch = sql.match(/DELETE\s+FROM\s+(\w+)/i);

  if (insertMatch) {
    const tableName = insertMatch[1];
    if (!data[tableName]) data[tableName] = [];

    const columns = insertMatch[2].split(",").map((c: string) => c.trim());
    const row: Record<string, unknown> = {};
    columns.forEach((col: string, i: number) => {
      row[col] = i < params.length ? params[i] : "";
    });

    // Check if this table uses 'id' as primary key - replace if exists
    const id = row.id;
    if (id) {
      const existingIdx = data[tableName].findIndex((r) => r.id === id);
      if (existingIdx >= 0) {
        data[tableName][existingIdx] = { ...data[tableName][existingIdx], ...row };
      } else {
        data[tableName].push(row);
      }
    } else {
      data[tableName].push(row);
    }

    saveDb();
    return { changes: 1 };
  }

  if (updateMatch) {
    const tableName = updateMatch[1];
    const setClause = updateMatch[2];
    const rows = data[tableName] || [];

    // Find id from params (usually last param)
    const id = params[params.length - 1];
    const setPairs = setClause.split(",").map((s: string) => s.trim());

    let changeCount = 0;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].id === id) {
        let paramIdx = 0;
        for (const pair of setPairs) {
          const match = pair.match(/(\w+)\s*=\s*\?/);
          if (match) {
            rows[i][match[1]] = params[paramIdx];
            paramIdx++;
          }
        }
        changeCount++;
      }
    }

    saveDb();
    return { changes: changeCount };
  }

  if (deleteMatch) {
    const tableName = deleteMatch[1];
    const id = params[0];
    const before = (data[tableName] || []).length;
    data[tableName] = (data[tableName] || []).filter((r) => r.id !== id);
    saveDb();
    return { changes: before - (data[tableName] || []).length };
  }

  return { changes: 0 };
}
