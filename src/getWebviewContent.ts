import * as vscode from 'vscode';
import * as path from 'path';
type themeName = 'dark' | 'light';

// export const toggleTheme = (theme: themeName) => {
//   if (theme === 'dark') {
//     document.documentElement.classList.add(theme);
//   } else {
//     document.documentElement.classList.remove(theme);
//   }
// }

export default function getWebviewContent (context: vscode.ExtensionContext, webviewPanel: vscode.WebviewPanel, currentTheme: string | undefined) {
  const getMediaResource = (fileName: string) => {
    return webviewPanel.webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, 'media', fileName))
    );
  };

  return `
  <!DOCTYPE html>
    <html lang="en" class=${currentTheme?.includes('Dark')? 'dark': ''}>
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>route-path-tester</title>
        <script defer="defer" src="${getMediaResource('app.js')}"></script>
        <link href="${getMediaResource('app.css')}" rel="stylesheet" />
      </head>
      <body>
        <div id="app"></div>
      </body>
    </html>
  `;
}