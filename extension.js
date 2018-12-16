// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "github-line-share" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.shareGithubLine', function () {
        // The code you place here will be executed every time your command is executed
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const gitExtension = vscode.extensions.getExtension('vscode.git')
            console.log(gitExtension)
            if (gitExtension) {
                const api = gitExtension.exports.getAPI(1);
                if (api.repositories[0].state.remotes[0]) {
                    const remoteRepo = api.repositories[0].state.remotes[0].fetchUrl
                    const repoName = remoteRepo.match(/github\.com.(.*)\.git$/)[1];
                    const filePath = getRelativeFileName(editor)
                    const urlCompatibleFilePath = backToCommonSlash(filePath)
                    const currentLine = getCursorLine(editor)
                    const lineGithubUrl = createGithubUrl(repoName, urlCompatibleFilePath, currentLine)
                    vscode.window.showInformationMessage(`your link is: ${lineGithubUrl}`);                
            }
            }
        }
        // Display a message box to the user
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {

}

exports.deactivate = deactivate;




function getCursorLine(editor) {
    const position = editor.selection.active;
    const currentLine = position.line + 1;
    return currentLine
}

function getFolderName() {
    return vscode.workspace.name
}

function getRelativeFileName(editor) {
    let fileName = editor.document.fileName
    return vscode.workspace.asRelativePath(fileName);
}

function backToCommonSlash(str) {
    return str.replace('\\', '/')
}

function createGithubUrl(repoName, filePath, lineNumber) {
    return `https://github.com/${repoName}/blob/master/${filePath}#L${lineNumber}`
}
