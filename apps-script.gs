/**
 * Matari Coffee Co. — Time Clock sync
 * ------------------------------------------------------------------
 * Paste this into Extensions > Apps Script on the Google Sheet that
 * should hold the hours, then Deploy > New deployment > Web app with
 * "Execute as: Me" and "Who has access: Anyone".
 *
 * The iPad posts here every time somebody punches. Nothing is ever
 * deleted — an edited shift updates its own row in place.
 *
 * OPTIONAL: put any word between the quotes below and type the same
 * word into the app's Settings. Then only your iPad can write here.
 */
const TOKEN = '';

/* Columns A-K are for the manager to read. L-N are bookkeeping the app uses
   to rebuild itself exactly on a replacement iPad — ignore them. */
const PUNCH_HEADERS = ['Shift ID', 'Employee', 'Week Of', 'Date', 'Clock In',
                       'Clock Out', 'Ended', 'Hours', 'Note', 'Edited',
                       'Updated', 'Employee ID', 'In ISO', 'Out ISO'];
const STAFF_HEADERS = ['Employee ID', 'Name', 'Code', 'Active', 'Added'];
const CONFIG_HEADERS = ['Updated', 'Settings'];

/* ---------------------------------------------------------------- */

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}

function sheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight('bold').setBackground('#0C141C').setFontColor('#F2C230');
    sh.setFrozenRows(1);
  }
  return sh;
}

function auth_(tok) {
  return !TOKEN || tok === TOKEN;
}

/* ---------------------------------------------------------------- */

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000);
  } catch (err) {
    return json_({ ok: false, error: 'Sheet busy, try again' });
  }
  try {
    const body = JSON.parse(e.postData.contents);
    if (!auth_(body.token)) return json_({ ok: false, error: 'Wrong sync word' });

    if (body.action === 'ping') {
      return json_({ ok: true, sheet: SpreadsheetApp.getActiveSpreadsheet().getName() });
    }
    if (body.action === 'upsert' || body.action === 'sync') {
      const n = upsertPunches_(body.punches || []);
      if (body.staff) replaceStaff_(body.staff);
      if (body.config) saveConfig_(body.config);
      ensureTotals_();
      return json_({ ok: true, written: n });
    }
    return json_({ ok: false, error: 'Unknown action: ' + body.action });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (!auth_(p.token)) return json_({ ok: false, error: 'Wrong sync word' });

  if (p.action === 'snapshot') {
    return json_({
      ok: true,
      punches: readRows_('Punches', PUNCH_HEADERS),
      staff: readRows_('Staff', STAFF_HEADERS),
      config: readConfig_()
    });
  }
  return json_({ ok: true, sheet: SpreadsheetApp.getActiveSpreadsheet().getName() });
}

/* ---------------------------------------------------------------- */

/** Update a shift's row if we've seen its ID before, otherwise add it. */
function upsertPunches_(rows) {
  if (!rows.length) return 0;
  const sh = sheet_('Punches', PUNCH_HEADERS);
  const last = sh.getLastRow();

  const index = {};
  if (last > 1) {
    const ids = sh.getRange(2, 1, last - 1, 1).getValues();
    for (let i = 0; i < ids.length; i++) index[String(ids[i][0])] = i + 2;
  }

  const appends = [];
  rows.forEach(function (r) {
    const at = index[String(r[0])];
    if (at) sh.getRange(at, 1, 1, PUNCH_HEADERS.length).setValues([r]);
    else appends.push(r);
  });
  if (appends.length) {
    sh.getRange(sh.getLastRow() + 1, 1, appends.length, PUNCH_HEADERS.length)
      .setValues(appends);
  }
  return rows.length;
}

function replaceStaff_(rows) {
  const sh = sheet_('Staff', STAFF_HEADERS);
  if (sh.getLastRow() > 1) {
    sh.getRange(2, 1, sh.getLastRow() - 1, STAFF_HEADERS.length).clearContent();
  }
  if (rows.length) sh.getRange(2, 1, rows.length, STAFF_HEADERS.length).setValues(rows);
}

function saveConfig_(cfg) {
  const sh = sheet_('Config', CONFIG_HEADERS);
  if (sh.getLastRow() > 1) {
    sh.getRange(2, 1, sh.getLastRow() - 1, CONFIG_HEADERS.length).clearContent();
  }
  // A cell holds 50k characters; settings are far under that, but guard anyway.
  sh.getRange(2, 1, 1, 2).setValues([[new Date(), String(cfg).slice(0, 45000)]]);
}

function readRows_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(name);
  if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, headers.length).getValues()
    .filter(function (r) { return String(r[0]).length > 0; });
}

function readConfig_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName('Config');
  if (!sh || sh.getLastRow() < 2) return null;
  return sh.getRange(2, 2).getValue() || null;
}

/** A live per-week, per-person total the manager can just look at. */
function ensureTotals_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Totals')) return;
  const sh = ss.insertSheet('Totals');
  sh.getRange('A1').setFormula(
    '=QUERY(Punches!A2:N,"select C, B, sum(H) where B is not null ' +
    'group by C, B order by C desc ' +
    'label C \'Week Of\', B \'Employee\', sum(H) \'Hours\'",0)'
  );
  sh.getRange('A1:C1').setFontWeight('bold');
  sh.setColumnWidth(1, 130);
  sh.setColumnWidth(2, 160);
}
