import { initializeDatabase, getDb, saveDb } from "../lib/database";
import bcrypt from "bcryptjs";

async function updateAdmin() {
  console.log("Updating admin credentials...");

  await initializeDatabase();
  const db = await getDb();

  const NEW_EMAIL = "sheikhuqamar@gmail.com";
  const NEW_PASSWORD = "qamar123";

  // Hash the new password
  const passwordHash = bcrypt.hashSync(NEW_PASSWORD, 12);

  // Find existing admin user
  const existingAdmin = db.admin_users.find((u: Record<string, unknown>) => u.email === NEW_EMAIL);

  if (existingAdmin) {
    // Update existing admin user's password
    existingAdmin.password_hash = passwordHash;
    console.log("Password updated for admin: " + NEW_EMAIL);
  } else if (db.admin_users.length > 0) {
    // Update the first admin user's email and password
    db.admin_users[0].email = NEW_EMAIL;
    db.admin_users[0].password_hash = passwordHash;
    console.log("Admin email changed to: " + NEW_EMAIL);
    console.log("Admin password updated");
  } else {
    console.log("No admin user found to update!");
    process.exit(1);
  }

  await saveDb();
  console.log("Admin credentials updated successfully!");
  console.log("Email:    " + NEW_EMAIL);
  console.log("Password: " + NEW_PASSWORD);
  process.exit(0);
}

updateAdmin().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
</absolute_path>
</create_file>
