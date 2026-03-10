import * as vscode from 'vscode';
import { minimatch } from 'minimatch';

export async function closeEditorsMatchingPatterns(patterns: string[]) {
  // Convert patterns to full glob representation for minimatch since items are like 'node_modules', '*.spec.js'
  const globs = patterns.map(p => `**/${p}`);

  for (const editor of vscode.window.visibleTextEditors) {
    const filePath = vscode.workspace.asRelativePath(editor.document.uri);

    // Check if this file matches any of the new hidden globs
    const matches = globs.some(glob => minimatch(filePath, glob, { matchBase: true, dot: true }));

    if (matches) {
      // Close the document by showing it and executing the close command
      await vscode.window.showTextDocument(editor.document.uri, { preview: true, preserveFocus: false });
      await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    }
  }
}
