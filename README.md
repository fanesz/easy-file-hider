# easy-file-hider

A minimal and clean VS Code extension that allows you to easily hide files or folders from the Explorer through a simple UI, instead of manually editing your `settings.json`.

## Features

- status bar button on the right: `$(eye-closed) Hide Files`
- Quick Pick menu with 4 minimal actions:
  - **Add files/folders to hide**: Input a comma-separated list like `node_modules, dist, .env` and it will automatically translate to glob patterns (e.g., `**/node_modules`) and update workspace `files.exclude`.
  - **Show hidden list**: View a list of everything currently hidden in your configurations.
  - **Remove hidden item**: Pick one item to remove from the hidden list in your workspace.
  - **Clear all hidden items**: Easily remove all entries that were added by this extension.
  - **Toggle: Hide/Show all hidden items**: Toggles the visibility of all hidden items in your workspace.

## Commands

In addition to the status bar button, you can manage the extension directly from the **Command Palette** (`Ctrl+Shift+P` on Windows/Linux, `Cmd+Shift+P` on macOS):

- `> Easy File Hide: Show Menu` - Opens the main UI Quick Pick menu.
- `> Easy File Hide: Toggle Visibility` - Immediately toggles the visibility of your hidden files.

## Requirements

No special requirements. It works securely on your workspace `.vscode/settings.json`.

## Installation

This extension is built to be run locally:

Download link coming soon...
