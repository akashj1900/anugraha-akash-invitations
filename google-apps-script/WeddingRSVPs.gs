/** Paste into Extensions > Apps Script in the supplied wedding spreadsheet. */
const RSVP_SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('RSVP_SPREADSHEET_ID');
const RSVP_HEADERS = ['Name', 'Attendance', 'Guest count', 'Note', 'Submitted at (IST)', 'Response reference'];

function doGet() {
  return reply_({ok: false, code: 'post_required'});
}

function doPost(e) {
  const props = PropertiesService.getScriptProperties();
  const secret = props.getProperty('RSVP_CONNECTION_SECRET');
  let request;
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw || raw.length > 20000) throw new Error('invalid');
    request = JSON.parse(raw);
  } catch (_) {
    return reply_({ok: false, code: 'invalid_record'});
  }
  if (!secret || secret.length < 32 || !request || !sameSecret_(request.secret, secret)) {
    return reply_({ok: false, code: 'unauthorized'});
  }
  if (request.action !== 'check' && request.action !== 'append') {
    return reply_({ok: false, code: 'invalid_record'});
  }
  if (request.action === 'append' && !validRecord_(request.record)) {
    return reply_({ok: false, code: 'invalid_record'});
  }
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(25000)) return reply_({ok: false, code: 'busy'});
  try {
    const sheet = destination_(props);
    if (request.action === 'check') {
      return reply_({ok: true, tab_name: sheet.getName(), tab_id: sheet.getSheetId()});
    }
    const record = request.record;
    const last = sheet.getLastRow();
    // Check on EVERY request, including the first attempt following a timeout.
    // The check and write share one script lock across concurrent callers.
    const existing = last > 1 && sheet.getRange(2, 6, last - 1, 1)
      .createTextFinder(record.id).matchEntireCell(true).useRegularExpression(false).findNext();
    if (existing) return reply_({ok: true, reference: record.id, result: 'already_saved'});
    const row = last + 1;
    if (row > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), 100);
    const submitted = Utilities.formatDate(new Date(record.timestamp), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss') + ' IST';
    // A leading apostrophe forces literal text, even for =, +, -, @, tabs,
    // leading whitespace and an apostrophe originally entered by the guest.
    sheet.getRange(row, 1, 1, 6).setValues([[
      literal_(record.name), record.attendance === 'yes' ? 'Attending' : 'Declining',
      record.guest_count, literal_(record.note || ''), submitted, record.id,
    ]]);
    SpreadsheetApp.flush();
    return reply_({ok: true, reference: record.id, result: 'appended'});
  } catch (error) {
    const safe = ['destination_missing', 'headers_changed'];
    const code = safe.indexOf(error.message) >= 0 ? error.message : 'delivery_failed';
    // Never return exception details or guest rows to callers.
    return reply_({ok: false, code: code});
  } finally {
    lock.releaseLock();
  }
}

function destination_(props) {
  const book = SpreadsheetApp.openById(RSVP_SPREADSHEET_ID);
  const savedId = props.getProperty('RSVP_TAB_ID');
  if (savedId !== null) {
    const existing = book.getSheets().filter(function(s) { return String(s.getSheetId()) === savedId; })[0];
    if (!existing) throw new Error('destination_missing');
    const headers = existing.getRange(1, 1, 1, 6).getValues()[0];
    if (JSON.stringify(headers) !== JSON.stringify(RSVP_HEADERS)) throw new Error('headers_changed');
    return existing;
  }
  let name = 'Wedding RSVPs';
  let suffix = 2;
  while (book.getSheetByName(name)) name = 'Wedding RSVPs (' + suffix++ + ')';
  const sheet = book.insertSheet(name);
  sheet.getRange(1, 1, 1, 6).setValues([RSVP_HEADERS])
    .setFontWeight('bold').setBackground('#2A0F45').setFontColor('#F4EBDB');
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 190);
  sheet.setColumnWidth(2, 125);
  sheet.setColumnWidth(3, 115);
  sheet.setColumnWidth(4, 360);
  sheet.setColumnWidth(5, 195);
  sheet.getRange('D:D').setWrap(true);
  sheet.hideColumns(6);
  SpreadsheetApp.flush();
  props.setProperty('RSVP_TAB_ID', String(sheet.getSheetId()));
  return sheet;
}

function validRecord_(r) {
  return r && typeof r.id === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(r.id)
    && typeof r.name === 'string' && r.name.trim().length > 0 && r.name.length <= 120
    && (r.attendance === 'yes' || r.attendance === 'no')
    && Number.isInteger(r.guest_count) && r.guest_count >= 1 && r.guest_count <= 1000
    && (r.note === undefined || (typeof r.note === 'string' && r.note.length <= 2000))
    && typeof r.timestamp === 'string' && /(?:Z|[+-]\d{2}:\d{2})$/.test(r.timestamp)
    && !isNaN(new Date(r.timestamp).getTime());
}

function sameSecret_(provided, expected) {
  if (typeof provided !== 'string' || provided.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) mismatch |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  return mismatch === 0;
}

function literal_(value) {
  return value === '' ? '' : "'" + value;
}

function reply_(body) {
  if (body.ok) {
    body.protocol = 1;
    body.spreadsheet_id = RSVP_SPREADSHEET_ID;
  }
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}