import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const pendingMigrations = await runMigrations({ dryRun: true });
  response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await runMigrations({ dryRun: false });

  if (migratedMigrations.length > 0)
    response.status(201).json(migratedMigrations);
  else response.status(200).json(migratedMigrations);
}

async function runMigrations({ dryRun = true }) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    return await migrationRunner({
      dbClient: dbClient,
      dryRun: dryRun,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient?.end();
  }
}
