---
id: migrations
title: Migrations
---

## Apollo Server Express

If included, run from `packages/server`.

Common commands are shown below. Additional commands are documented at https://typeorm.io/#/migrations

### `yarn typeorm migration:run`

Executes all pending migrations and runs them in a sequence ordered by their timestamps. This means all sql queries written in the up methods of your created migrations will be executed.

### `yarn typeorm migration:revert`

Executes down in the latest executed migration. If you need to revert multiple migrations you must call this command multiple times.

### `yarn typeorm migration:generate -n <title>`

Automatically generate migration files in the format `{TIMESTAMP}-{title}.ts` with schema changes you made.

## Hasura

If included, run from `packages/server`.

Common commands are shown below. Additional commands are documented at https://hasura.io/docs/1.0/graphql/core/hasura-cli/hasura_migrate.html#hasura-migrate. Learn more about Hasura migrations at https://hasura.io/docs/1.0/graphql/core/migrations/index.html

### `yarn hasura migrate apply`

Applies all migrations to the database.

### `hasura migrate status`

Displays the current status of migrations on a database.
