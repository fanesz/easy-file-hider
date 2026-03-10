import * as vscode from 'vscode';
import { STATE_KEY, TOGGLE_STATE_KEY } from './constants';
import { closeEditorsMatchingPatterns } from './utils';

export async function addHiddenItem(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
  const input = await vscode.window.showInputBox({
    prompt: 'Example: node_modules, *.spec.js',
    placeHolder: 'e.g. node_modules, dist, *.spec.js'
  });

  if (!input) {
    return;
  }

  const items = input.split(',').map(item => item.trim()).filter(item => item.length > 0);
  if (items.length === 0) {
    return;
  }

  const addedPatterns = context.workspaceState.get<string[]>(STATE_KEY, []);
  let updated = false;

  // Use Workspace target so it updates .vscode/settings.json
  const target = vscode.ConfigurationTarget.Workspace;
  const workspaceExclude = config.inspect<Record<string, boolean>>('files.exclude')?.workspaceValue || {};

  for (const item of items) {
    const pattern = `**/${item}`;
    if (!workspaceExclude[pattern]) {
      workspaceExclude[pattern] = true;
      addedPatterns.push(pattern);
      updated = true;
    }
  }

  if (updated) {
    await config.update('files.exclude', workspaceExclude, target);
    await context.workspaceState.update(STATE_KEY, [...new Set(addedPatterns)]);

    // Auto-close any opened editors that match the newly hidden patterns
    await closeEditorsMatchingPatterns(items);

    vscode.window.showInformationMessage(`Added ${items.length} item(s) to hidden files.`);
  }
}

export async function showHiddenList(config: vscode.WorkspaceConfiguration) {
  const workspaceExclude = config.inspect<Record<string, boolean>>('files.exclude')?.workspaceValue || {};
  const activeExcludes = Object.keys(workspaceExclude).filter(key => workspaceExclude[key]);

  if (activeExcludes.length === 0) {
    vscode.window.showInformationMessage('No hidden files/folders found.');
    return;
  }

  await vscode.window.showQuickPick(activeExcludes, {
    placeHolder: 'Currently hidden patterns (read-only)'
  });
}

export async function removeHiddenItem(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
  // Only remove items from the workspace settings to prevent altering global settings
  const workspaceExclude = config.inspect<Record<string, boolean>>('files.exclude')?.workspaceValue || {};
  const keys = Object.keys(workspaceExclude).filter(key => workspaceExclude[key]);

  if (keys.length === 0) {
    vscode.window.showInformationMessage('No hidden items in workspace settings to remove.');
    return;
  }

  const selection = await vscode.window.showQuickPick(keys, {
    placeHolder: 'Select a pattern to remove from hidden list'
  });

  if (selection) {
    delete workspaceExclude[selection];
    const newValue = Object.keys(workspaceExclude).length === 0 ? undefined : workspaceExclude;
    await config.update('files.exclude', newValue, vscode.ConfigurationTarget.Workspace);

    // Remove from our tracked state
    let addedPatterns = context.workspaceState.get<string[]>(STATE_KEY, []);
    addedPatterns = addedPatterns.filter(p => p !== selection);
    await context.workspaceState.update(STATE_KEY, addedPatterns);

    vscode.window.showInformationMessage(`Removed ${selection} from hidden files.`);
  }
}

export async function clearAllHiddenItems(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
  const workspaceExclude = config.inspect<Record<string, boolean>>('files.exclude')?.workspaceValue || {};
  const addedPatterns = context.workspaceState.get<string[]>(STATE_KEY, []);

  if (addedPatterns.length === 0) {
    vscode.window.showInformationMessage('No hidden items were added by this extension to clear.');
    return;
  }

  let updated = false;
  for (const pattern of addedPatterns) {
    if (workspaceExclude[pattern] !== undefined) {
      delete workspaceExclude[pattern];
      updated = true;
    }
  }

  if (updated) {
    const newValue = Object.keys(workspaceExclude).length === 0 ? undefined : workspaceExclude;
    await config.update('files.exclude', newValue, vscode.ConfigurationTarget.Workspace);
  }

  // Clear tracked state
  await context.workspaceState.update(STATE_KEY, []);
  vscode.window.showInformationMessage('Cleared all hidden items added by the extension.');
}

export async function toggleHiddenItems(
  context: vscode.ExtensionContext,
  config: vscode.WorkspaceConfiguration,
  statusBarItem: vscode.StatusBarItem
) {
  const workspaceExclude = config.inspect<Record<string, boolean>>('files.exclude')?.workspaceValue || {};
  const addedPatterns = context.workspaceState.get<string[]>(STATE_KEY, []);

  if (addedPatterns.length === 0) {
    vscode.window.showInformationMessage('No hidden items were added by this extension.');
    return;
  }

  const isCurrentlyHidden = context.workspaceState.get<boolean>(TOGGLE_STATE_KEY, true);

  if (isCurrentlyHidden) {
    // Temporarily Show: Set all our added patterns to false
    for (const pattern of addedPatterns) {
      if (workspaceExclude[pattern] !== undefined) {
        workspaceExclude[pattern] = false;
      }
    }
    await config.update('files.exclude', workspaceExclude, vscode.ConfigurationTarget.Workspace);
    await context.workspaceState.update(TOGGLE_STATE_KEY, false);
    vscode.window.showInformationMessage('Temporarily showing hidden items. Toggle again to hide.');
  } else {
    // Restore: Set them back to true
    for (const pattern of addedPatterns) {
      if (workspaceExclude[pattern] !== undefined) {
        workspaceExclude[pattern] = true;
      }
    }
    await config.update('files.exclude', workspaceExclude, vscode.ConfigurationTarget.Workspace);
    await context.workspaceState.update(TOGGLE_STATE_KEY, true);

    // Auto-close editors again when re-hiding
    await closeEditorsMatchingPatterns(addedPatterns.map(p => p.replace('**/', '')));

    vscode.window.showInformationMessage('Restored hidden items.');
  }

  // Update status bar icon
  const newState = context.workspaceState.get<boolean>(TOGGLE_STATE_KEY, true);
  statusBarItem.text = newState ? '$(eye-closed) Hide Files' : '$(eye) Hide Files';
}
