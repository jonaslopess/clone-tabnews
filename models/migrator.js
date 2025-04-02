import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";

const defaultMigrationOptions = {
  dir: resolve("infra", "migrations"),
  direction: "up",
  log: () => {},
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  return runMigrations({ dryRun: true });
}

async function runPendingMigrations() {
  return runMigrations({ dryRun: false });
}

async function runMigrations({ dryRun = true }) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    return await migrationRunner({
      ...defaultMigrationOptions,
      dbClient: dbClient,
      dryRun: dryRun,
    });
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient?.end();
  }
}

const migrator = { listPendingMigrations, runPendingMigrations };

export default migrator;
