// ABOUTME: Google Apps Script handler for form submissions from dev++ and dev++ for Business
// ABOUTME: Routes to different sheets based on the source parameter in form data

function doGet(e) {
  try {
    var data = JSON.parse(e.parameter.data || '{}');

    var SPREADSHEET_ID = '1M5G2ock6BrMgpZDcK8wJeQTlCDM8QjivULLPad0OIk4';
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

    var source = data.source || 'default';

    if (source === 'business') {
      appendBusinessSubmission(spreadsheet, data);
    } else {
      appendDefaultSubmission(spreadsheet, data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data submitted successfully' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());

    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet(spreadsheet, sheetName) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  return sheet;
}

function appendDefaultSubmission(spreadsheet, data) {
  var sheet = getOrCreateSheet(spreadsheet, 'Developers');

  if (sheet.getLastRow() === 0) {
    var headers = [
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

  var rowData = [
    new Date().toISOString(),
    data.name || '',
    data.email || '',
    data.invite_code || '',
    data.coding_experience || '',
    (data.ai_tools_used || []).some(function(tool) { return tool.includes('ChatGPT') || tool.includes('Gemini'); }) ? 'Yes' : '',
    (data.ai_tools_used || []).some(function(tool) { return tool.includes('Cursor') || tool.includes('Windsurf'); }) ? 'Yes' : '',
    (data.ai_tools_used || []).some(function(tool) { return tool.includes('Claude Code') || tool.includes('Codex'); }) ? 'Yes' : '',
    (data.ai_tools_used || []).some(function(tool) { return tool.includes('Lovable') || tool.includes('v0') || tool.includes('Replit'); }) ? 'Yes' : '',
    (data.ai_tool_expertise || {}).chatbots || '',
    (data.ai_tool_expertise || {}).ides || '',
    (data.ai_tool_expertise || {}).agents || '',
    (data.ai_tool_expertise || {}).vibe || ''
  ];

  sheet.appendRow(rowData);
}

function appendBusinessSubmission(spreadsheet, data) {
  var sheet = getOrCreateSheet(spreadsheet, 'Business');

  if (sheet.getLastRow() === 0) {
    var headers = [
      'Timestamp',
      'Name',
      'Email',
      'Invite Code',
      'Role',
      'AI Experience',
      'Uses Claude',
      'Uses Claude CoWork',
      'Uses Claude Code',
      'Uses ChatGPT',
      'Uses Gemini',
      'Uses Copilot',
      'Other Tools',
      'Claude Expertise',
      'Claude CoWork Expertise',
      'Claude Code Expertise',
      'ChatGPT Expertise',
      'Gemini Expertise',
      'Copilot Expertise'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  var tools = data.ai_tools_used || [];
  var expertise = data.ai_tool_expertise || {};
  var knownTools = ['Claude', 'Claude CoWork', 'Claude Code', 'ChatGPT', 'Gemini', 'Copilot'];
  var otherTools = tools.filter(function(t) { return knownTools.indexOf(t) === -1; });

  var rowData = [
    new Date().toISOString(),
    data.name || '',
    data.email || '',
    data.invite_code || '',
    data.role || '',
    data.ai_experience || '',
    tools.some(function(t) { return t === 'Claude'; }) ? 'Yes' : '',
    tools.some(function(t) { return t === 'Claude CoWork'; }) ? 'Yes' : '',
    tools.some(function(t) { return t === 'Claude Code'; }) ? 'Yes' : '',
    tools.some(function(t) { return t === 'ChatGPT'; }) ? 'Yes' : '',
    tools.some(function(t) { return t === 'Gemini'; }) ? 'Yes' : '',
    tools.some(function(t) { return t === 'Copilot'; }) ? 'Yes' : '',
    otherTools.join(', '),
    expertise.claude || '',
    expertise['claude-cowork'] || '',
    expertise['claude-code'] || '',
    expertise.chatgpt || '',
    expertise.gemini || '',
    expertise.copilot || ''
  ];

  sheet.appendRow(rowData);
}
