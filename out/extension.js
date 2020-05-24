"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const rimraf = require("rimraf");
const { exec } = require("child_process");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "delete-node-modules" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let deleteNodeModules = vscode.commands.registerCommand("delete-node-modules.deleteNodeModules", (path) => {
        // Display a message box to the user
        rimraf(path.fsPath, (data) => {
            if (!data) {
                // npm cache clean
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
    });
    context.subscriptions.push(deleteNodeModules);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map