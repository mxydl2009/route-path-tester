// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import getWebviewContent from './getWebviewContent';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cat Coding" is now active, good!');
	let currentPanel: vscode.WebviewPanel | undefined = undefined;

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('routePathTester', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		if (currentPanel) {
			currentPanel.reveal(vscode.ViewColumn.One);
		} else {
			currentPanel = vscode.window.createWebviewPanel(
				'route path tester',
				'route path tester',
				vscode.ViewColumn.One,
				{
					// 在webview中启用脚本
					enableScripts: true,
					// 只允许webview加载我们插件的`media`目录下的资源
					localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
				}
			);
			const currentTheme = vscode.workspace.getConfiguration('workbench').get<string>('colorTheme');
			currentPanel.webview.html = getWebviewContent(context, currentPanel, currentTheme);
			currentPanel.onDidDispose(
				() => {
					currentPanel = undefined;
				},
				undefined,
				context.subscriptions
			);
		}
		// 注册一个配置改变事件监听器
		vscode.workspace.onDidChangeConfiguration((event) => {
			// 判断是否是主题改变引起的配置改变
			if (event.affectsConfiguration('workbench.colorTheme')) {
					// 主题改变时的处理逻辑
					const themeName = vscode.workspace.getConfiguration('workbench').get<string>('colorTheme');
					const nextTheme = themeName?.includes('Dark')? 'dark': 'light';
					// 向webview发送消息，告知主题更改，由webview的脚本处理
					currentPanel?.webview.postMessage({theme: nextTheme});
			}
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
