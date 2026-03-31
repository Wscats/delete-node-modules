/**
 * Delete Node Modules - VSCode Extension.
 * Allows users to quickly delete or search node_modules directories.
 *
 * @author Eno Yao
 */

import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";

const rimraf = require("rimraf");
const searchNodeModules = require("./search-node-modules");

/**
 * Recursively find and delete all `node_modules` directories within a folder.
 *
 * @param dir - The root directory to scan.
 */
export function deleteAllNodeModulesInFolder(dir: string): void {
  if (!fs.existsSync(dir)) {
    return;
  }

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    const name = path.basename(fullPath);

    if (stat.isDirectory()) {
      if (name === "node_modules") {
        deleteNodeModulesAtPath(fullPath);
      }
      deleteAllNodeModulesInFolder(fullPath);
    }
  }
}

/**
 * Delete a `node_modules` directory at the given path and clean npm cache.
 *
 * @param targetPath - The absolute path to the node_modules directory.
 */
function deleteNodeModulesAtPath(targetPath: string): void {
  rimraf(targetPath, (error: Error | null) => {
    if (!error) {
      vscode.window.showInformationMessage("Delete Node Modules Succeeded!");
      exec("npm cache clean", (err, _stdout, _stderr) => {
        if (err) {
          console.error("clean cache failed");
          return;
        }
        console.log("clean cache succeeded");
      });
    } else {
      vscode.window.showInformationMessage("Delete Node Modules Failed!");
    }
  });
}

/**
 * Called when the extension is activated.
 * Registers the delete and search commands.
 */
export function activate(context: vscode.ExtensionContext): void {
  console.log(
    'Congratulations, your extension "delete-node-modules" is now active!'
  );

  const deleteCommand = vscode.commands.registerCommand(
    "delete-node-modules.usePathToDeleteNodeModulesCommand",
    (uri: vscode.Uri) => {
      if (uri.fsPath.endsWith("node_modules")) {
        deleteNodeModulesAtPath(uri.fsPath);
      } else {
        deleteAllNodeModulesInFolder(uri.fsPath);
      }
    }
  );

  context.subscriptions.push(deleteCommand);
  context.subscriptions.push(searchNodeModules);
}

/**
 * Called when the extension is deactivated.
 */
export function deactivate(): void {
  // No cleanup needed
}
