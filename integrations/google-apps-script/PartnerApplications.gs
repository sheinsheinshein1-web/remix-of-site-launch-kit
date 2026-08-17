const PARTNER_APPLICATIONS = {
  sheetName: "Заявки",
  headers: [
    "Дата и время",
    "Название компании",
    "ИНН",
    "Формат сотрудничества",
    "Сайт",
    "Контактное лицо",
    "Телефон",
    "Страница",
    "Статус",
    "Ответственный",
    "Комментарий",
  ],
  responseSource: "mnogomesta-partner-application",
};

function setupPartnerApplications() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error("Откройте скрипт из нужной Google Таблицы");

  PropertiesService.getScriptProperties().setProperty("SPREADSHEET_ID", spreadsheet.getId());

  let sheet = spreadsheet.getSheetByName(PARTNER_APPLICATIONS.sheetName);
  if (!sheet) sheet = spreadsheet.insertSheet(PARTNER_APPLICATIONS.sheetName);

  const headerRange = sheet.getRange(1, 1, 1, PARTNER_APPLICATIONS.headers.length);
  headerRange.setValues([PARTNER_APPLICATIONS.headers]);
  headerRange.setFontWeight("bold");
  sheet.setFrozenRows(1);
  sheet.getRange("A:A").setNumberFormat("dd.mm.yyyy hh:mm:ss");

  if (!sheet.getFilter()) {
    sheet.getRange(1, 1, Math.max(sheet.getMaxRows(), 2), PARTNER_APPLICATIONS.headers.length).createFilter();
  }
}

function doPost(event) {
  const requestId = String((event && event.parameter && event.parameter.requestId) || "");

  try {
    const data = event && event.parameter ? event.parameter : {};
    validatePartnerApplication_(data);

    if (data.fax) return partnerApplicationResponse_({ requestId: requestId, ok: true });

    const cache = CacheService.getScriptCache();
    const cacheKey = "partner-application:" + requestId;
    if (requestId && cache.get(cacheKey)) {
      return partnerApplicationResponse_({ requestId: requestId, ok: true });
    }

    const properties = PropertiesService.getScriptProperties();
    validateSourceHost_(data.sourceUrl, properties.getProperty("ALLOWED_HOSTS"));

    const spreadsheetId = properties.getProperty("SPREADSHEET_ID");
    if (!spreadsheetId) throw new Error("Не задан SPREADSHEET_ID");

    const lock = LockService.getScriptLock();
    lock.waitLock(5000);

    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      const sheet = spreadsheet.getSheetByName(PARTNER_APPLICATIONS.sheetName);
      if (!sheet) throw new Error("Не найден лист «" + PARTNER_APPLICATIONS.sheetName + "»");

      sheet.appendRow([
        new Date(),
        safeCell_(data.companyName),
        safeCell_(data.inn),
        safeCell_(data.interest),
        safeCell_(data.website),
        safeCell_(data.contactName),
        safeCell_(data.phone),
        safeCell_(data.sourceUrl),
        "Новая",
        "",
        "",
      ]);
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }

    if (requestId) cache.put(cacheKey, "1", 600);
    sendPartnerApplicationEmail_(data, properties.getProperty("NOTIFICATION_EMAIL"));

    return partnerApplicationResponse_({ requestId: requestId, ok: true });
  } catch (error) {
    console.error(error);
    return partnerApplicationResponse_({
      requestId: requestId,
      ok: false,
      message: "Не удалось записать заявку",
    });
  }
}

function validatePartnerApplication_(data) {
  if (!data.companyName || String(data.companyName).trim().length > 200) throw new Error("Некорректное название компании");
  if (!/^\d{10}$|^\d{12}$/.test(String(data.inn || "").trim())) throw new Error("Некорректный ИНН");
  if (data.activityType !== "Модульные дома") throw new Error("Некорректный вид деятельности");
  if (!data.interest || String(data.interest).trim().length > 200) throw new Error("Не выбран формат сотрудничества");
  if (!data.contactName || String(data.contactName).trim().length > 100) throw new Error("Некорректное контактное лицо");
  if (String(data.phone || "").replace(/\D/g, "").length < 10) throw new Error("Некорректный телефон");
  if (String(data.website || "").length > 300) throw new Error("Некорректный сайт");
  if (!data.sourceUrl || String(data.sourceUrl).length > 1000) throw new Error("Не указана страница заявки");
}

function validateSourceHost_(sourceUrl, allowedHostsValue) {
  if (!allowedHostsValue) return;

  const match = String(sourceUrl || "").match(/^https?:\/\/([^/:?#]+)/i);
  const sourceHost = match ? match[1].toLowerCase() : "";
  const allowedHosts = allowedHostsValue
    .split(",")
    .map(function (host) { return host.trim().toLowerCase(); })
    .filter(Boolean);

  if (!sourceHost || allowedHosts.indexOf(sourceHost) === -1) throw new Error("Недопустимый источник заявки");
}

function safeCell_(value) {
  const text = String(value || "").trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function sendPartnerApplicationEmail_(data, recipient) {
  if (!recipient) return;

  const lines = [
    "Новая заявка производителя",
    "",
    "Компания: " + data.companyName,
    "ИНН: " + data.inn,
    "Формат сотрудничества: " + data.interest,
    data.website ? "Сайт: " + data.website : null,
    "Контактное лицо: " + data.contactName,
    "Телефон: " + data.phone,
    "Страница: " + data.sourceUrl,
  ].filter(Boolean);

  try {
    MailApp.sendEmail({
      to: recipient,
      subject: "Новая заявка: " + data.companyName,
      body: lines.join("\n"),
      name: "Много места",
    });
  } catch (error) {
    console.error("Заявка записана, но письмо не отправлено", error);
  }
}

function partnerApplicationResponse_(result) {
  const payload = JSON.stringify({
    source: PARTNER_APPLICATIONS.responseSource,
    requestId: result.requestId,
    ok: result.ok,
    message: result.message || "",
  }).replace(/</g, "\\u003c");

  return HtmlService.createHtmlOutput(
    "<!doctype html><meta charset=\"utf-8\"><script>" +
    "window.parent.postMessage(" + payload + ", '*');" +
    "</script>"
  );
}
