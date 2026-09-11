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

const PROJECT_QUOTE_APPLICATIONS = {
  sheetName: "Заявки покупателей",
  headers: [
    "Дата и время",
    "ID заявки",
    "Основной проект",
    "ID проекта",
    "Производитель",
    "Площадь",
    "Стоимость",
    "Регион доставки",
    "Статус участка",
    "Адрес или район",
    "Способ оплаты",
    "Банк",
    "Срок строительства",
    "Имя",
    "Телефон",
    "Дополнительные проекты",
    "Страница",
    "Статус",
    "Ответственный",
    "Комментарий",
  ],
  responseSource: "mnogomesta-project-quote-application",
};

function setupPartnerApplications() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error("Откройте скрипт из нужной Google Таблицы");

  PropertiesService.getScriptProperties().setProperty("SPREADSHEET_ID", spreadsheet.getId());
  ensureApplicationSheet_(spreadsheet, PARTNER_APPLICATIONS);
  ensureApplicationSheet_(spreadsheet, PROJECT_QUOTE_APPLICATIONS);
}

function doPost(event) {
  const data = event && event.parameter ? event.parameter : {};
  const requestId = String(data.requestId || "");
  const config = data.applicationType === "projectQuote"
    ? PROJECT_QUOTE_APPLICATIONS
    : PARTNER_APPLICATIONS;

  try {
    if (data.applicationType === "projectQuote") {
      handleProjectQuoteApplication_(data, requestId);
    } else {
      handlePartnerApplication_(data, requestId);
    }

    return applicationResponse_(config, { requestId: requestId, ok: true });
  } catch (error) {
    console.error(error);
    return applicationResponse_(config, {
      requestId: requestId,
      ok: false,
      message: "Не удалось записать заявку",
    });
  }
}

function handlePartnerApplication_(data, requestId) {
  validatePartnerApplication_(data);
  if (data.fax || isDuplicateRequest_("partner-application", requestId)) return;

  const properties = PropertiesService.getScriptProperties();
  validateSourceHost_(data.sourceUrl, properties.getProperty("ALLOWED_HOSTS"));
  const spreadsheet = getApplicationSpreadsheet_(properties);
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);

  try {
    const sheet = ensureApplicationSheet_(spreadsheet, PARTNER_APPLICATIONS);
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

  rememberRequest_("partner-application", requestId);
  sendPartnerApplicationEmail_(data, properties.getProperty("NOTIFICATION_EMAIL"));
}

function handleProjectQuoteApplication_(data, requestId) {
  validateProjectQuoteApplication_(data);
  if (data.fax || isDuplicateRequest_("project-quote-application", requestId)) return;

  const properties = PropertiesService.getScriptProperties();
  validateSourceHost_(data.sourceUrl, properties.getProperty("ALLOWED_HOSTS"));
  const spreadsheet = getApplicationSpreadsheet_(properties);
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  let updatedExistingLead = false;

  try {
    const sheet = ensureApplicationSheet_(spreadsheet, PROJECT_QUOTE_APPLICATIONS);
    const existingRow = findProjectQuoteRow_(sheet, data.leadId);
    const existingValues = existingRow
      ? sheet.getRange(existingRow, 1, 1, PROJECT_QUOTE_APPLICATIONS.headers.length).getValues()[0]
      : [];
    const row = [
      existingValues[0] || new Date(),
      safeCell_(data.leadId),
      safeCell_(data.projectName),
      safeCell_(data.projectId),
      safeCell_(data.manufacturerName),
      safeCell_(data.area),
      safeCell_(data.price),
      safeCell_(data.deliveryRegion),
      safeCell_(data.plotStatus),
      safeCell_(data.location),
      safeCell_(data.payment),
      safeCell_(data.bank),
      safeCell_(data.timing),
      safeCell_(data.contactName),
      safeCell_(data.phone),
      safeCell_(data.alternativeProjects) || existingValues[15] || "",
      safeCell_(data.sourceUrl),
      existingValues[17] || "Новая",
      existingValues[18] || "",
      existingValues[19] || "",
    ];

    if (existingRow) {
      sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
      updatedExistingLead = true;
    } else {
      sheet.appendRow(row);
    }
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }

  rememberRequest_("project-quote-application", requestId);
  sendProjectQuoteEmail_(data, properties.getProperty("NOTIFICATION_EMAIL"), updatedExistingLead);
}

