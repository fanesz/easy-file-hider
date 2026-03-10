import * as vscode from 'vscode';
import { TOGGLE_STATE_KEY } from './constants';

export function createStatusBarItem(context: vscode.ExtensionContext): vscode.StatusBarItem {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

  // Set initial icon based on state
  const isCurrentlyHidden = context.workspaceState.get<boolean>(TOGGLE_STATE_KEY, true);
  statusBarItem.text = isCurrentlyHidden ? '$(eye-closed) Hide Files' : '$(eye) Hide Files';

  statusBarItem.command = 'easy-file-hider.showMenu';
  statusBarItem.tooltip = 'Manage hidden files in workspace';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  return statusBarItem;
}
