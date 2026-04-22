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
  var sheet = getOrCreateSheet(spreadsheet, 'Sheet1');

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
      'Writing & Communications',
      'Data Analysis & Insights',
      'Research & Strategy',
      'Process Automation',
      'Writing Expertise',
      'Analysis Expertise',
      'Research Expertise',
      'Automation Expertise'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  var useCases = data.use_cases || [];
  var expertise = data.use_case_expertise || {};

  var rowData = [
    new Date().toISOString(),
    data.name || '',
    data.email || '',
    data.invite_code || '',
    data.role || '',
    data.ai_experience || '',
    useCases.some(function(uc) { return uc.includes('Writing'); }) ? 'Yes' : '',
    useCases.some(function(uc) { return uc.includes('Data Analysis'); }) ? 'Yes' : '',
    useCases.some(function(uc) { return uc.includes('Research'); }) ? 'Yes' : '',
    useCases.some(function(uc) { return uc.includes('Process Automation'); }) ? 'Yes' : '',
    expertise.writing || '',
    expertise.analysis || '',
    expertise.research || '',
    expertise.automation || ''
  ];

  sheet.appendRow(rowData);
}
