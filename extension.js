// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// const vscode = require('vscode');

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed

// /**
//  * @param {vscode.ExtensionContext} context
//  */
// function activate(context) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "devora" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with  registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	const disposable = vscode.commands.registerCommand('devora.helloWorld', function () {
// 		// The code you place here will be executed every time your command is executed

// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from DEVORA!');
// 	});

// 	context.subscriptions.push(disposable);
// }

// // This method is called when your extension is deactivated
// function deactivate() {}

// module.exports = {
// 	activate,
// 	deactivate
// }

//..........................................................
const vscode = require('vscode');

function activate(context) {
    // Log when the extension is activated
    console.log('Congratulations, your extension "devora" is now active!');

    // Register a command to show the AI suggestions UI
    const showAISuggestionsCommand = vscode.commands.registerCommand('devora.showAiSuggestions', function () {
        // Create a WebView panel for AI suggestions
        const panel = vscode.window.createWebviewPanel(
            'aiSuggestions', // WebView ID
            'AI Code Suggestions', // Panel Title
            // vscode.ViewColumn.One, // Open the WebView in the first column
            // {
            //     enableScripts: true, // Allow JavaScript to run in the WebView
            // }
			vscode.ViewColumn.Beside, // Open the WebView beside the current editor
            {
                enableScripts: true, // Allow JavaScript to run in the WebView
            }
        );

        // Set the HTML content for the WebView
        panel.webview.html = getWebviewContent();

        // Optionally, listen for messages from the WebView (e.g., user inputs or requests)
        panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'fetchSuggestions':
                        // Call your AI model or API here and send back suggestions
                        const suggestions = getAICodeSuggestions();
                        panel.webview.postMessage({ command: 'displaySuggestions', suggestions });
                        return;
                }
            },
            undefined,
            context.subscriptions
        );
    });

    context.subscriptions.push(showAISuggestionsCommand);
}

// Helper function to return the HTML content for the WebView
function getWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Suggestions</title>
    </head>
    <body>
        <h1>AI Code Suggestions</h1>
        <div id="suggestions">Loading suggestions...</div>
        <script>
            // Send a message to the extension to fetch suggestions
            vscode.postMessage({ command: 'fetchSuggestions' });

            // Listen for the suggestions from the extension
            window.addEventListener('message', event => {
                const message = event.data;
                if (message.command === 'displaySuggestions') {
                    const suggestionsDiv = document.getElementById('suggestions');
                    suggestionsDiv.innerHTML = '';
                    message.suggestions.forEach(suggestion => {
                        const suggestionElement = document.createElement('p');
                        suggestionElement.textContent = suggestion;
                        suggestionsDiv.appendChild(suggestionElement);
                    });
                }
            });
        </script>
    </body>
    </html>`;
}

// This is a mock function for AI suggestions
// You should replace this with a real call to your AI service
function getAICodeSuggestions() {
    return [
        'Use const instead of let for this variable.',
        'Consider renaming this function to be more descriptive.',
        'You can optimize this loop by using array methods.',
    ];
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};

