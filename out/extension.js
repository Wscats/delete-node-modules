"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = exports.deleteAllNodeModulesInFolder = void 0;
const vscode = require("vscode");
const rimraf = require("rimraf");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const searchNodeModules = require("./search-node-modules");
function deleteAllNodeModulesInFolder(dir) {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (let i = 0; i < files.length; i++) {
            const newPath = path.join(dir, files[i]);
            const stat = fs.statSync(newPath);
            const name = path.basename(newPath);
            if (stat.isDirectory()) {
                if (name === 'node_modules') {
                    usePathToDeleteNodeModules({ fsPath: newPath });
                }
                deleteAllNodeModulesInFolder(newPath);
            }
        }
    }
}
exports.deleteAllNodeModulesInFolder = deleteAllNodeModulesInFolder;
function usePathToDeleteNodeModules(path) {
    rimraf(path.fsPath, (data) => {
        if (!data) {
            vscode.window.showInformationMessage("Delete Node Modules Succeeded!");
            exec("npm cache clean", (err, stdout, stderr) => {
                if (err) {
                    console.error("clean cache failed");
                    return;
                }
                console.error("clean cache succeeded");
            });
        }
        else {
            vscode.window.showInformationMessage("Delete Node Modules Failed!");
        }
    });
}
function activate(context) {
    console.log('Congratulations, your extension "delete-node-modules" is now active!');
    let usePathToDeleteNodeModulesCommand = vscode.commands.registerCommand("delete-node-modules.usePathToDeleteNodeModulesCommand", (path) => {
        if (path.fsPath.slice(-12) === 'node_modules') {
            usePathToDeleteNodeModules(path);
        }
        else {
            deleteAllNodeModulesInFolder(path.fsPath);
        }
    });
    context.subscriptions.push(usePathToDeleteNodeModulesCommand);
    context.subscriptions.push(searchNodeModules);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map