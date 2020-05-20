// Adapted from create-react-app
// https://github.com/facebook/create-react-app/blob/f5c3bdb65480f93b2d4a4c2f3214fc50753de434/packages/create-react-app/createReactApp.js
// https://github.com/facebook/create-react-app/blob/47e9e2c7a07bfe60b52011cf71de5ca33bdeb6e3/packages/react-scripts/scripts/init.js
import chalk from "chalk";
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import validateProjectName from "validate-npm-package-name";

export function checkAppName(appName: string) {
  const validationResult = validateProjectName(appName);
  if (!validationResult.validForNewPackages) {
    console.error(
      chalk.red(
        `Cannot create a project named ${chalk.green(
          `"${appName}"`
        )} because of npm naming restrictions:\n`
      )
    );
    [
      ...(validationResult.errors || []),
      ...(validationResult.warnings || []),
    ].forEach((error) => {
      console.error(chalk.red(`  * ${error}`));
    });
    console.error(chalk.red("\nPlease choose a different project name."));
    process.exit(1);
  }

  // TODO: there should be a single place that holds the dependencies
  const dependencies = ["react", "react-dom", "react-scripts"].sort();
  if (dependencies.includes(appName)) {
    console.error(
      chalk.red(
        `Cannot create a project named ${chalk.green(
          `"${appName}"`
        )} because a dependency with the same name exists.\n` +
          `Due to the way npm works, the following names are not allowed:\n\n`
      ) +
        chalk.cyan(dependencies.map((depName) => `  ${depName}`).join("\n")) +
        chalk.red("\n\nPlease choose a different project name.")
    );
    process.exit(1);
  }
}

// If project only contains files generated by GH, it’s safe.
// Also, if project contains remnant error logs from a previous
// installation, lets remove them now.
// We also special case IJ-based products .idea because it integrates with CRA:
// https://github.com/facebook/create-react-app/pull/368#issuecomment-243446094
export function isSafeToCreateProjectIn(root: string, name: string) {
  const validFiles = new Set([
    ".DS_Store",
    ".git",
    ".gitattributes",
    ".gitignore",
    ".gitlab-ci.yml",
    ".hg",
    ".hgcheck",
    ".hgignore",
    ".idea",
    ".npmignore",
    ".travis.yml",
    "docs",
    "LICENSE",
    "README.md",
    "mkdocs.yml",
    "Thumbs.db",
  ]);
  // These files should be allowed to remain on a failed install, but then
  // silently removed during the next create.
  const errorLogFilePatterns = [
    "npm-debug.log",
    "yarn-error.log",
    "yarn-debug.log",
  ];
  const isErrorLog = (file: string): boolean => {
    return errorLogFilePatterns.some((pattern) => file.startsWith(pattern));
  };

  const conflicts = fs
    .readdirSync(root)
    .filter((file) => !validFiles.has(file))
    // IntelliJ IDEA creates module files before CRA is launched
    .filter((file) => !/\.iml$/.test(file))
    // Don't treat log files from previous installation as conflicts
    .filter((file) => !isErrorLog(file));

  if (conflicts.length > 0) {
    console.log(
      `The directory ${chalk.green(name)} contains files that could conflict:`
    );
    console.log();
    for (const file of conflicts) {
      try {
        const stats = fs.lstatSync(path.join(root, file));
        if (stats.isDirectory()) {
          console.log(`  ${chalk.blue(`${file}/`)}`);
        } else {
          console.log(`  ${file}`);
        }
      } catch {
        console.log(`  ${file}`);
      }
    }
    console.log();
    console.log(
      "Either try using a new directory name, or remove the files listed above."
    );

    return false;
  }

  // Remove any log files from a previous installation.
  fs.readdirSync(root).forEach((file) => {
    if (isErrorLog(file)) {
      fs.removeSync(path.join(root, file));
    }
  });
  return true;
}

export function shouldUseYarn() {
  try {
    execSync("yarnpkg --version", { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}

function isInGitRepository(appPath: string) {
  try {
    execSync(`git -C ${appPath} rev-parse --is-inside-work-tree`, {
      stdio: "ignore",
    });
    return true;
  } catch (error) {
    return false;
  }
}

function isInMercurialRepository(appPath: string) {
  try {
    execSync(`hg --cwd ${appPath} root`, { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}

export function tryGitInit(appPath: string) {
  let didInit = false;
  try {
    execSync(`git -C ${appPath} --version`, { stdio: "ignore" });
    if (isInGitRepository(appPath) || isInMercurialRepository(appPath)) {
      return false;
    }

    execSync(`git -C ${appPath} init`, { stdio: "ignore" });
    didInit = true;

    execSync(`git -C ${appPath} add -A`, { stdio: "ignore" });
    execSync(
      `git -C ${appPath} commit -m "Initial commit from Create Full Stack"`,
      {
        stdio: "ignore",
      }
    );
    return true;
  } catch (error) {
    if (didInit) {
      // If we successfully initialized but couldn't commit,
      // maybe the commit author config is not set.
      // In the future, we might supply our own committer
      // like Ember CLI does, but for now, let's just
      // remove the Git files to avoid a half-done state.
      try {
        // unlinkSync() doesn't work on directories.
        fs.removeSync(path.join(appPath, ".git"));
      } catch (removeError) {
        // Ignore.
      }
    }
    return false;
  }
}
