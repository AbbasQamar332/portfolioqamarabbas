import { readFileSync, writeFileSync } from "fs";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";

const DB_PATH = new URL("../portfolio-data.json", import.meta.url).pathname;

const raw = readFileSync(DB_PATH, "utf-8");
const data = JSON.parse(raw);

const NEW_EMAIL = "sheikhuqamar@gmail.com";
const NEW_PASSWORD = "qamar123";
const passwordHash = bcrypt.hashSync(NEW_PASSWORD, 12);

if (data.admin_users && data.admin_users.length > 0) {
  data.admin_users[0].email = NEW_EMAIL;
  data.admin_users[0].password_hash = passwordHash;
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  console.log("Admin credentials updated:");
  console.log("  Email:    " + NEW_EMAIL);
  console.log("  Password: " + NEW_PASSWORD);
} else {
  console.log("No admin user found!");
  process.exit(1);
}

