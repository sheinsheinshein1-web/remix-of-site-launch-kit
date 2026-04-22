import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowLeft, ChevronDown } from "lucide-react";

const activityTypes = [
  "Модульные дома",
  "Дачные домики",
  "Двухэтажные дома",
  "Студии",
  "Гостевые дома",
  "Бани и сауны",
  "Бани-бочки",
  "Купели и чаны",
  "Беседки",
  "Террасы",
  "Барбекю-зоны",
  "Глэмпинг",
  "Магазины",
  "Офисы",
  "Мастерские",
  "Гостиницы",
  "Кафе и рестораны",
  "Бытовки",
  "Гаражи",
  "Навесы",
  "Заборы",
  "Септики",
  "Скважины",
  "Другое",
];

interface PartnerApplicationFormProps {
  onBack: () => void;
  variant?: "page" | "drawer";
}

const PartnerApplicationForm = ({ onBack, variant = "page" }: PartnerApplicationFormProps) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "",
    inn: "",
    activityType: "",
    website: "",
    contactName: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.companyName.trim()) e.companyName = "Укажите название компании";
    if (!form.inn.trim()) e.inn = "Укажите ИНН";
    else if (!/^\d{10}$|^\d{12}$/.test(form.inn.trim())) e.inn = "ИНН должен содержать 10 или 12 цифр";
    if (!form.activityType) e.activityType = "Выберите вид деятельности";
    if (!form.contactName.trim()) e.contactName = "Укажите контактное лицо";
    if (!form.phone.trim()) e.phone = "Укажите телефон";
    else if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Введите корректный номер";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const submittedAt = new Date().toISOString();
    // Save to localStorage for now
    localStorage.setItem("partner_application", JSON.stringify({ ...form, submittedAt }));

    // Отправка уведомления в Telegram через тот же мост, что и поддержка
    const API = "https://sheinsheinshein1-web-chat-telegram-bridge-77c4.twc1.net";
    const sessionKey = "partner_application_session";
    let session = localStorage.getItem(sessionKey);
    if (!session) {
      session = `partner_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem(sessionKey, session);
    }

    const text =
      `🆕 Новая заявка на партнёрство\n\n` +
      `Компания: ${form.companyName}\n` +
      `ИНН: ${form.inn}\n` +
      `Вид деятельности: ${form.activityType}\n` +
      (form.website ? `Сайт: ${form.website}\n` : "") +
      `Контактное лицо: ${form.contactName}\n` +
      `Телефон: ${form.phone}\n` +
      `Время: ${new Date(submittedAt).toLocaleString("ru-RU")}`;

    // fire-and-forget — не блокируем переход в чат
    fetch(`${API}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session, text }),
    }).catch(() => {
      // сеть недоступна — заявка уже сохранена локально
    });

    navigate("/messages/partner?start=1");
  };

  const inputClass = (field: string) =>
    `w-full h-12 px-4 rounded-xl border text-[14px] text-foreground bg-secondary outline-none transition-colors ${
      errors[field] ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
    }`;

  const inputStyle = { fontSize: "16px" } as const;

  return (
    <div className={variant === "drawer" ? "px-4 py-5" : ""}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0 hover:bg-border transition-colors">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <div>
          <h2 className="text-[20px] font-extrabold text-foreground leading-tight">Заявка на подключение</h2>
          <p className="text-[13px] text-muted-foreground">Заполните данные о компании</p>
        </div>
      </div>

      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
        <Building2 className="w-7 h-7 text-primary" />
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4">
        {/* Company name */}
        <div>
          <label className="text-[13px] font-medium text-foreground mb-1.5 block">Название компании *</label>
          <input
            type="text"
            placeholder='ООО "Модульные решения"'
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            className={inputClass("companyName")}
            maxLength={200}
            style={inputStyle}
          />
          {errors.companyName && <p className="text-[12px] text-red-500 mt-1">{errors.companyName}</p>}
        </div>

        {/* INN */}
        <div>
          <label className="text-[13px] font-medium text-foreground mb-1.5 block">ИНН *</label>
          <input
            type="text"
            placeholder="1234567890"
            value={form.inn}
            onChange={(e) => update("inn", e.target.value.replace(/\D/g, "").slice(0, 12))}
            className={inputClass("inn")}
            inputMode="numeric"
            style={inputStyle}
          />
          {errors.inn && <p className="text-[12px] text-red-500 mt-1">{errors.inn}</p>}
        </div>

        {/* Activity type */}
        <div>
          <label className="text-[13px] font-medium text-foreground mb-1.5 block">Вид деятельности *</label>
          <div className="relative">
            <select
              value={form.activityType}
              onChange={(e) => update("activityType", e.target.value)}
              className={`${inputClass("activityType")} appearance-none pr-10 ${!form.activityType ? "text-muted-foreground" : ""}`}
              style={inputStyle}
            >
              <option value="" disabled>Выберите вид деятельности</option>
              {activityTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          {errors.activityType && <p className="text-[12px] text-red-500 mt-1">{errors.activityType}</p>}
        </div>

        <div>
          <label className="text-[13px] font-medium text-foreground mb-1.5 block">Сайт компании</label>
          <input
            type="url"
            placeholder="https://example.ru"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            className={inputClass("website")}
            maxLength={300}
            style={inputStyle}
          />
        </div>

        {/* Contact name */}
        <div>
          <label className="text-[13px] font-medium text-foreground mb-1.5 block">Контактное лицо *</label>
          <input
            type="text"
            placeholder="Иван Петров"
            value={form.contactName}
            onChange={(e) => update("contactName", e.target.value)}
            className={inputClass("contactName")}
            maxLength={100}
            style={inputStyle}
          />
          {errors.contactName && <p className="text-[12px] text-red-500 mt-1">{errors.contactName}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="text-[13px] font-medium text-foreground mb-1.5 block">Телефон *</label>
          <input
            type="tel"
            placeholder="+7 (999) 123-45-67"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass("phone")}
            maxLength={20}
            style={inputStyle}
          />
          {errors.phone && <p className="text-[12px] text-red-500 mt-1">{errors.phone}</p>}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full h-[52px] bg-primary text-primary-foreground rounded-xl text-[15px] font-bold hover:opacity-90 transition-opacity mt-6"
      >
        Отправить заявку
      </button>

      <p className="text-[11px] text-muted-foreground text-center mt-3 leading-relaxed">
        Нажимая «Отправить заявку», вы соглашаетесь с условиями использования сервиса
      </p>
    </div>
  );
};

export default PartnerApplicationForm;
