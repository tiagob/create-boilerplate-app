import { JSONSchemaForNPMPackageJsonFiles } from "@schemastore/package";
import chalk from "chalk";
import commander from "commander";
import spawn from "cross-spawn";
import fs from "fs-extra";
import yaml from "js-yaml";
import os from "os";
import path from "path";

import packageJson from "../package.json";
import appPackageJson from "../templates/package.json";
import vscodeSettingsJson from "../templates/vscode/settings.json";
import {
  checkAppName,
  isSafeToCreateProjectIn,
  shouldUseYarn,
  tryGitInit,
} from "./createReactAppUtils";

const backends = ["apollo", "hasura", "firestore"];
const nodeBackends = new Set(["apollo"]);
// TODO: Add auth0
const auths = {
  firebase: "firebase-auth",
  "": "no-auth",
};
type Auths = typeof auths;

let projectName = "";

interface Program extends commander.Command {
  backend?: string;
  web?: boolean;
  mobile?: boolean;
  auth?: string;
}

const program: Program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments("<project-directory>")
  .usage(`${chalk.green("<project-directory>")} [options]`)
  .action((name) => {
    projectName = name;
  })
  .option("-b, --backend <backend>", `backend type [${backends.join("|")}]`)
  .option("-w, --web", "include react website")
  .option("-m, --mobile", "include react-native mobile app")
  .option("-a, --auth <auth>", `auth type [${Object.keys(auths).join("|")}]`)
  .parse(process.argv);

// Don't include any local files. node_modules and yarn.lock will be different
// depending on what packages are included because yarn puts these at the root
// of the project
const excludeFiles = new Set(["node_modules", "build", "yarn.lock"]);
function filterCopySync(src: string): boolean {
  const fileOrFolder = path.basename(src);
  return !excludeFiles.has(fileOrFolder);
}

function copySync(templatePath: string, appPath: string, silent = false) {
  fs.ensureDirSync(templatePath);
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, appPath, { filter: filterCopySync });
  } else if (!silent) {
    console.error(
      `Could not locate supplied template: ${chalk.green(templatePath)}`
    );
  }
}

function addApolloCodegen() {
  const appPackage: JSONSchemaForNPMPackageJsonFiles = { ...appPackageJson };
  appPackage.devDependencies = Object.assign(appPackage.devDependencies || {}, {
    "@graphql-codegen/cli": "^1.14.0",
    "@graphql-codegen/typescript": "^1.14.0",
    "@graphql-codegen/typescript-operations": "^1.14.0",
    "@graphql-codegen/typescript-react-apollo": "^1.14.0",
    "@graphql-codegen/typescript-resolvers": "^1.14.0",
    graphql: "^14.2.1",
    "graphql-tag": "^2.0.0",
  });
  appPackage.scripts = Object.assign(appPackage.scripts || {}, {
    generate: "graphql-codegen --watch",
  });
  fs.writeFileSync(
    `${projectName}/package.json`,
    JSON.stringify(appPackage, undefined, 2) + os.EOL
  );

  fs.writeFileSync(
    `${projectName}/codegen.yml`,
    yaml.safeDump({
      schema: "packages/backend/src/graphql/schema.ts",
      documents: "packages/*/src/graphql/*.graphql",
      generates: {
        "packages/backend/src/graphql/__generated__/index.ts": {
          plugins: ["typescript", "typescript-resolvers"],
          config: {
            useIndexSignature: true,
          },
        },
        ...(program.mobile && {
          "packages/mobile/src/graphql/__generated__/index.ts": {
            plugins: [
              "typescript",
              "typescript-operations",
              "typescript-react-apollo",
            ],
            config: {
              withHOC: false,
              withComponent: false,
              withHooks: true,
            },
          },
        }),
      },
    }) + os.EOL
  );
}

function addVSCodeSettings() {
  if (program.backend === "apollo") {
    vscodeSettingsJson["eslint.workingDirectories"].push({
      directory: "packages/backend",
      changeProcessCWD: true,
    });
  }
  if (program.mobile) {
    vscodeSettingsJson["eslint.workingDirectories"].push({
      directory: "packages/mobile",
      changeProcessCWD: true,
    });
  }
  if (program.web) {
    vscodeSettingsJson["eslint.workingDirectories"].push({
      directory: "packages/web",
      changeProcessCWD: true,
    });
  }
  fs.ensureDirSync(`${projectName}/.vscode`);
  fs.writeFileSync(
    `${projectName}/.vscode/settings.json`,
    JSON.stringify(vscodeSettingsJson, undefined, 2) + os.EOL
  );
}

async function copyTemplate() {
  fs.copySync("./templates/gitignore", `${projectName}/.gitignore`);
  // Copy root package.json for Yarn workspaces
  fs.copySync("./templates/package.json", `${projectName}/package.json`);
  if (program.backend === "apollo") {
    addApolloCodegen();
  }
  addVSCodeSettings();

  const auth = auths[(program.auth || "") as keyof Auths];
  copySync(
    `./templates/backend/${program.backend}/${auth}`,
    nodeBackends.has(program.backend || "")
      ? `${projectName}/packages/backend`
      : `${projectName}/${program.backend}`
  );

  if (program.web) {
    copySync(
      `./templates/web/${program.backend}/${auth}`,
      `${projectName}/packages/web`
    );
  }

  if (program.mobile) {
    copySync(
      `./templates/mobile/${program.backend}/${auth}`,
      `${projectName}/packages/mobile`
    );
  }
}

function installDependencies() {
  const command = "yarnpkg";
  const args = ["--cwd", projectName];
  console.log(`Installing packages using ${command}...`);
  console.log();

  const proc = spawn.sync(command, args, { stdio: "inherit" });
  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(" ")}\` failed`);
    process.exit(1);
  }
}

async function run() {
  // Validation
  // TODO: Add Cloud Run for hasura handlers (event triggers or actions, crons?)
  if (!backends.includes(program.backend || "")) {
    console.error(
      `Specified backend-type not valid. Must be one of [${backends.join("|")}]`
    );
    process.exit(1);
  }
  if (program.auth && !(program.auth in auths)) {
    console.error(
      `Specified auth-type not valid. Must be one of [${Object.keys(auths).join(
        "|"
      )}]`
    );
    process.exit(1);
  }

  const root = path.resolve(projectName);
  const appName = path.basename(root);

  checkAppName(appName);
  fs.ensureDirSync(projectName);
  if (!isSafeToCreateProjectIn(root, projectName)) {
    process.exit(1);
  }
  console.log();
  // Yarn is required for Yarn workspaces (monorepo support)
  if (!shouldUseYarn()) {
    console.error(
      chalk.red(
        "Create Full Stack requires Yarn.\nPlease install Yarn. https://classic.yarnpkg.com/en/docs/install"
      )
    );
    process.exit(1);
  }
  console.log(`Creating a new full-stack app in ${chalk.green(root)}.`);
  console.log();

  await copyTemplate();

  installDependencies();

  if (tryGitInit(projectName)) {
    console.log();
    console.log("Initialized a git repository.");
  }
  console.log();
  console.log(`Success! Created ${appName} at ${projectName}`);
  console.log();
  console.log("Happy hacking!");
}

if (projectName && program.backend) {
  run();
} else {
  program.outputHelp();
}