import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  // Register Code Action Provider (Quick Fix)
  const codeActionProvider = vscode.languages.registerCodeActionsProvider(
    '*', // All file types
    {
      async provideCodeActions(document, range, context, token) {
        const position = range.start;

        // Get hover content at this position
        const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
          'vscode.executeHoverProvider',
          document.uri,
          position
        );

        if (!hovers || hovers.length === 0) {
          return [];
        }

        // Collect hover content
        const contents: string[] = [];
        for (const hover of hovers) {
          for (const content of hover.contents) {
            if (typeof content === 'string') {
              contents.push(content);
            } else {
              contents.push(content.value);
            }
          }
        }

        const fullContent = contents.join('\n\n---\n\n');

        // Create the copy action
        const copyAction = new vscode.CodeAction(
          '📋 Copy IntelliSense Info',
          vscode.CodeActionKind.Empty
        );
        copyAction.command = {
          command: 'intellisenseClipboard.copyContent',
          title: 'Copy IntelliSense Info',
          arguments: [fullContent],
        };

        return [copyAction];
      },
    }
  );

  // Command to copy the content
  const copyCommand = vscode.commands.registerCommand(
    'intellisenseClipboard.copyContent',
    async (content: string) => {
      await vscode.env.clipboard.writeText(content);
      vscode.window.showInformationMessage('✓ IntelliSense info copied to clipboard!');
    }
  );

  // Keyboard shortcut command
  const keyboardCommand = vscode.commands.registerCommand(
    'intellisenseClipboard.copyAtCursor',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const position = editor.selection.active;
      const document = editor.document;

      try {
        const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
          'vscode.executeHoverProvider',
          document.uri,
          position
        );

        if (!hovers || hovers.length === 0) {
          vscode.window.showInformationMessage('No IntelliSense info at cursor');
          return;
        }

        const contents: string[] = [];
        for (const hover of hovers) {
          for (const content of hover.contents) {
            if (typeof content === 'string') {
              contents.push(content);
            } else {
              contents.push(content.value);
            }
          }
        }

        const fullContent = contents.join('\n\n---\n\n');
        await vscode.env.clipboard.writeText(fullContent);

        vscode.window.showInformationMessage('✓ Copied to clipboard!');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Failed to copy: ${errorMessage}`);
      }
    }
  );

  context.subscriptions.push(codeActionProvider, copyCommand, keyboardCommand);
}

export function deactivate() {}