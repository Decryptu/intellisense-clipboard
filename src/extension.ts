import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  // Register Code Action Provider (Quick Fix)
  const codeActionProvider = vscode.languages.registerCodeActionsProvider(
    '*', // All file types
    {
      async provideCodeActions(document, range, codeActionContext, token) {
        // Only show if there are diagnostics (errors/warnings) at this location
        const diagnostics = codeActionContext.diagnostics;
        if (!diagnostics || diagnostics.length === 0) {
          return [];
        }

        // Collect diagnostic messages
        const diagnosticMessages: string[] = [];
        for (const diagnostic of diagnostics) {
          let message = `[${diagnostic.severity === vscode.DiagnosticSeverity.Error ? 'Error' :
                          diagnostic.severity === vscode.DiagnosticSeverity.Warning ? 'Warning' :
                          diagnostic.severity === vscode.DiagnosticSeverity.Information ? 'Info' : 'Hint'}]`;

          if (diagnostic.source) {
            message += ` ${diagnostic.source}`;
          }
          if (diagnostic.code) {
            message += ` (${diagnostic.code})`;
          }
          message += `\n${diagnostic.message}`;

          diagnosticMessages.push(message);
        }

        const diagnosticContent = diagnosticMessages.join('\n\n---\n\n');

        // Create the copy action for diagnostics
        const copyDiagnosticAction = new vscode.CodeAction(
          '📋 Copy Error Message',
          vscode.CodeActionKind.QuickFix
        );
        copyDiagnosticAction.command = {
          command: 'intellisenseClipboard.copyContent',
          title: 'Copy Error Message',
          arguments: [diagnosticContent],
        };

        return [copyDiagnosticAction];
      },
    },
    {
      providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
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

  // Keyboard shortcut command - copy diagnostics at cursor
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
        // Get all diagnostics for the current document
        const allDiagnostics = vscode.languages.getDiagnostics(document.uri);

        // Filter diagnostics that contain the cursor position
        const diagnosticsAtCursor = allDiagnostics.filter(diagnostic =>
          diagnostic.range.contains(position)
        );

        if (diagnosticsAtCursor.length === 0) {
          vscode.window.showInformationMessage('No error or warning at cursor position');
          return;
        }

        // Format diagnostic messages
        const diagnosticMessages: string[] = [];
        for (const diagnostic of diagnosticsAtCursor) {
          let message = `[${diagnostic.severity === vscode.DiagnosticSeverity.Error ? 'Error' :
                          diagnostic.severity === vscode.DiagnosticSeverity.Warning ? 'Warning' :
                          diagnostic.severity === vscode.DiagnosticSeverity.Information ? 'Info' : 'Hint'}]`;

          if (diagnostic.source) {
            message += ` ${diagnostic.source}`;
          }
          if (diagnostic.code) {
            message += ` (${diagnostic.code})`;
          }
          message += `\n${diagnostic.message}`;

          diagnosticMessages.push(message);
        }

        const diagnosticContent = diagnosticMessages.join('\n\n---\n\n');
        await vscode.env.clipboard.writeText(diagnosticContent);

        vscode.window.showInformationMessage(`✓ Copied ${diagnosticsAtCursor.length} diagnostic(s) to clipboard!`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Failed to copy: ${errorMessage}`);
      }
    }
  );

  context.subscriptions.push(codeActionProvider, copyCommand, keyboardCommand);
}

export function deactivate() {}