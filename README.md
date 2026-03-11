# Easy File Hider

A minimal and clean VS Code extension that allows you to easily hide files or folders from the Explorer through a simple UI, instead of manually editing your `settings.json`.


Demo Video: https://github.com/user-attachments/assets/0ad34a79-6c6f-4552-b178-e1b6e8fde2c4


## Installation

You can download this extension from:
- [VSCode Extension Marketplace - Easy File Hider](https://marketplace.visualstudio.com/items?itemName=Fanesz.easy-file-hider) (Default VSCode)
- [Open VSX - Easy File Hider](https://open-vsx.org/extension/Fanesz/easy-file-hider) (Antigravity, etc)


<img width="324" height="151" alt="image" src="https://github.com/user-attachments/assets/bea9b18c-b1e8-47ad-8c62-bbe489733cde" />


## Features

- Status bar button on the right: `$(eye-closed) Hide Files`
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
