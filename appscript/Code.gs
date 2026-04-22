// ABOUTME: Google Apps Script handler for form submissions
// ABOUTME: Receives GET requests and appends form data to Google Sheets

function doGet(e) {
  try {
    // Parse the data parameter
    const data = JSON.parse(e.parameter.data || '{}');

    // Your Google Sheets ID - REPLACE THIS!
    const SPREADSHEET_ID = '1M5G2ock6BrMgpZDcK8wJeQTlCDM8QjivULLPad0OIk4';

    // Get the spreadsheet
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();

    // Add headers if they don't exist
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'Name',
        'Email',
        'Invite Code',
        'Coding Experience',
        'Uses Chatbots',
        'Uses IDEs',
        'Uses Coding Agents',
        'Uses Vibe Coding',
        'Chatbots Expertise',
        'IDEs Expertise',
        'Coding Agents Expertise',
        'Vibe Coding Expertise'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    // Prepare row data
    const rowData = [
      new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.invite_code || '',
      data.coding_experience || '',
      // AI Tools Used (Yes/No columns)
      (data.ai_tools_used || []).some(tool => tool.includes('ChatGPT') || tool.includes('Gemini')) ? 'Yes' : '',
      (data.ai_tools_used || []).some(tool => tool.includes('Cursor') || tool.includes('Windsurf')) ? 'Yes' : '',
      (data.ai_tools_used || []).some(tool => tool.includes('Claude Code') || tool.includes('Codex')) ? 'Yes' : '',
      (data.ai_tools_used || []).some(tool => tool.includes('Lovable') || tool.includes('v0') || tool.includes('Replit')) ? 'Yes' : '',
      // Expertise levels
      (data.ai_tool_expertise || {}).chatbots || '',
      (data.ai_tool_expertise || {}).ides || '',
      (data.ai_tool_expertise || {}).agents || '',
      (data.ai_tool_expertise || {}).vibe || ''
    ];

    // Append the data
    sheet.appendRow(rowData);

    // Create success response
    const response = {
      success: true,
      message: 'Data submitted successfully'
    };

    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());

    const errorResponse = {
      success: false,
      error: error.toString()
    };

    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