function ensureApplicationSheet_(spreadsheet, config) {
  let sheet = spreadsheet.getSheetByName(config.sheetName);
  if (!sheet) sheet = spreadsheet.insertSheet(config.sheetName);

  const headerRange = sheet.getRange(1, 1, 1, config.headers.length);
  headerRange.setValues([config.headers]);
  headerRange.setFontWeight("bold");
  sheet.setFrozenRows(1);
  sheet.getRange("A:A").setNumberFormat("dd.mm.yyyy hh:mm:ss");

  if (!sheet.getFilter()) {
    sheet.getRange(1, 1, Math.max(sheet.getMaxRows(), 2), config.headers.length).createFilter();
  }

  return sheet;
}

function getApplicationSpreadsheet_(properties) {
  const spreadsheetId = properties.getProperty("SPREADSHEET_ID");
  if (!spreadsheetId) throw new Error("Не задан SPREADSHEET_ID");
  return SpreadsheetApp.openById(spreadsheetId);
}

function findProjectQuoteRow_(sheet, leadId) {
  if (!leadId || sheet.getLastRow() < 2) return 0;
  const match = sheet
    .getRange(2, 2, sheet.getLastRow() - 1, 1)
    .createTextFinder(String(leadId))
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : 0;
}

function isDuplicateRequest_(prefix, requestId) {
  return Boolean(requestId && CacheService.getScriptCache().get(prefix + ":" + requestId));
}

function rememberRequest_(prefix, requestId) {
  if (requestId) CacheService.getScriptCache().put(prefix + ":" + requestId, "1", 600);
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

function validateProjectQuoteApplication_(data) {
  if (!data.leadId || String(data.leadId).length > 120) throw new Error("Некорректный ID заявки");
  if (!data.projectName || String(data.projectName).trim().length > 300) throw new Error("Некорректный проект");
  if (!data.manufacturerName || String(data.manufacturerName).trim().length > 200) throw new Error("Некорректный производитель");
  if (!data.plotStatus || String(data.plotStatus).length > 100) throw new Error("Не указан статус участка");
  if (!data.payment || String(data.payment).length > 100) throw new Error("Не указан способ оплаты");
  if (!data.timing || String(data.timing).length > 100) throw new Error("Не указан срок строительства");
  if (!data.contactName || String(data.contactName).trim().length > 100) throw new Error("Некорректное имя");
  if (String(data.phone || "").replace(/\D/g, "").length < 10) throw new Error("Некорректный телефон");
  if (String(data.location || "").length > 1000) throw new Error("Слишком длинный адрес");
  if (String(data.alternativeProjects || "").length > 5000) throw new Error("Слишком много дополнительных проектов");
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
  sendApplicationEmail_(recipient, "Новая заявка: " + data.companyName, lines);
}

function sendProjectQuoteEmail_(data, recipient, updatedExistingLead) {
  if (!recipient) return;
  const lines = [
    updatedExistingLead ? "Заявка покупателя дополнена проектами" : "Новая заявка покупателя",
    "",
    "Проект: " + data.projectName,
    "Производитель: " + data.manufacturerName,
    "Регион доставки: " + data.deliveryRegion,
    "Статус участка: " + data.plotStatus,
    "Адрес или район: " + data.location,
    "Способ оплаты: " + data.payment,
    data.bank ? "Банк: " + data.bank : null,
    "Срок строительства: " + data.timing,
    data.alternativeProjects ? "Дополнительные проекты:\n" + data.alternativeProjects : null,
    "Имя: " + data.contactName,
    "Телефон: " + data.phone,
    "Страница: " + data.sourceUrl,
  ].filter(Boolean);
  sendApplicationEmail_(recipient, "Заявка на расчёт: " + data.projectName, lines);
}

function sendApplicationEmail_(recipient, subject, lines) {
  try {
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      body: lines.join("\n"),
      name: "Много места",
    });
  } catch (error) {
    console.error("Заявка записана, но письмо не отправлено", error);
  }
}

function applicationResponse_(config, result) {
  const payload = JSON.stringify({
    source: config.responseSource,
    requestId: result.requestId,
    ok: result.ok,
    message: result.message || "",
  }).replace(/</g, "\\u003c");

  return HtmlService.createHtmlOutput(
    "<!doctype html><meta charset=\"utf-8\"><script>" +
    "window.top.postMessage(" + payload + ", '*');" +
    "</script>"
  );
}
