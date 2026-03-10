import * as vscode from 'vscode';
import { TOGGLE_STATE_KEY } from './constants';
import { createStatusBarItem } from './statusBar';
import { addHiddenItem, showHiddenList, removeHiddenItem, clearAllHiddenItems, toggleHiddenItems } from './commands';

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  statusBarItem = createStatusBarItem(context);

  // Register Menu Command
  const disposable = vscode.commands.registerCommand('easy-file-hider.showMenu', async () => {
    const isCurrentlyHidden = context.workspaceState.get<boolean>(TOGGLE_STATE_KEY, true);
    const toggleText = isCurrentlyHidden ? 'Toggle: Show all hidden items' : 'Toggle: Hide all hidden items';

    const options = [
      'Add files/folders to hide',
      'Show hidden list',
      'Remove hidden item',
      'Clear all hidden items',
      toggleText
    ];

    const selection = await vscode.window.showQuickPick(options, {
      placeHolder: 'Select an action for hiding files'
    });

    if (!selection) {
      return;
    }

    const config = vscode.workspace.getConfiguration();

    switch (selection) {
      case 'Add files/folders to hide':
        await addHiddenItem(context, config);
        break;
      case 'Show hidden list':
        await showHiddenList(config);
        break;
      case 'Remove hidden item':
        await removeHiddenItem(context, config);
        break;
      case 'Clear all hidden items':
        await clearAllHiddenItems(context, config);
        break;
      case 'Toggle: Show all hidden items':
      case 'Toggle: Hide all hidden items':
        await toggleHiddenItems(context, config, statusBarItem);
        break;
    }
  });

  // Register an explicit command for the command palette toggle
  const toggleDisposable = vscode.commands.registerCommand('easy-file-hider.toggleFiles', async () => {
    const config = vscode.workspace.getConfiguration();
    await toggleHiddenItems(context, config, statusBarItem);
  });

  context.subscriptions.push(disposable, toggleDisposable);
}

export function deactivate() { }

