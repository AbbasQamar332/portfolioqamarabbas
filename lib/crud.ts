import { getDb, queryAll, queryOne, run } from "./database";
import { generateId } from "./utils";

export type Row = Record<string, unknown>;

export async function getAll(table: string, orderBy = "created_at", order: "ASC" | "DESC" = "ASC"): Promise<Row[]> {
  const db = await getDb();
  return queryAll(db, `SELECT * FROM ${table} ORDER BY ${orderBy} ${order}`);
}

export async function getById(table: string, id: string): Promise<Row | null> {
  const db = await getDb();
  return queryOne(db, `SELECT * FROM ${table} WHERE id = ?`, [id]);
}

export async function createOne(table: string, data: Record<string, unknown>): Promise<Row | null> {
  const db = await getDb();
  const id = (data.id as string) || generateId();
  delete data.id;

  const columns = ["id", ...Object.keys(data)];
  const placeholders = columns.map(() => "?").join(", ");
  const values = [id, ...Object.values(data)];

  run(db, `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`, values);
  return getById(table, id);
}

export async function updateOne(table: string, id: string, data: Record<string, unknown>): Promise<Row | null> {
  const db = await getDb();
  const setClauses = Object.keys(data).map((key) => `${key} = ?`).join(", ");
  const values = [...Object.values(data), id];

  run(db, `UPDATE ${table} SET ${setClauses} WHERE id = ?`, values);
  return getById(table, id);
}

export async function deleteOne(table: string, id: string): Promise<boolean> {
  const db = await getDb();
  run(db, `DELETE FROM ${table} WHERE id = ?`, [id]);
  return true;
}

export async function exists(table: string, column: string, value: string): Promise<boolean> {
  const db = await getDb();
  const row = queryOne(db, `SELECT 1 FROM ${table} WHERE ${column} = ? LIMIT 1`, [value]);
  return !!row;
}
