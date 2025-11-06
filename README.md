<div align="center">

# IntelliSense Clipboard

<img width="128" height="128" alt="logo" src="https://github.com/user-attachments/assets/d5a5eac3-79f4-4ab1-891c-52f19fa407aa" />

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/Decrypt.intellisense-clipboard)](https://marketplace.visualstudio.com/items?itemName=Decrypt.intellisense-clipboard)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Quickly copy TypeScript and JavaScript error messages and diagnostics to your clipboard directly from the Quick Fix menu.

<img width="855" height="518" alt="screenshot" src="https://github.com/user-attachments/assets/180a68cd-f9db-4ac1-a079-fd68ce5c9f6c" />

</div>

## Features

- **Quick Fix Integration**: Adds a "Copy Error Message" option to the Quick Fix menu when hovering over errors or warnings
- **Keyboard Shortcut**: Press `Ctrl+Alt+C` (or `Cmd+Alt+C` on Mac) to copy diagnostics at your cursor position
- **Formatted Output**: Copies error messages with severity level, source, error code, and full message text

## Usage

### Method 1: Quick Fix Menu (Recommended)

1. Hover over any TypeScript or JavaScript error/warning in your code
2. Click the **[Quick Fix]** button in the hover popup
3. Select **"Copy Error Message"** from the menu
4. The error message is now in your clipboard!

### Method 2: Keyboard Shortcut

1. Place your cursor on an error or warning
2. Press `Ctrl+Alt+C` (Windows/Linux) or `Cmd+Alt+C` (Mac)
3. The diagnostic message is copied to your clipboard

## Copied Format

Error messages are copied in this format:

```ts
[Error] ts (2322)
Type 'string' is not assignable to type 'number'.
```

Multiple diagnostics are separated with `---`.

## Supported Languages

- TypeScript (`.ts`)
- JavaScript (`.js`)
- TypeScript React (`.tsx`)
- JavaScript React (`.jsx`)

## Requirements

- Visual Studio Code version 1.80.0 or higher

## Extension Settings

This extension does not add any VS Code settings.

## Release Notes

### 0.1.0

Initial release:

- Quick Fix menu integration
- Keyboard shortcut support
- TypeScript and JavaScript support

## License

MIT

## Contributing

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/Decryptu/intellisense-clipboard).
